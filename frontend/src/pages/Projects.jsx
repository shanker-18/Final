import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Spinner, 
  Center, 
  Heading, 
  Text, 
  VStack,
  Button,
  Stack,
  HStack,
  SimpleGrid,
  Avatar,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  useToast,
  Badge,
  useColorModeValue,
  Wrap,
  WrapItem,
  Alert
} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import AnimatedBackground from '../components/AnimatedBackground';
import MotionButton from '../components/MotionButton';
import { FaPlay } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';
import { getVideoThumbnailUrl, getOptimizedVideoUrl, preloadVideoThumbnail } from '../utils/videoUtils';
import ProjectVideo from '../components/ProjectVideo';
import { useUser } from '../contexts/UserContext';
import { getUserRole } from '../utils/userRole';
import AddProject from "./AddProject";
import { db } from '../config/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { API_URL } from '../config/apiConfig';

const MotionBox = motion.create(Box);
const MotionHeading = motion.create(Heading);
const MotionInput = motion.create(Input);
const MotionSelect = motion.create(Select);
const MotionVStack = motion.create(VStack);
const MotionSimpleGrid = motion.create(SimpleGrid);

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const contentVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

const cardVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  hover: {
    y: -5,
    transition: { duration: 0.2 }
  }
};

// Add this near the top with other constants
const categoryOptions = [
  { value: 'all', label: 'All Categories', icon: '🌐' },
  { value: 'web', label: 'Web Development', icon: '💻' },
  { value: 'mobile', label: 'Mobile Development', icon: '📱' },
  { value: 'design', label: 'Design', icon: '🎨' },
  { value: 'ai', label: 'AI & Machine Learning', icon: '🤖' },
  { value: 'blockchain', label: 'Blockchain', icon: '⛓️' },
  { value: 'other', label: 'Other', icon: '🔧' }
];

