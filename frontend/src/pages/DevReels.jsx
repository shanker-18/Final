import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Center,
  Spinner,
  useToast,
  Avatar,
  IconButton,
  Flex,
  Tabs,
  TabList,
  Tab,
  Wrap,
  WrapItem,
  Tag,
} from '@chakra-ui/react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  SearchIcon, 
  ChevronUpIcon, 
  ChevronDownIcon, 
  WarningIcon 
} from '@chakra-ui/icons';
import { 
  FaPlay, 
  FaUserCheck, 
  FaUserPlus, 
  FaInfoCircle,
  FaHeart,
  FaComment,
  FaShare,
  FaPause
} from 'react-icons/fa';
import AnimatedBackground from '../components/AnimatedBackground';
import { getOptimizedVideoUrl, preloadVideoThumbnail, preloadMultipleThumbnails } from '../utils/videoUtils';
import VideoPlayer from '../components/VideoPlayer';
import { projectsApi, videoApi } from '../services/api';
import { useInView } from 'react-intersection-observer';

// Create motion components
const MotionBox = motion.create(Box);
const MotionHeading = motion.create(Heading);

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Single video reel component
const VideoReel = ({ project, onPlay, onViewDetails, onFollow, isFollowing, isActive, userRole }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const videoRef = useRef(null);
  const [ref, inView] = useInView({
    threshold: 0.7,
  });
  const toast = useToast();
  
  // Handle video loaded
  const handleLoadedData = useCallback(() => {
    console.log('Video loaded successfully:', project._id);
    setLoading(false);
    setVideoLoaded(true);
    setError(false);
    setErrorDetails('');

    // Only attempt to play if the video is in view and active
    if (inView && isActive && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            console.log('Video playing:', project._id);
          })
          .catch(error => {
            console.error('Error playing video:', error);
            setIsPlaying(false);
            // Don't show error toast here as it might be due to user interaction
          });
      }
    }
  }, [inView, isActive, project._id]);

  // Handle video error
  const handleError = useCallback((e) => {
    let errorMessage = 'Unknown video error occurred';
    
    if (e.target.error) {
      errorMessage = `Video error: ${e.target.error.message}`;
    } else if (e.target.networkState === 3) {
      errorMessage = 'Network error: Unable to load video';
    } else if (e.target.readyState === 0) {
      errorMessage = 'Format error: Video format not supported';
    } else {
      // Check for specific error types
      const video = e.target;
      if (video.error) {
        switch (video.error.code) {
          case 1:
            errorMessage = 'Video aborted during loading';
            break;
          case 2:
            errorMessage = 'Network error while loading video';
            break;
          case 3:
            errorMessage = 'Video decoding failed - format not supported';
            break;
          case 4:
            errorMessage = 'Video format not supported by browser';
            break;
          default:
            errorMessage = `Video error: ${video.error.message || 'Unknown error'}`;
        }
      }
    }
    
    console.error('Video error:', errorMessage);
    setError(true);
    setErrorDetails(errorMessage);
    setLoading(false);
    setVideoLoaded(false);
    setIsPlaying(false);
    
    toast({
      title: "Video Error",
      description: errorMessage,
      status: "error",
      duration: 3000,
      isClosable: true
    });
  }, [toast]);

  // Validate and set video URL
  useEffect(() => {
    if (!project?.videoUrl) {
      console.error('No video URL provided for project:', project?._id);
      setError(true);
      setErrorDetails('No video URL available');
      setLoading(false);
      return;
    }

    try {
      // Validate URL
      const url = new URL(project.videoUrl);
      
      // Check for supported video formats
      const supportedFormats = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
      const hasSupportedFormat = supportedFormats.some(format => 
        url.pathname.toLowerCase().includes(format)
      );
      
      if (!hasSupportedFormat) {
        console.warn('Video format may not be supported:', url.pathname);
      }
      
      setVideoUrl(url.toString());
      setError(false);
      setErrorDetails('');
    } catch (err) {
      console.error('Invalid video URL:', project.videoUrl);
      setError(true);
      setErrorDetails('Invalid video URL');
      setLoading(false);
    }
  }, [project?.videoUrl, project?._id]);

  // Initialize video when active and URL is valid
  useEffect(() => {
    let mounted = true;

    const initVideo = async () => {
      try {
        if (!videoUrl) {
          throw new Error('No valid video URL available');
        }

        if (!mounted) return;

        setLoading(true);
        setError(false);
        setErrorDetails('');
        setVideoLoaded(false);
        setIsPlaying(false);

        const videoElement = videoRef.current;
        if (!videoElement) return;

        // Set video source with error handling
        videoElement.src = videoUrl;
        
        // Add event listeners for better error handling
        const handleLoadStart = () => {
          console.log('Video load started');
        };
        
        const handleCanPlay = () => {
          console.log('Video can play');
          if (mounted) {
            setVideoLoaded(true);
            setLoading(false);
            setError(false);
          }
        };
        
        const handleCanPlayThrough = () => {
          console.log('Video can play through');
        };
        
        videoElement.addEventListener('loadstart', handleLoadStart);
        videoElement.addEventListener('canplay', handleCanPlay);
        videoElement.addEventListener('canplaythrough', handleCanPlayThrough);
        
        // Force reload of video element
        try {
          await videoElement.load();
        } catch (loadError) {
          console.error('Error loading video:', loadError);
          throw new Error('Failed to load video');
        }
        
        // Cleanup event listeners
        return () => {
          videoElement.removeEventListener('loadstart', handleLoadStart);
          videoElement.removeEventListener('canplay', handleCanPlay);
          videoElement.removeEventListener('canplaythrough', handleCanPlayThrough);
        };

      } catch (err) {
        console.error('Error in initVideo:', err);
        if (mounted) {
          setError(true);
          setErrorDetails(err.message);
          setLoading(false);
          setVideoLoaded(false);
          setIsPlaying(false);
          
          toast({
            title: "Error",
            description: `Failed to load video: ${err.message}`,
            status: "error",
            duration: 3000,
            isClosable: true
          });
        }
      }
    };

    // Only initialize video if it's active and we have a valid URL
    if (isActive && videoUrl) {
      initVideo();
    }

    return () => {
      mounted = false;
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src'); // Use removeAttribute instead of setting to empty string
        videoRef.current.load();
      }
    };
  }, [videoUrl, isActive, toast]);

  // Handle video visibility
  useEffect(() => {
    if (!videoRef.current || !videoLoaded) return;

    if (inView && isActive) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Error playing video:', error);
            setIsPlaying(false);
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [inView, isActive, videoLoaded]);

  // Handle video play/pause
  const handleVideoPress = useCallback(() => {
    if (!videoRef.current || !videoLoaded) return;

    if (videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Error playing video:', error);
            setIsPlaying(false);
            toast({
              title: "Error",
              description: "Failed to play video",
              status: "error",
              duration: 3000,
              isClosable: true
            });
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [videoLoaded, toast]);

  // Get user ID for follow button
  const userId = project.userId || (project.seller && project.seller.id);
  
  // Check if user is a developer
  const isDeveloper = userRole === 'developer';

  // Debug log for video data
  useEffect(() => {
    console.log('Video data:', {
      projectId: project._id,
      videoUrl: project.videoUrl,
      thumbnail: project.thumbnail,
      isActive,
      inView
    });
  }, [project, isActive, inView]);

  return (
    <MotionBox
      ref={ref}
      position="relative"
      height="100vh"
      width="100%"
      maxWidth="500px"
      margin="0 auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleVideoPress}
    >
      {/* Video Container */}
      <Box
        position="relative"
        width="100%"
        height="100%"
        overflow="hidden"
        bg="black"
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            poster={project.thumbnail}
            loop
            playsInline
            muted
            preload="metadata"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onLoadedData={handleLoadedData}
            onError={handleError}
            onLoadStart={() => console.log('Video load started')}
            onCanPlay={() => console.log('Video can play')}
            onCanPlayThrough={() => console.log('Video can play through')}
          />
        ) : (
          <Center h="100%" w="100%">
            <VStack spacing={4}>
              <WarningIcon boxSize={8} color="yellow.500" />
              <Text color="white" textAlign="center">
                {errorDetails || 'Video not available'}
              </Text>
            </VStack>
          </Center>
        )}

        {/* Loading Spinner */}
        {loading && videoUrl && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={2}
          >
            <Spinner size="xl" color="white" />
          </Box>
        )}

        {/* Play/Pause Icon */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          opacity={isPlaying ? 0 : 0.8}
          transition="opacity 0.2s"
          zIndex={2}
        >
          <IconButton
            aria-label={isPlaying ? "Pause" : "Play"}
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            size="lg"
            fontSize="3xl"
            variant="ghost"
            color="white"
            _hover={{ bg: 'whiteAlpha.200' }}
          />
        </Box>

        {/* Gradient Overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)"
          zIndex={1}
        />
      </Box>
      
      {/* Top Bar - User Info and Follow Button */}
      <Flex 
        position="absolute" 
        top={0} 
        left={0} 
        right={0} 
        p={4} 
        alignItems="center" 
        justifyContent="space-between"
        zIndex={2}
      >
        <HStack spacing={3}>
          <Avatar 
            size="md" 
            name={project.seller?.name || 'Unknown User'} 
            src={project.seller?.avatar} 
            bg="gold.400"
          />
          <Box>
            <Text fontWeight="bold" color="white">
              {project.seller?.name || 'Unknown User'}
            </Text>
            <Text fontSize="sm" color="whiteAlpha.800">
              {new Date(project.createdAt || Date.now()).toLocaleDateString()}
            </Text>
          </Box>
        </HStack>
        
        {/* Right actions: View details + optional Follow button */}
        <HStack spacing={2}>
          <Button
            size="sm"
            leftIcon={<FaInfoCircle />}
            colorScheme="gold"
            variant="solid"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(project);
            }}
          >
            View Project Details
          </Button>

          {/* Only show follow button for non-developers */}
          {!isDeveloper && userId && (
            <Button
              size="sm"
              colorScheme={isFollowing ? "gray" : "gold"}
              variant={isFollowing ? "outline" : "solid"}
              onClick={(e) => {
                e.stopPropagation();
                onFollow(userId);
              }}
              leftIcon={isFollowing ? <FaUserCheck /> : <FaUserPlus />}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </HStack>
      </Flex>
      
      {/* Center - Play Button */}
      <Center 
        position="absolute" 
        top="50%" 
        left="50%" 
        transform="translate(-50%, -50%)"
        zIndex={2}
      >
        <IconButton
          aria-label="Play video"
          icon={<FaPlay />}
          size="lg"
          fontSize="3xl"
          colorScheme="gold"
          rounded="full"
          onClick={(e) => {
            e.stopPropagation();
            onPlay(project);
          }}
          opacity={0.9}
          _hover={{ opacity: 1, transform: 'scale(1.1)' }}
          transition="all 0.2s"
        />
      </Center>
      
      {/* Bottom - Project Info */}
      <VStack 
        position="absolute" 
        bottom={0} 
        left={0} 
        right={0} 
        p={4} 
        alignItems="flex-start"
        spacing={3}
        zIndex={2}
      >
        <Heading size="md" color="white">
          {project.title || 'Untitled Project'}
        </Heading>
        
        <Text 
          color="whiteAlpha.900" 
          noOfLines={2}
          fontSize="sm"
        >
          {project.description || 'No description available'}
        </Text>
        
        {/* Technologies */}
        <Wrap spacing={2}>
          {project.technologies && project.technologies.map((tech, index) => (
            <WrapItem key={index}>
              <Tag size="sm" colorScheme="gold" variant="subtle">
                {tech}
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
        
      </VStack>
      
      {/* Remove swipe indicators for developers */}
      {!isDeveloper && (
        <Text
          position="absolute"
          bottom={2}
          left="50%"
          transform="translateX(-50%)"
          color="whiteAlpha.700"
          fontSize="xs"
          zIndex={2}
        >
          Swipe up/down to navigate
        </Text>
      )}
    </MotionBox>
  );
};

const DevReels = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [followingProjects, setFollowingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [tabIndex, setTabIndex] = useState(0); // 0 = For You, 1 = Following
  const [followingUsers, setFollowingUsers] = useState({});
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  
  // For pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // For scroll detection
  const containerRef = useRef(null);
  const reelsRef = useRef([]);
  
  // For responsive design
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Fetch projects with pagination
  const fetchProjects = async (pageNum = 1, append = false) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/projects');
      const data = await response.json();
      
      // Filter and process projects with videos
      const projectsWithVideos = data.data.filter(project => {
        // Log raw project data for debugging
        console.log('Raw project data:', project);
        
        // Extract video URL from various possible locations
        const videoUrl = project.video?.url || 
                        project.video?.secure_url || 
                        project.videoUrl || 
                        project.video_url ||
                        (typeof project.video === 'string' ? project.video : null);
        
        // Only include projects with valid video URLs that start with http/https
        if (videoUrl && (videoUrl.startsWith('http://') || videoUrl.startsWith('https://'))) {
          // Process and normalize the video data
          project.videoUrl = videoUrl;
          
          // Generate thumbnail if not exists
          project.thumbnail = project.video?.thumbnail ||
                            project.thumbnail ||
                            videoUrl.replace('/upload/', '/upload/w_640,h_360,c_fill,g_center/');
          
          console.log('Processing project with video:', {
            projectId: project._id,
            videoUrl: project.videoUrl,
            thumbnail: project.thumbnail,
            originalVideo: project.video
          });
          
          return true;
        }
        return false;
      });

      // Update state with found videos
      if (append) {
        setProjects(prev => [...prev, ...projectsWithVideos]);
        setFilteredProjects(prev => [...prev, ...projectsWithVideos]);
      } else {
        setProjects(projectsWithVideos);
        setFilteredProjects(projectsWithVideos);
      }
      
      // Update pagination state
      setHasMore(projectsWithVideos.length >= pageSize);
      
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load projects',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      if (pageNum === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };
  
  useEffect(() => {
    fetchProjects();
    
    // Add event listener for keyboard navigation
    const handleKeyDown = (e) => {
      if (!selectedProject) {
        if (e.key === 'ArrowDown' || e.key === 'j') {
          handleNextReel();
        } else if (e.key === 'ArrowUp' || e.key === 'k') {
          handlePrevReel();
        } else if (e.key === 'Enter' || e.key === ' ') {
          if (filteredProjects.length > 0) {
            handlePlayVideo(filteredProjects[currentReelIndex]);
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Set up intersection observer for scroll detection
  useEffect(() => {
    if (!containerRef.current || filteredProjects.length === 0) return;
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8, // 80% visibility required
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index, 10);
          if (!isNaN(index) && index !== currentReelIndex) {
            setCurrentReelIndex(index);
          }
        }
      });
    }, options);
    
    // Observe all reel elements
    const reelElements = document.querySelectorAll('.reel-item');
    reelElements.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      reelElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, [filteredProjects, containerRef.current]);
  
  // Load more projects when reaching the end
  useEffect(() => {
    if (currentReelIndex >= filteredProjects.length - 3 && hasMore && !loadingMore) {
      fetchProjects(page + 1, true);
      setPage(prev => prev + 1);
    }
  }, [currentReelIndex, filteredProjects.length, hasMore, loadingMore, page]);
  
  // Update filtered projects when search term changes
  useEffect(() => {
    const projectsToFilter = tabIndex === 0 ? projects : followingProjects;
    
    if (searchTerm.trim() === '') {
      setFilteredProjects(projectsToFilter);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = projectsToFilter.filter(project => 
        project.title?.toLowerCase().includes(term) ||
        project.description?.toLowerCase().includes(term) ||
        project.seller?.name?.toLowerCase().includes(term) ||
        (project.technologies && project.technologies.some(tech => 
          tech.toLowerCase().includes(term)
        ))
      );
      setFilteredProjects(filtered);
      setCurrentReelIndex(0); // Reset to first reel when filtering
    }
  }, [searchTerm, projects, followingProjects, tabIndex]);
  
  // Update when tab changes
  useEffect(() => {
    setSearchTerm('');
    setCurrentReelIndex(0);
    if (tabIndex === 0) {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(followingProjects);
    }
  }, [tabIndex, projects, followingProjects]);
  
  // Add useEffect to fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Get user data from localStorage or your auth system
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        setUserRole(userData.role || 'client');
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('client'); // Default to client if error
      }
    };

    fetchUserRole();
  }, []);
  
  const handlePlayVideo = (project) => {
    setSelectedProject(project);
  };
  
  const handleViewDetails = (project) => {
    // Always navigate to the standard project details page
    navigate(`/project/${project._id || project.id}`);
  };
  
  const handleNextReel = () => {
    if (currentReelIndex < filteredProjects.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
      
      // Scroll to the next reel
      const nextReel = document.querySelector(`[data-index="${currentReelIndex + 1}"]`);
      if (nextReel) {
        nextReel.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  const handlePrevReel = () => {
    if (currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
      
      // Scroll to the previous reel
      const prevReel = document.querySelector(`[data-index="${currentReelIndex - 1}"]`);
      if (prevReel) {
        prevReel.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  const handleFollow = (userId) => {
    if (!userId) return;
    
    // Get current following users
    const currentFollowingUsers = { ...followingUsers };
    const project = filteredProjects[currentReelIndex];
    
    // Toggle follow status
    if (currentFollowingUsers[userId]) {
      delete currentFollowingUsers[userId];
    } else {
      currentFollowingUsers[userId] = {
        id: userId,
        name: project.seller?.name || 'Unknown User',
        avatar: project.seller?.avatar || null,
        followedAt: new Date().toISOString(),
      };
    }
    
    // Save back to localStorage
    localStorage.setItem('followingUsers', JSON.stringify(currentFollowingUsers));
    setFollowingUsers(currentFollowingUsers);
    
    // Update following projects
    if (Object.keys(currentFollowingUsers).length > 0) {
      const followedProjects = projects.filter(project => 
        Object.keys(currentFollowingUsers).includes(project.userId || project.seller?.id)
      );
      setFollowingProjects(followedProjects);
    } else {
      setFollowingProjects([]);
    }
    
    // Update filtered projects if on Following tab
    if (tabIndex === 1) {
      setFilteredProjects(followingProjects);
    }
  };
  
  return (
    <AnimatedBackground>
      <Box minH="100vh" pt={{ base: 0, md: 28 }} pb={{ base: 0, md: 20 }}>
        <Container maxW="container.xl" px={{ base: 0, md: 4 }} h="100%">
          <MotionBox
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            h="100%"
          >
            {/* Header - Only show on larger screens */}
            {!isMobile && (
              <>
                <MotionHeading
                  textAlign="center"
                  mb={8}
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  bgGradient="linear(to-r, gold.200, gold.400)"
                  bgClip="text"
                  fontWeight="bold"
                >
                  DevReels
                </MotionHeading>
              </>
            )}
            
            {/* Only show Tabs and Search if not a developer */}
            {!userRole || userRole !== 'developer' && (
              <>
                {/* Tabs - For You / Following */}
                <Tabs 
                  isFitted 
                  variant="soft-rounded" 
                  colorScheme="gold" 
                  onChange={setTabIndex} 
                  index={tabIndex}
                  mb={4}
                  maxW="400px"
                  mx="auto"
                  display={{ base: "none", md: "block" }}
                >
                  <TabList>
                    <Tab>For You</Tab>
                    <Tab>Following</Tab>
                  </TabList>
                </Tabs>
                
                {/* Search - Only show on larger screens */}
                <MotionBox 
                  mb={10} 
                  maxW="600px" 
                  mx="auto"
                  display={{ base: "none", md: "block" }}
                >
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gold.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search by title, description, or developer name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      bg="whiteAlpha.100"
                      color="white"
                      borderColor="whiteAlpha.200"
                      _hover={{ borderColor: "gold.400" }}
                      _focus={{ borderColor: "gold.400", boxShadow: "0 0 0 1px #FFD700" }}
                    />
                  </InputGroup>
                </MotionBox>
              </>
            )}
            
            {loading ? (
              <Center py={20}>
                <Spinner size="xl" color="gold.400" thickness="4px" />
              </Center>
            ) : filteredProjects.length === 0 ? (
              <MotionBox
                p={10}
                bg="whiteAlpha.100"
                borderRadius="xl"
                textAlign="center"
                backdropFilter="blur(8px)"
              >
                <Text color="white" fontSize="xl">
                  {tabIndex === 1 
                    ? 'You are not following any developers yet' 
                    : (searchTerm ? 'No videos found matching your search' : 'No videos available')}
                </Text>
                {searchTerm && (
                  <Button
                    mt={4}
                    colorScheme="gold"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </Button>
                )}
                {tabIndex === 1 && followingProjects.length === 0 && (
                  <Button
                    mt={4}
                    colorScheme="gold"
                    onClick={() => setTabIndex(0)}
                  >
                    Discover Developers
                  </Button>
                )}
              </MotionBox>
            ) : (
              <Box 
                ref={containerRef}
                h="100vh"
                overflow="auto"
                position="relative"
                css={{
                  scrollSnapType: 'y mandatory',
                  '&::-webkit-scrollbar': {
                    display: 'none'
                  },
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                {filteredProjects.map((project, index) => (
                  <Box 
                    key={project.id || index}
                    className="reel-item"
                    data-index={index}
                    ref={el => reelsRef.current[index] = el}
                    h="100vh"
                    scrollSnapAlign="start"
                    scrollSnapStop="always"
                  >
                    <VideoReel
                      project={project}
                      onPlay={handlePlayVideo}
                      onViewDetails={handleViewDetails}
                      onFollow={handleFollow}
                      isFollowing={!!followingUsers[project.userId || project.seller?.id]}
                      isActive={index === currentReelIndex}
                      userRole={userRole}
                    />
                  </Box>
                ))}
                
                {/* Loading indicator for pagination */}
                {loadingMore && (
                  <Center position="absolute" bottom={4} left={0} right={0}>
                    <Spinner size="md" color="gold.400" thickness="3px" />
                  </Center>
                )}
              </Box>
            )}
          </MotionBox>
        </Container>
      </Box>
      
      {selectedProject && (
        <VideoPlayer
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          userRole={userRole}
          hideContactOptions={userRole === 'developer'}
        />
      )}
    </AnimatedBackground>
  );
};

export default DevReels;