import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Badge,
  Avatar,
  Divider,
  useToast,
  Spinner,
  AspectRatio,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import ProjectVideo from './ProjectVideo';
import { API_BASE_URL } from '../services/api';

const MotionBox = motion.create(Box);
const MotionContainer = motion.create(Container);
const MotionHeading = motion.create(Heading);
const MotionText = motion.create(Text);
const MotionBadge = motion.create(Badge);
const MotionSpinner = motion.create(Spinner);
const MotionButton = motion.create(Button);
const MotionVStack = motion.create(VStack);
const MotionHStack = motion.create(HStack);

const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95,
    filter: "blur(10px)"
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.95,
    filter: "blur(10px)",
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

const headingVariants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const contentVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();

    const fetchProject = async () => {
      try {
        if (!id) return;
        
        const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Project not found' : 'Failed to fetch project');
        }
        
        const data = await response.json();
        
        if (isMounted && data.data) {
          setProject(data.data);
          // Preload video if it exists
          if (data.data.video?.url || data.data.videoUrl) {
            const videoElement = new Image();
            videoElement.src = data.data.video?.thumbnail || data.data.thumbnail;
          }
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        
        console.error('Error:', error);
        if (isMounted) {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            duration: 3000,
          });
          navigate('/projects');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, toast, navigate]);

  if (loading) {
    return (
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        minH="100vh"
        bg="gray.900"
        pt={28}
        pb={20}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <MotionSpinner
          size="xl"
          color="gold.400"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </MotionBox>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      minH="100vh"
      bg="gray.900"
      pt={28}
      pb={20}
      position="relative"
      overflow="hidden"
    >
      {/* Animated background gradient */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial-gradient(circle at top right, rgba(255,215,0,0.15), transparent 60%),
                    radial-gradient(circle at bottom left, rgba(255,140,0,0.1), transparent 50%)"
        opacity={0.4}
        as={motion.div}
        animate={{
          background: [
            "radial-gradient(circle at top right, rgba(255,215,0,0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(255,140,0,0.1), transparent 50%)",
            "radial-gradient(circle at top left, rgba(255,215,0,0.15), transparent 60%), radial-gradient(circle at bottom right, rgba(255,140,0,0.1), transparent 50%)",
            "radial-gradient(circle at top right, rgba(255,215,0,0.15), transparent 60%), radial-gradient(circle at bottom left, rgba(255,140,0,0.1), transparent 50%)"
          ],
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <Box
          key={`particle-${i}`}
          as={motion.div}
          position="absolute"
          width={i % 3 === 0 ? "4px" : "2px"}
          height={i % 3 === 0 ? "4px" : "2px"}
          borderRadius="full"
          bg={i % 3 === 0 ? "gold.400" : "gold.200"}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, i % 3 === 0 ? 1.5 : 1, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}

      <MotionContainer
        maxW="container.lg"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <MotionVStack spacing={8} align="stretch">
          <MotionHeading
            color="white"
            variants={headingVariants}
            bgGradient="linear(to-r, gold.200, gold.400)"
            bgClip="text"
            textAlign="center"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="bold"
            whileHover={{
              scale: 1.02,
              textShadow: "0 0 8px rgba(255,215,0,0.6)"
            }}
          >
            {project.title}
          </MotionHeading>

          {(project.video || project.videoUrl) && (
            <MotionBox
              variants={cardVariants}
              whileHover="hover"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              w="full"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="xl"
              bg="whiteAlpha.50"
              backdropFilter="blur(10px)"
              position="relative"
            >
              <ProjectVideo 
                videoUrl={project.videoUrl || (project.video && project.video.url)} 
                thumbnail={project.thumbnail || (project.video && project.video.thumbnail)}
              />
            </MotionBox>
          )}

          {project.video && (
            <Box mt={6}>
              <Heading size="md" color="white" mb={3}>Project Video</Heading>
              <Box
                width="full"
                borderRadius="xl"
                overflow="hidden"
                bg="whiteAlpha.50"
                boxShadow="xl"
              >
                <AspectRatio ratio={16/9}>
                  <video
                    src={project.video.url || project.videoUrl}
                    controls
                    poster={project.video.thumbnail || project.thumbnail}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    preload="metadata"
                    loading="lazy"
                  >
                    Your browser does not support the video tag.
                  </video>
                </AspectRatio>
              </Box>
            </Box>
          )}

          <HStack spacing={4}>
            <Avatar size="md" name={project.seller?.name} />
            <VStack align="start" spacing={0}>
              <Text color="white" fontWeight="bold">
                {project.seller?.name}
              </Text>
              <Text color="gray.400" fontSize="sm">
                {project.seller?.email}
              </Text>
            </VStack>
          </HStack>

          <MotionBox
            variants={cardVariants}
            whileHover="hover"
            bg="whiteAlpha.100"
            p={8}
            borderRadius="xl"
            boxShadow="xl"
            backdropFilter="blur(10px)"
          >
            <VStack align="start" spacing={4}>
              <MotionText
                color="gray.300"
                fontSize="lg"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {project.description}
              </MotionText>

              <Divider borderColor="whiteAlpha.200" />

              <VStack align="start" spacing={2}>
                <Text color="white" fontWeight="bold">
                  Technologies
                </Text>
                <HStack spacing={2} wrap="wrap">
                  {project.technologies.map((tech, index) => (
                    <MotionBadge
                      key={index}
                      colorScheme="gold"
                      variant="subtle"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      {tech}
                    </MotionBadge>
                  ))}
                </HStack>
              </VStack>

              <Divider borderColor="whiteAlpha.200" />

              <VStack align="start" spacing={2}>
                <Text color="white" fontWeight="bold">
                  Requirements
                </Text>
                <MotionText
                  color="gray.300"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {project.requirements}
                </MotionText>
              </VStack>

              <Divider borderColor="whiteAlpha.200" />

              <HStack justify="space-between" w="full">
                <VStack align="start">
                  <Text color="white" fontWeight="bold">
                    Budget
                  </Text>
                  <Text color="gold.400" fontSize="2xl" fontWeight="bold">
                    ${project.budget}
                  </Text>
                </VStack>
                <VStack align="start">
                  <Text color="white" fontWeight="bold">
                    Location
                  </Text>
                  <Text color="gray.300">{project.location}</Text>
                </VStack>
                <VStack align="start">
                  <Text color="white" fontWeight="bold">
                    Category
                  </Text>
                  <Text color="gray.300">{project.category}</Text>
                </VStack>
              </HStack>
            </VStack>
          </MotionBox>

          <MotionHStack 
            spacing={4} 
            justify="flex-end"
            variants={contentVariants}
          >
            {user?.currentRole === 'developer' && project?.seller?.id === user?.uid && (
              <MotionButton
                colorScheme="gold"
                onClick={() => navigate(`/edit-project/${id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                _hover={{
                  bg: "gold.500",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(255,215,0,0.3)"
                }}
                bgGradient="linear(to-r, gold.400, gold.500)"
                color="gray.900"
                fontWeight="bold"
                px={8}
                w="150px"
              >
                Edit Project
              </MotionButton>
            )}
            <MotionButton
              variant="outline"
              colorScheme="gray"
              onClick={() => navigate('/projects')}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              _hover={{
                bg: "whiteAlpha.100",
                transform: "translateX(-5px)",
                borderColor: "gold.400"
              }}
              borderColor="whiteAlpha.300"
              color="white"
              px={8}
              w="150px"
            >
              Back to Projects
            </MotionButton>
          </MotionHStack>
        </MotionVStack>
      </MotionContainer>
    </MotionBox>
  );
};

export default ProjectDetails;