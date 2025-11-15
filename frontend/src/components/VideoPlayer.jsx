import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Center,
  Spinner,
  VStack,
  Text,
  Button,
  HStack,
  Tooltip,
  useToast,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { ChevronLeftIcon, RepeatIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { getOptimizedVideoUrl } from '../utils/videoUtils';
import { FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const MotionBox = motion.create(Box);

/**
 * VideoPlayer component for displaying videos in a modal overlay
 * 
 * @param {Object} project - The project containing video information
 * @param {Function} onClose - Function to call when closing the player
 */
const VideoPlayer = ({ project, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState('auto');
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const toast = useToast();
  
  // Get video URL from project with selected quality
  const videoUrl = project.videoUrl || 
    (project.video && project.video.id ? getOptimizedVideoUrl(project.video.id, quality) : null);
  
  useEffect(() => {
    // Reset state when video changes
    setIsLoading(true);
    setLoadingProgress(0);
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    
    // Preload video metadata
    if (videoRef.current && videoUrl) {
      videoRef.current.load();
    }
    
    // Add event listeners for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      // Remove event listeners
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [videoUrl]);
  
  const handleVideoLoaded = () => {
    setIsLoading(false);
    setDuration(videoRef.current?.duration || 0);
    
    // Auto-play when loaded
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Error auto-playing video:', err);
          setIsPlaying(false);
        });
    }
  };
  
  const handleLoadProgress = (e) => {
    if (e.lengthComputable && e.total > 0) {
      setLoadingProgress((e.loaded / e.total) * 100);
    }
  };
  
  const handleVideoError = (e) => {
    console.error('Video error:', e);
    setError('Failed to load video. Please try again later.');
    setIsLoading(false);
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play()
          .catch(err => {
            console.error('Error playing video:', err);
            toast({
              title: 'Playback Error',
              description: 'Could not play the video. Please try again.',
              status: 'error',
              duration: 3000,
            });
          });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };
  
  const handleFullscreenChange = () => {
    setIsFullscreen(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };
  
  const handleVolumeToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
      } else {
        videoRef.current.volume = 0;
      }
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVolumeChange = (value) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      if (value > 0 && isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      } else if (value === 0 && !isMuted) {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
      setVolume(value);
    }
  };
  
  const handleSeek = (value) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };
  
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setLoadingProgress(0);
    
    if (videoRef.current) {
      videoRef.current.load();
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // If no video URL is available, show an error message
  if (!videoUrl) {
    return (
      <MotionBox
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.900"
        zIndex={1000}
        display="flex"
        alignItems="center"
        justifyContent="center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <VStack spacing={4}>
          <Text color="white" fontSize="xl">Video not available</Text>
          <Button colorScheme="gold" onClick={onClose}>Close</Button>
        </VStack>
      </MotionBox>
    );
  }
  
  return (
    <MotionBox
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="blackAlpha.900"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Close button */}
      <Box position="absolute" top={4} right={4} zIndex={2}>
        <IconButton
          icon={<ChevronLeftIcon />}
          aria-label="Close"
          colorScheme="whiteAlpha"
          onClick={onClose}
          size="lg"
          borderRadius="full"
        />
      </Box>
      
      {/* Video container */}
      <Box 
        ref={containerRef}
        maxW="90%" 
        maxH="90%" 
        position="relative"
        borderRadius="8px"
        overflow="hidden"
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.5)"
      >
        {/* Loading spinner */}
        {isLoading && (
          <Center
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.700"
            zIndex={1}
            flexDirection="column"
          >
            <Spinner size="xl" color="gold.400" thickness="4px" mb={4} />
            {loadingProgress > 0 && (
              <Text color="white" fontSize="sm">
                Loading: {Math.round(loadingProgress)}%
              </Text>
            )}
          </Center>
        )}
        
        {/* Error message */}
        {error && (
          <Center
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.700"
            zIndex={1}
            flexDirection="column"
            p={8}
          >
            <Text color="white" fontSize="lg" mb={4} textAlign="center">
              {error}
            </Text>
            <Button
              leftIcon={<RepeatIcon />}
              colorScheme="gold"
              onClick={handleRetry}
            >
              Retry
            </Button>
          </Center>
        )}
        
        {/* Video element */}
        <video
          ref={videoRef}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '90vh',
            display: 'block'
          }}
          onLoadedData={handleVideoLoaded}
          onTimeUpdate={handleTimeUpdate}
          onError={handleVideoError}
          onProgress={handleLoadProgress}
          onEnded={() => setIsPlaying(false)}
          playsInline
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video controls */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={4}
          bg="linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))"
          opacity={isLoading ? 0 : 1}
          transition="opacity 0.3s"
          zIndex={1}
        >
          {/* Progress bar */}
          <Slider
            aria-label="video progress"
            value={currentTime}
            min={0}
            max={duration || 100}
            onChange={handleSeek}
            mb={2}
            colorScheme="gold"
          >
            <SliderTrack bg="whiteAlpha.200">
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={3} />
          </Slider>
          
          <HStack justifyContent="space-between">
            <HStack spacing={2}>
              <IconButton
                icon={isPlaying ? <FaPause /> : <FaPlay />}
                aria-label={isPlaying ? "Pause" : "Play"}
                variant="ghost"
                color="white"
                onClick={handlePlayPause}
                size="sm"
              />
              
              <HStack spacing={2} width="120px">
                <IconButton
                  icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  variant="ghost"
                  color="white"
                  onClick={handleVolumeToggle}
                  size="sm"
                />
                
                <Slider
                  aria-label="volume"
                  value={isMuted ? 0 : volume}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={handleVolumeChange}
                  width="80px"
                  colorScheme="gold"
                >
                  <SliderTrack bg="whiteAlpha.200">
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={2} />
                </Slider>
              </HStack>
              
              <Text color="white" fontSize="sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </HStack>
            
            <HStack spacing={2}>
              <Tooltip label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <IconButton
                  icon={isFullscreen ? <FaCompress /> : <FaExpand />}
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  variant="ghost"
                  color="white"
                  onClick={handleFullscreenToggle}
                  size="sm"
                />
              </Tooltip>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </MotionBox>
  );
};

export default VideoPlayer; 