const ProjectCard = ({ project, isOwner, onSave, isSaved }) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('whiteAlpha.200', 'whiteAlpha.100');
  const borderColor = useColorModeValue('whiteAlpha.300', 'whiteAlpha.200');

  const handleClick = (e) => {
    // Only navigate if not clicking on the video player or edit button
    if (!e.target.closest('.project-video-player') && !e.target.closest('.edit-button')) {
      navigate(`/project/${project._id}`);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit-project/${project._id}`);
  };

  // Debug log to check video data
  console.log('Project card video data:', {
    projectId: project._id,
    videoUrl: project.videoUrl,
    thumbnail: project.thumbnail,
    hasVideo: Boolean(project.videoUrl)
  });

  return (
    <MotionBox
      bg={bgColor}
      borderRadius="xl"
      overflow="hidden"
      variants={cardVariants}
      whileHover="hover"
      initial="initial"
      animate="animate"
      cursor="pointer"
      onClick={handleClick}
      boxShadow="xl"
      border="1px solid"
      borderColor={borderColor}
      _hover={{
        borderColor: "gold.400",
        transform: "translateY(-5px)",
        boxShadow: "2xl"
      }}
      position="relative"
    >
      {isOwner && (
        <Button
          className="edit-button"
          position="absolute"
          top={4}
          right={4}
          size="sm"
          colorScheme="gold"
          onClick={handleEdit}
          zIndex={2}
          opacity={0.9}
          _hover={{ opacity: 1 }}
        >
          Edit
        </Button>
      )}

      {/* Save Project button for seekers - bottom right inside card */}
      {!isOwner && onSave && (
        <Box position="absolute" bottom={4} right={4} zIndex={2}>
          <Button
            size="sm"
            variant={isSaved ? "solid" : "outline"}
            colorScheme="gold"
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
          >
            {isSaved ? 'Saved' : 'Save Project'}
          </Button>
        </Box>
      )}

      {/* Video Section */}
      {project.videoUrl && (
        <Box 
          className="project-video-player"
          mb={4} 
          position="relative" 
          paddingTop="56.25%"
          onClick={(e) => e.stopPropagation()}
        >
          <Box position="absolute" top="0" left="0" width="100%" height="100%">
            <ProjectVideo 
              videoUrl={project.videoUrl}
              thumbnail={project.thumbnail}
            />
          </Box>
        </Box>
      )}

      {/* Project Details Section */}
      <VStack align="start" p={6} spacing={4}>
        <MotionHeading 
          size="md" 
          color="white"
          whileHover={{
            color: "#FFD700",
            textShadow: "0 0 8px rgba(255,215,0,0.3)"
          }}
        >
          {project.title}
        </MotionHeading>
        
        <Text color="whiteAlpha.800" noOfLines={3}>
          {project.description}
        </Text>

        {/* Creator Info */}
        <HStack spacing={2} mt={2}>
          <Avatar size="sm" name={project.seller?.name} src={project.seller?.avatar} />
          <Text color="whiteAlpha.800" fontSize="sm">
            {project.seller?.name}
          </Text>
        </HStack>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <Box>
            <Text color="whiteAlpha.800" fontSize="sm" mb={2}>
              Technologies:
            </Text>
            <HStack spacing={2} flexWrap="wrap">
              {project.technologies.map((tech, index) => (
                <Badge
                  key={index}
                  colorScheme="blue"
                  variant="solid"
                  px={2}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                >
                  {tech}
                </Badge>
              ))}
            </HStack>
          </Box>
        )}
      </VStack>
    </MotionBox>
  );
};

const Projects = () => {
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  // "searchTerm" is the ACTIVE value used for filtering.
  // Typing in the input only updates a local value; we update this
  // state (and therefore trigger filtering) ONLY on Enter / explicit search.
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const debounceTimerRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { user, userData } = useUser();
  const role = getUserRole(userData);
  const savedProjectIds = userData?.savedProjects || [];

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        // Wait until we know the user's role
        if (!role) {
          return;
        }

        // Build query params so backend can filter based on role
        const params = new URLSearchParams();
        if (role) params.set('role', role);
        if (role === 'developer' && user?.uid) params.set('sellerId', user.uid);

        // Fetch projects from backend API
        const response = await fetch(`${API_URL}/api/projects?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        
        // Process the projects data to ensure video URLs are properly structured
        const processedProjects = data.data.map(project => {
          // Debug log for raw project data
          console.log('Raw project data:', project);

          // Extract video URL and thumbnail from all possible locations
          let videoUrl = null;
          let thumbnail = null;

          // Check nested video object first
          if (project.video) {
            if (typeof project.video === 'object') {
              videoUrl = project.video.url || project.video.secure_url;
              thumbnail = project.video.thumbnail;
            } else if (typeof project.video === 'string') {
              videoUrl = project.video;
              thumbnail = project.video.replace('/upload/', '/upload/w_640,h_360,c_fill,g_center/');
            }
          }

          // If no video found in nested object, check top-level fields
          if (!videoUrl) {
            videoUrl = project.videoUrl || project.video_url || project.secure_url;
            thumbnail = project.thumbnail || project.thumbnail_url;
          }

          // If we have a video URL but no thumbnail, generate one
          if (videoUrl && !thumbnail) {
            thumbnail = videoUrl.replace('/upload/', '/upload/w_640,h_360,c_fill,g_center/');
          }

          // Debug log for processed video data
          console.log('Processed video data:', {
            projectId: project._id,
            videoUrl,
            thumbnail,
            originalVideo: project.video,
            originalVideoUrl: project.videoUrl
          });

          return {
            ...project,
            videoUrl,
            thumbnail
          };
        });
        
        console.log('Processed projects:', processedProjects);

        // Frontend safeguard: if role is developer, show only their projects;
        // seekers see all active projects.
        let visibleProjects = processedProjects;
        if (role === 'developer' && user?.uid) {
          visibleProjects = processedProjects.filter(
            (project) => project.seller?.id === user.uid
          );
        } else if (role === 'seeker') {
          visibleProjects = processedProjects.filter(
            (project) => project.status === 'active'
          );
        }
        
        setProjects(visibleProjects);
        setFilteredProjects(visibleProjects);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error fetching projects',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndProjects();
  }, [userData, role, user, navigate]);

  // Debounced search effect - only triggers when searchTerm or categoryFilter changes
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new debounced timer
    debounceTimerRef.current = setTimeout(() => {
      if (!projects || projects.length === 0) {
        setFilteredProjects([]);
        return;
      }
      
      const searchText = searchTerm.toLowerCase().trim();
      
      // If no search and no filter, show all
      if (!searchText && categoryFilter === 'all') {
        setFilteredProjects(projects);
        return;
      }
      
      // Filter projects
      const filtered = projects.filter(project => {
        if (!project) return false;
        
        // Category filter
        if (categoryFilter !== 'all') {
          const categoryMatch = project.category?.toLowerCase() === categoryFilter.toLowerCase();
          if (!categoryMatch) return false;
        }
        
        // Search filter
        if (searchText) {
          const searchableText = [
            project.title || '',
            project.description || '',
            project.seller?.name || '',
            ...(project.technologies || [])
          ].join(' ').toLowerCase();
          
          return searchableText.includes(searchText);
        }
        
        return true;
      });
      
      setFilteredProjects(filtered);
    }, 300);
    
    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, categoryFilter, projects]); // Include projects so filter runs when they load

  // Update the search functionality
  // NOTE: we only trigger actual filtering when the user presses Enter
  // or clicks the "Search" button. Typing alone no longer re-filters.
  const SearchSection = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const searchInputRef = useRef(null);

    // Local input value – can differ from the active searchTerm
    const [pendingSearch, setPendingSearch] = useState(searchTerm);

    // Keep local input in sync if active term is reset from outside
    useEffect(() => {
      setPendingSearch(searchTerm);
    }, [searchTerm]);

    const applySearch = () => {
      // Update the ACTIVE search term used by the debounced effect
      setSearchTerm(pendingSearch.trim());
      searchInputRef.current?.blur();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applySearch();
      }
    };

    return (
      <VStack spacing={6} w="full" position="relative">
        <HStack spacing={4} w="full">
          <InputGroup size="lg" flex={1}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gold.300" />
            </InputLeftElement>
            <Input
              ref={searchInputRef}
              placeholder="Search projects by title, description, or technologies..."
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              bg="whiteAlpha.100"
              color="white"
              borderColor="whiteAlpha.200"
              _hover={{ borderColor: "gold.400" }}
              _focus={{ 
                borderColor: "gold.400", 
                boxShadow: "0 0 0 1px #FFD700",
                bg: "whiteAlpha.200" 
              }}
              height="50px"
              fontSize="md"
            />
            {pendingSearch && (
              <Box position="absolute" right="8px" top="50%" transform="translateY(-50%)" zIndex="1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: "white" }}
                  onClick={() => {
                    setPendingSearch('');
                    setSearchTerm(''); // also clear the active search
                    searchInputRef.current?.focus();
                  }}
                >
                  ✕
                </Button>
              </Box>
            )}
          </InputGroup>
          <Button
            type="button"
            onClick={applySearch}
            bg="whiteAlpha.200"
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
            leftIcon={<Text>🔍</Text>}
          >
            Search
          </Button>
          <Button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            bg={isFilterOpen ? "whiteAlpha.200" : "whiteAlpha.100"}
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
          >
            Filter
          </Button>
        </HStack>

        {/* Filter Menu Overlay */}
        <AnimatePresence>
          {isFilterOpen && (
            <Box
              position="fixed"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="blackAlpha.700"
              zIndex="999"
              onClick={() => setIsFilterOpen(false)}
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Filter Menu */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                width="300px"
                bg="gray.800"
                borderRadius="xl"
                boxShadow="2xl"
                onClick={(e) => e.stopPropagation()}
                as={motion.div}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <VStack spacing={0} align="stretch">
                  <Box p={4} borderBottom="1px solid" borderColor="whiteAlpha.200">
                    <Text color="white" fontWeight="bold" fontSize="lg">Categories</Text>
                  </Box>
                  <Box maxH="400px" overflowY="auto">
                    {categoryOptions.map((category) => (
                      <Button
                        key={category.value}
                        type="button"
                        variant="ghost"
                        justifyContent="flex-start"
                        w="full"
                        py={3}
                        px={4}
                        bg={categoryFilter === category.value ? "whiteAlpha.200" : "transparent"}
                        color="white"
                        onClick={() => {
                          setCategoryFilter(category.value);
                          setIsFilterOpen(false);
                        }}
                        _hover={{ bg: "whiteAlpha.300" }}
                        leftIcon={<Text fontSize="lg">{category.icon}</Text>}
                      >
                        <Text fontSize="sm">{category.label}</Text>
                      </Button>
                    ))}
                  </Box>
                  {(searchTerm || categoryFilter !== 'all') && (
                    <Box p={4} borderTop="1px solid" borderColor="whiteAlpha.200">
                      <Button
                        type="button"
                        size="sm"
                        width="full"
                        colorScheme="gold"
                        onClick={() => {
                          setCategoryFilter('all');
                          setSearchTerm('');
                          setIsFilterOpen(false);
                          searchInputRef.current?.focus();
                        }}
                        leftIcon={<Text>🔄</Text>}
                      >
                        Reset Filters
                      </Button>
                    </Box>
                  )}
                </VStack>
              </Box>
            </Box>
          )}
        </AnimatePresence>
      </VStack>
    );
  };

  const handleSaveProject = async (projectId) => {
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login to save projects.',
        status: 'info',
        duration: 3000,
      });
      navigate('/login');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        savedProjects: arrayUnion(projectId),
      });
      toast({
        title: 'Project saved',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error saving project',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  // Update the DeveloperView component
  const DeveloperView = () => {
    return (
      <VStack 
        spacing={8} 
        width="100%"
      >
        <HStack justify="space-between" w="full">
          <Heading 
            color="white"
            bgGradient="linear(to-r, gold.200, gold.400)"
            bgClip="text"
            fontWeight="bold"
          >
            My Projects
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="gold"
            onClick={() => navigate('/add-project')}
          >
            Add New Project
          </Button>
        </HStack>

        <SearchSection />

        {filteredProjects.length === 0 ? (
          <Box 
            p={8} 
            bg="whiteAlpha.100" 
            borderRadius="xl" 
            textAlign="center" 
            w="full"
            transition="transform 0.2s"
            _hover={{ transform: 'translateY(-5px)' }}
            backdropFilter="blur(10px)"
          >
            {searchTerm || categoryFilter !== 'all' ? (
              <>
                <Text color="white" fontSize="xl">No projects found matching your search</Text>
                <Button
                  mt={4}
                  colorScheme="gold"
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </>
            ) : (
              <>
                <Text color="white" fontSize="xl">You haven't added any projects yet</Text>
                <Button
                  mt={4}
                  colorScheme="gold"
                  onClick={() => navigate('/add-project')}
                >
                  Add Your First Project
                </Button>
              </>
            )}
          </Box>
        ) : (
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={8} 
            w="full"
          >
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project._id} 
                project={project} 
                isOwner={true}
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    );
  };

  // Update the SeekerView component
  const SeekerView = () => {
    if (!userData) {
      return null;
    }
    if (getUserRole(userData) !== 'seeker') {
      return null;
    }
    return (
      <VStack 
        spacing={8} 
        width="100%"
      >
        <Heading 
          color="white"
          bgGradient="linear(to-r, gold.200, gold.400)"
          bgClip="text"
          textAlign="center"
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          fontWeight="bold"
        >
          Available Projects
        </Heading>

        <SearchSection />

        {filteredProjects.length === 0 ? (
          <Box 
            p={8} 
            bg="whiteAlpha.100" 
            borderRadius="xl" 
            textAlign="center" 
            w="full"
            transition="transform 0.2s"
            _hover={{ transform: 'translateY(-5px)' }}
            backdropFilter="blur(10px)"
          >
            {searchTerm || categoryFilter !== 'all' ? (
              <>
                <Text color="white" fontSize="xl">No projects found matching your search</Text>
                <Button
                  mt={4}
                  colorScheme="gold"
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </>
            ) : (
              <Text color="white" fontSize="xl">No projects available</Text>
            )}
          </Box>
        ) : (
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={8} 
            w="full"
          >
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project._id} 
                project={project}
                isOwner={false}
                onSave={() => handleSaveProject(project._id)}
                isSaved={savedProjectIds.includes(project._id)}
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    );
  };

  if (loading || !userData || !role) {
    return (
      <AnimatedBackground>
        <Center minH="100vh">
          <Spinner color="gold.400" size="xl" />
        </Center>
      </AnimatedBackground>
    );
  }

  // Show DeveloperView only for developers
  if (role === 'developer') {
    return (
      <AnimatedBackground>
        <Box pt={28} pb={20}>
          <Container maxW="container.xl">
            <DeveloperView />
          </Container>
        </Box>
      </AnimatedBackground>
    );
  }

  // Show SeekerView (explore projects) for seekers
  if (role === 'seeker') {
    return (
      <AnimatedBackground>
        <Box pt={28} pb={20}>
          <Container maxW="container.xl">
            <SeekerView />
          </Container>
        </Box>
      </AnimatedBackground>
    );
  }

  // Fallback for unknown roles
  return (
    <AnimatedBackground>
      <Center minH="100vh">
        <Text color="white">Your role does not have access to this page.</Text>
      </Center>
    </AnimatedBackground>
  );
};

export default Projects;