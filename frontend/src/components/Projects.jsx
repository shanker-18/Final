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
// External Firestore usage removed from this component
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import AnimatedBackground from '../components/AnimatedBackground';
import MotionButton from '../components/MotionButton';
import { FaPlay } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';
import { getVideoThumbnailUrl, getOptimizedVideoUrl, preloadVideoThumbnail } from '../utils/videoUtils';
import ProjectVideo from '../components/ProjectVideo';
import { useUser } from '../contexts/UserContext';

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

const ProjectCard = ({ project, isOwner }) => {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();
  const toast = useToast();
  const { userData } = useUser();

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        // Use userData for user info
        if (!userData || !userData.currentRole) {
          return;
        }

        // Fetch projects from backend API
        const response = await fetch('http://127.0.0.1:8000/api/projects');
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
        
        setProjects(processedProjects);
        setFilteredProjects(processedProjects);
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
  }, [userData, navigate]);

  // Update the search functionality
  const SearchSection = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const searchInputRef = useRef(null);

    const handleSearch = (value) => {
      setSearchTerm(value);
      
      if (!projects?.length) return;
      
      try {
        const searchText = value.toLowerCase().trim();
        
        const filtered = projects.filter(project => {
          if (!project) return false;
          
          // If there's no search text and no category filter, show all projects
          if (!searchText && categoryFilter === 'all') return true;
          
          // Check search text
          if (searchText) {
            const title = project.title?.toLowerCase() || '';
            const description = project.description?.toLowerCase() || '';
            const sellerName = project.seller?.name?.toLowerCase() || '';
            const technologies = (project.technologies || [])
              .map(tech => tech?.toLowerCase())
              .join(' ');
              
            const matchesSearch = 
              title.includes(searchText) ||
              description.includes(searchText) ||
              sellerName.includes(searchText) ||
              technologies.includes(searchText);
              
            if (!matchesSearch) return false;
          }
          
          // Check category
          if (categoryFilter !== 'all') {
            return project.category?.toLowerCase() === categoryFilter.toLowerCase();
          }
          
          return true;
        });
        
        setFilteredProjects(filtered);
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: 'Search Error',
          description: 'An error occurred while searching',
          status: 'error',
          duration: 3000,
        });
      }
    };

    const handleSearchSubmit = () => {
      // Search is already handled by handleSearch in onChange
      // This function is called on Enter key or Search button click
      searchInputRef.current?.blur();
    };

    const handleKeyDown = (e) => {
      // Prevent form submission on Enter key
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearchSubmit();
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
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
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
            {searchTerm && (
              <Box position="absolute" right="8px" top="50%" transform="translateY(-50%)" zIndex="1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: "white" }}
                  onClick={() => {
                    handleSearch('');
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
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            bg={isFilterOpen ? "whiteAlpha.200" : "whiteAlpha.100"}
            color="white"
            _hover={{ bg: "whiteAlpha.300" }}
            leftIcon={<Text>🔍</Text>}
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
                          handleSearch(searchTerm); // Reapply search with new category
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
                          handleSearch('');
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
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.05)' }}
            _active={{ transform: 'scale(0.95)' }}
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
    // Only show SeekerView if currentRole is 'seeker'
    if (userData.currentRole !== 'seeker') {
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
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    );
  };

  if (loading || !userData) {
    return (
      <AnimatedBackground>
        <Center minH="100vh">
          <Spinner color="gold.400" size="xl" />
        </Center>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <Box pt={28} pb={20}>
        <Container maxW="container.xl">
          {/* Allow any user to see this */}
          <DeveloperView />
        </Container>
      </Box>
    </AnimatedBackground>
  );
};

export default Projects;