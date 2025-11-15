import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  AspectRatio,
  Spinner,
  Icon,
  Text,
  Image,
  useToast
} from '@chakra-ui/react';
import { FaPlay } from 'react-icons/fa';

const ProjectVideo = ({ videoUrl, thumbnail }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const toast = useToast();

  // Handle both object and string video URLs
  const actualVideoUrl = typeof videoUrl === 'object' ? videoUrl.url : videoUrl;
  const actualThumbnail = thumbnail || (typeof videoUrl === 'object' ? videoUrl.thumbnail : null);

  // Transform Cloudinary URL for better performance
  const optimizedVideoUrl = actualVideoUrl?.replace('/upload/', '/upload/q_auto,f_auto,c_limit/');
  const optimizedThumbnail = actualThumbnail || actualVideoUrl?.replace('/upload/', '/upload/w_640,h_360,c_fill,g_center,q_auto,f_auto/');

  useEffect(() => {
    if (!actualVideoUrl) {
      setError('No video URL provided');
      setIsLoading(false);
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = optimizedVideoUrl;

    video.onloadedmetadata = () => {
      setIsVideoReady(true);
      setIsLoading(false);
    };

    video.onerror = () => {
      setError('Failed to load video');
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to load video',
        status: 'error',
        duration: 3000,
      });
    };

    return () => {
      video.remove();
    };
  }, [optimizedVideoUrl, toast, actualVideoUrl]);

  const handlePlay = () => {
    if (!isVideoReady) {
      toast({
        title: 'Please wait',
        description: 'Video is still loading...',
        status: 'info',
        duration: 2000,
      });
      return;
    }

    setIsLoading(true);
    setIsPlaying(true);

    if (videoRef.current) {
      videoRef.current.playsInline = true;
      videoRef.current.controls = true;
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error playing video:', error);
            setIsLoading(false);
            setIsPlaying(false);
            setError('Failed to play video');
            toast({
              title: 'Error',
              description: 'Failed to play video',
              status: 'error',
              duration: 3000,
            });
          });
      }
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    setIsVideoReady(true);
  };

  const handleError = (e) => {
    console.error('Video error:', e);
    setIsLoading(false);
    setIsPlaying(false);
    setError('Error loading video');
    toast({
      title: 'Error',
      description: 'Failed to load video',
      status: 'error',
      duration: 3000,
    });
  };

  if (!actualVideoUrl) {
    return (
      <Box
        w="full"
        h="200px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.900"
        borderRadius="xl"
      >
        <Text color="white">No video available</Text>
      </Box>
    );
  }

  if (!isPlaying) {
    return (
      <Box
        w="full"
        position="relative"
        cursor="pointer"
        onClick={handlePlay}
        borderRadius="xl"
        overflow="hidden"
      >
        <AspectRatio ratio={16 / 9}>
          <Box
            bg="gray.900"
            position="relative"
            backgroundImage={optimizedThumbnail ? `url(${optimizedThumbnail})` : "none"}
            backgroundSize="cover"
            backgroundPosition="center"
          >
            {optimizedThumbnail && (
              <Image
                src={optimizedThumbnail}
                alt="Video thumbnail"
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                objectFit="cover"
                loading="eager"
                onLoad={() => setIsVideoReady(true)}
              />
            )}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="blackAlpha.500"
              transition="all 0.3s"
              _hover={{ bg: "blackAlpha.700" }}
            >
              {isLoading ? (
                <Spinner size="xl" color="white" thickness="4px" />
              ) : (
                <>
                  <Icon
                    as={FaPlay}
                    color="white"
                    boxSize={16}
                    opacity={0.8}
                    transition="all 0.3s"
                    _hover={{ transform: "scale(1.1)", opacity: 1 }}
                  />
                  <Text
                    position="absolute"
                    bottom="20px"
                    color="white"
                    fontWeight="bold"
                  >
                    {error ? 'Error loading video' : isVideoReady ? 'Click to play' : 'Loading...'}
                  </Text>
                </>
              )}
            </Box>
          </Box>
        </AspectRatio>
      </Box>
    );
  }

  return (
    <Box w="full" position="relative" borderRadius="xl" overflow="hidden">
      <AspectRatio ratio={16 / 9}>
        <Box position="relative">
          {isLoading && (
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="blackAlpha.700"
              zIndex={1}
            >
              <Spinner size="xl" color="white" thickness="4px" />
            </Box>
          )}
          <video
            ref={videoRef}
            src={optimizedVideoUrl}
            controls
            playsInline
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '4px',
              backgroundColor: 'black'
            }}
            onLoadedData={handleLoadedData}
            onError={handleError}
            preload="auto"
            autoPlay
          >
            <source src={optimizedVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>
      </AspectRatio>
    </Box>
  );
};

export default ProjectVideo; 