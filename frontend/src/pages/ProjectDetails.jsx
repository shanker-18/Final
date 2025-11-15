import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    Box, 
    Heading, 
    Text, 
    Container, 
    Stack, 
    Badge, 
    Button, 
    Spinner, 
    HStack, 
    VStack,
    useToast,
    Avatar,
    Divider,
    IconButton,
    Tooltip,
    useClipboard,
    Icon
} from '@chakra-ui/react';
// Page now uses backend HTTP API plus UserContext for role checks
import { FaEnvelope, FaComments, FaArrowLeft, FaCalendarAlt, FaTag, FaMoneyBillWave, FaShare, FaPlay, FaFilm } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import { getVideoThumbnailUrl, getOptimizedVideoUrl, preloadVideoThumbnail } from '../utils/videoUtils';
import { useUser } from '../contexts/UserContext';
import { getUserRole } from '../utils/userRole';
import { API_BASE_URL } from '../services/api';

const API_URL = `${API_BASE_URL}/api`;

// Create motion components
const MotionBox = motion.create(Box);
const MotionHeading = motion.create(Heading);
const MotionText = motion.create(Text);
const MotionContainer = motion.create(Container);
const MotionButton = motion.create(Button);

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { 
            duration: 0.5,
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5 }
    }
};

// LazyVideo component that only loads when in viewport
const LazyVideo = ({ videoUrl, videoId }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [videoSrc, setVideoSrc] = useState(null);
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    
    // Load video URL when component mounts or videoId changes
    useEffect(() => {
        const loadVideoUrl = async () => {
            if (videoUrl) {
                setVideoSrc(videoUrl);
                return;
            }
            
            if (videoId) {
                try {
                    const url = await getOptimizedVideoUrl(videoId);
                    setVideoSrc(url);
                } catch (error) {
                    console.error('Error loading video URL:', error);
                }
            }
        };
        loadVideoUrl();
    }, [videoId, videoUrl]);
    
    // Preload the thumbnail when component mounts
    useEffect(() => {
        if (videoId && !thumbnailUrl) {
            preloadVideoThumbnail(videoId)
                .then(url => setThumbnailUrl(url))
                .catch(() => console.error("Failed to load thumbnail"));
        }
    }, [videoId, thumbnailUrl]);
    
    // Set up intersection observer to detect when video is in viewport
    useEffect(() => {
        if (!containerRef.current) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        
        observer.observe(containerRef.current);
        
        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);
    
    const handlePlay = () => {
        setIsLoading(true);
        setIsPlaying(true);
        
        if (videoRef.current) {
            videoRef.current.addEventListener('loadeddata', () => {
                setIsLoading(false);
            });
            
            videoRef.current.addEventListener('error', () => {
                setIsLoading(false);
                setIsPlaying(false);
                console.error("Error loading video");
            });
            
            videoRef.current.play().catch(err => {
                console.error("Error playing video:", err);
                setIsPlaying(false);
                setIsLoading(false);
            });
        }
    };
    
    if (!videoSrc) return null;
    
    if (!isPlaying) {
        return (
            <Box 
                ref={containerRef}
                w="full" 
                maxH="400px" 
                h="300px"
                rounded="lg" 
                overflow="hidden"
                position="relative"
                cursor="pointer"
                onClick={handlePlay}
                backgroundImage={thumbnailUrl ? `url(${thumbnailUrl})` : "none"}
                backgroundColor="gray.900"
                backgroundSize="cover"
                backgroundPosition="center"
                boxShadow="dark-lg"
                border="1px solid"
                borderColor="whiteAlpha.300"
            >
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
                        Click to play video
                    </Text>
                </Box>
            </Box>
        );
    }
    
    return (
        <Box 
            w="full" 
            maxH="400px" 
            rounded="lg" 
            overflow="hidden"
            boxShadow="dark-lg"
            border="1px solid"
            borderColor="whiteAlpha.300"
            position="relative"
        >
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
                controls
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                preload="metadata"
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </Box>
    );
};

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [developer, setDeveloper] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();
    const { hasCopied, onCopy } = useClipboard(window.location.href);
    const { user, userData } = useUser();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                console.log("Fetching project with ID:", id);

                // Fetch directly from backend API (MongoDB)
                const response = await fetch(`${API_URL}/projects/${id}`);
                if (!response.ok) {
                    throw new Error('Project not found');
                }
                const data = await response.json();
                console.log("Project data from API:", data);

                if (data && data.data) {
                    const proj = data.data;
                    setProject(proj);

                    if (proj.seller) {
                        setDeveloper(proj.seller);
                    }
                } else {
                    throw new Error('Invalid project data from API');
                }
            } catch (err) {
                console.error('Error loading project details:', err);
                setError(`Error loading project details: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
        fetchProject();
        } else {
            setError('Invalid project ID');
            setLoading(false);
        }
    }, [id]);

    const handleContactSeller = async () => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please login to contact the developer",
                status: "warning",
                duration: 3000,
            });
            navigate('/login');
            return;
        }

        if (!developer) {
            toast({
                title: "Developer Not Found",
                description: "Unable to find developer information",
                status: "error",
                duration: 3000,
            });
            return;
        }

        // Check if current user is a seeker based on UserContext
        const role = getUserRole(userData);
        if (role !== 'seeker') {
            toast({
                title: "Access Restricted",
                description: "Only project seekers can contact developers",
                status: "warning",
                duration: 3000,
            });
            return;
        }

        // Prepare developer data with fallbacks for missing properties
        const developerData = {
            id: developer.id,
            displayName: developer.displayName || developer.name || 'Developer',
            photoURL: developer.photoURL || null,
            email: developer.email || null
        };

        // Navigate to chat room with developer selected
        console.log("Navigating to chat room with developer:", developerData);
        
        // Pass the developer data directly without nesting it in a user property
        navigate('/chat-room', { 
            state: { 
                selectedDeveloper: developerData
            } 
        });
    };

    const handleShare = () => {
        onCopy();
        toast({
            title: "Link copied!",
            description: "Project link has been copied to clipboard",
            status: "success",
            duration: 2000,
        });
    };

    if (loading) {
        return (
            <AnimatedBackground>
            <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
                    <Spinner size="xl" color="gold.400" thickness="4px" />
            </Box>
            </AnimatedBackground>
        );
    }

    if (error) {
        return (
            <AnimatedBackground>
                <Container maxW="container.md" py={8} pt={28}>
                    <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        p={8}
                        bg="whiteAlpha.100"
                        borderRadius="xl"
                        backdropFilter="blur(10px)"
                        boxShadow="xl"
                        textAlign="center"
                    >
                        <Heading color="red.500" mb={4}>Error</Heading>
                        <Text color="white" fontSize="lg">
                    {error}
                </Text>
                        <Button 
                            mt={6} 
                            colorScheme="gold" 
                            onClick={() => navigate('/projects')}
                        >
                            Back to Projects
                        </Button>
                    </MotionBox>
            </Container>
            </AnimatedBackground>
        );
    }

    return (
        <AnimatedBackground>
            <Container maxW="container.lg" py={8} pt={28}>
                <MotionContainer
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    maxW="container.lg"
                >
                    <IconButton
                        icon={<FaArrowLeft />}
                        aria-label="Back to projects"
                        variant="ghost"
                        color="white"
                        mb={6}
                        onClick={() => navigate('/projects')}
                        _hover={{ bg: 'whiteAlpha.200' }}
                    />
                    
                    <MotionBox
                        variants={itemVariants}
                        p={8}
                        bg="whiteAlpha.100"
                        borderRadius="xl"
                        backdropFilter="blur(10px)"
                        boxShadow="xl"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        mb={8}
                    >
                        <VStack spacing={6} align="stretch">
                            <HStack justify="space-between" wrap="wrap">
                                <MotionHeading 
                                    size="xl" 
                                    color="white"
                                    variants={itemVariants}
                                    bgGradient="linear(to-r, gold.200, gold.400)"
                                    bgClip="text"
                                >
                                    {project.title}
                                </MotionHeading>
                                <HStack>
                                    <Tooltip label="Share project" hasArrow>
                                        <IconButton
                                            icon={<FaShare />}
                                            aria-label="Share project"
                                            variant="ghost"
                                            color="white"
                                            onClick={handleShare}
                                            _hover={{ bg: 'whiteAlpha.200', color: 'gold.400' }}
                                        />
                                    </Tooltip>
                                    <Badge 
                                        colorScheme="gold" 
                                        fontSize="md" 
                                        py={1} 
                                        px={3} 
                                        borderRadius="full"
                                    >
                        {project.category || 'Project'}
                    </Badge>
                                </HStack>
                            </HStack>
                            
                            {project.createdAt && (
                                <HStack>
                                    <FaCalendarAlt color="#FFD700" />
                                    <Text color="whiteAlpha.800">
                                        Posted on {(() => {
                                            try {
                                                if (project.createdAt.toDate) {
                                                    return new Date(project.createdAt.toDate()).toLocaleDateString();
                                                } else if (typeof project.createdAt === 'string') {
                                                    return new Date(project.createdAt).toLocaleDateString();
                                                } else {
                                                    return new Date(project.createdAt).toLocaleDateString();
                                                }
                                            } catch (error) {
                                                console.error("Error formatting date:", error);
                                                return "Unknown date";
                                            }
                                        })()}
                                    </Text>
                                </HStack>
                            )}
                            
                            <Divider borderColor="whiteAlpha.300" />
                            
                            <MotionBox variants={itemVariants}>
                                <Heading size="md" color="white" mb={3}>Description</Heading>
                                <Text fontSize="lg" color="whiteAlpha.900" lineHeight="tall">
                        {project.description}
                    </Text>
                            </MotionBox>
                            
                            {/* Video Section */}
                            {(project.videoUrl || (project.video && project.video.id)) && (
                                <MotionBox variants={itemVariants}>
                                    <Heading size="md" color="white" mb={3}>Project Demo</Heading>
                                    <LazyVideo videoUrl={project.videoUrl} videoId={project.video && project.video.id} />
                                </MotionBox>
                            )}
                            
                            {project.technologies && project.technologies.length > 0 && (
                                <MotionBox variants={itemVariants}>
                                    <Heading size="md" color="white" mb={3}>Technologies</Heading>
                                    <HStack spacing={2} flexWrap="wrap">
                            {project.technologies.map((tech, index) => (
                                            <Badge 
                                                key={index} 
                                                colorScheme="blue" 
                                                fontSize="sm"
                                                py={1}
                                                px={3}
                                                borderRadius="full"
                                                m={1}
                                            >
                                    {tech}
                                </Badge>
                            ))}
                                    </HStack>
                                </MotionBox>
                )}

                {project.requirements && (
                                <MotionBox variants={itemVariants}>
                                    <Heading size="md" color="white" mb={3}>Requirements</Heading>
                                    <Text color="whiteAlpha.900">{project.requirements}</Text>
                                </MotionBox>
                )}

                {project.budget && (
                                <MotionBox variants={itemVariants}>
                                    <HStack>
                                        <FaMoneyBillWave color="#FFD700" />
                                        <Heading size="md" color="white">Budget</Heading>
                                    </HStack>
                                    <Text 
                                        color="gold.300" 
                                        fontSize="2xl" 
                                        fontWeight="bold"
                                        mt={2}
                                    >
                                        ${project.budget}
                                    </Text>
                                </MotionBox>
                            )}
                        </VStack>
                    </MotionBox>
                    
                    <MotionBox
                        variants={itemVariants}
                        p={8}
                        bg="whiteAlpha.100"
                        borderRadius="xl"
                        backdropFilter="blur(10px)"
                        boxShadow="xl"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                    >
                        <Heading size="md" color="white" mb={6}>Developer Information</Heading>
                        
                        <HStack spacing={4} mb={6}>
                            <Avatar 
                                size="xl" 
                                name={developer?.displayName || developer?.name || project.userName || 'Anonymous'} 
                                src={developer?.photoURL}
                            />
                            <VStack align="start" spacing={1}>
                                <Text 
                                    color="white" 
                                    fontSize="xl" 
                                    fontWeight="bold"
                                >
                                    {developer?.displayName || developer?.name || project.userName || 'Anonymous'}
                                </Text>
                                {developer?.email && (
                                    <Text color="whiteAlpha.800">{developer.email}</Text>
                                )}
                                {developer?.primarySkills && (
                                    <Text color="whiteAlpha.700" fontSize="sm">
                                        Skills: {developer.primarySkills}
                                    </Text>
                                )}
                            </VStack>
                        </HStack>
                        
                        <HStack spacing={4} mt={4}>
                            {project.userEmail && (
                                <MotionButton 
                    colorScheme="blue" 
                    size="lg"
                                    leftIcon={<FaEnvelope />}
                    onClick={() => window.location.href = `mailto:${project.userEmail}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    flex={1}
                                >
                                    Email Developer
                                </MotionButton>
                            )}
                            
                            {developer && (
                                <MotionButton 
                                    colorScheme="gold" 
                                    size="lg"
                                    leftIcon={<FaComments />}
                                    onClick={handleContactSeller}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    flex={1}
                                >
                                    Contact Seller
                                </MotionButton>
                            )}
                        </HStack>
                    </MotionBox>
                </MotionContainer>
        </Container>
        </AnimatedBackground>
    );
};

export default ProjectDetails; 