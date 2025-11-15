import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Icon,
  SimpleGrid,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { StarIcon } from '@chakra-ui/icons';
import { useUser } from '../contexts/UserContext';

const MotionBox = motion.create(Box);

const API_URL = 'http://127.0.0.1:5000/api';

const SavedProjects = () => {
  const { userData } = useUser();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const savedIds = userData?.savedProjects || [];

  useEffect(() => {
    const fetchSavedProjects = async () => {
      try {
        if (!savedIds.length) {
          setProjects([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/projects`);
        if (!res.ok) throw new Error('Failed to load projects');
        const data = await res.json();
        const all = data.data || [];
        const saved = all.filter((p) => savedIds.includes(p._id));
        setProjects(saved);
      } catch (error) {
        console.error('Error loading saved projects:', error);
        toast({
          title: 'Error loading saved projects',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProjects();
  }, [JSON.stringify(savedIds)]);

  if (loading) {
    return (
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        minH="100vh"
        bg="gray.900"
        pt={28}
        pb={10}
      >
        <Center minH="60vh">
          <Spinner color="gold.400" size="lg" />
        </Center>
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
      pb={10}
    >
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Heading
            color="white"
            display="flex"
            alignItems="center"
            gap={3}
          >
            <Icon as={StarIcon} />
            Saved Projects
          </Heading>

          {projects.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {projects.map((project) => (
                <Box
                  key={project._id}
                  bg="whiteAlpha.200"
                  borderRadius="xl"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  boxShadow="xl"
                  position="relative"
                  p={6}
                >
                  <Heading size="md" color="white" mb={3}>
                    {project.title}
                  </Heading>
                  <Text color="whiteAlpha.800" noOfLines={4} mb={4}>
                    {project.description}
                  </Text>

                  {project.technologies && project.technologies.length > 0 && (
                    <Box mb={4}>
                      <Text color="whiteAlpha.800" fontSize="sm" mb={2}>
                        Technologies:
                      </Text>
                      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                        {project.technologies.map((tech, index) => (
                          <Box
                            key={index}
                            as="span"
                            px={2}
                            py={1}
                            borderRadius="full"
                            bg="blue.500"
                            color="white"
                            fontSize="xs"
                            textAlign="center"
                          >
                            {tech}
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Box>
                  )}

                  <Box mt={2}>
                    <Text color="whiteAlpha.700" fontSize="sm">
                      Budget: {project.budget ? `₹${project.budget}` : 'N/A'}
                    </Text>
                    <Text color="whiteAlpha.700" fontSize="sm">
                      Category: {project.category || 'N/A'}
                    </Text>
                    {project.seller?.name && (
                      <Text color="whiteAlpha.700" fontSize="sm" mt={1}>
                        Posted by: {project.seller.name}
                      </Text>
                    )}
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box
              p={8}
              bg="whiteAlpha.100"
              borderRadius="xl"
              textAlign="center"
            >
              <Icon as={StarIcon} w={12} h={12} color="whiteAlpha.400" mb={4} />
              <Text color="white" fontSize="xl">
                No saved projects yet
              </Text>
              <Text color="whiteAlpha.600" mt={2}>
                Projects you save will appear here
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </MotionBox>
  );
};

export default SavedProjects;
