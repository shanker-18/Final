import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  IconButton,
  Text,
  FormErrorMessage,
  HStack,
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const CreateProject = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [project, setProject] = useState({
    title: '',
    description: '',
    technologies: '',
    budget: '',
    video: null
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!project.title) newErrors.title = 'Title is required';
    if (!project.description) newErrors.description = 'Description is required';
    if (!project.technologies) newErrors.technologies = 'Technologies are required';
    if (!project.budget) newErrors.budget = 'Budget is required';
    if (!project.video) newErrors.video = 'Video is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // In this build, just simulate a successful project creation without uploading
      await new Promise(resolve => setTimeout(resolve, 800));

      toast({
        title: 'Success',
        description: 'Project created successfully',
        status: 'success',
        duration: 3000,
      });

      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      minH="100vh"
      bg="dark.900"
      pt={28}
      pb={20}
    >
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <IconButton
              icon={<FaArrowLeft />}
              onClick={() => navigate('/projects')}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
            />
            <Heading color="white" size="lg">Create New Project</Heading>
            <Box w={10} /> {/* Spacer */}
          </HStack>

          <VStack as="form" onSubmit={handleSubmit} spacing={6}>
            <FormControl isInvalid={errors.title}>
              <FormLabel color="white">Title</FormLabel>
              <Input
                placeholder="Project title"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                bg="whiteAlpha.100"
                color="white"
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.description}>
              <FormLabel color="white">Description</FormLabel>
              <Textarea
                placeholder="Project description"
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                bg="whiteAlpha.100"
                color="white"
                rows={6}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.technologies}>
              <FormLabel color="white">Technologies (comma-separated)</FormLabel>
              <Input
                placeholder="React, Node.js, MongoDB"
                value={project.technologies}
                onChange={(e) => setProject({ ...project, technologies: e.target.value })}
                bg="whiteAlpha.100"
                color="white"
              />
              <FormErrorMessage>{errors.technologies}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.budget}>
              <FormLabel color="white">Budget ($)</FormLabel>
              <Input
                type="number"
                placeholder="Project budget"
                value={project.budget}
                onChange={(e) => setProject({ ...project, budget: e.target.value })}
                bg="whiteAlpha.100"
                color="white"
              />
              <FormErrorMessage>{errors.budget}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.video}>
              <FormLabel color="white">Project Video (Required)</FormLabel>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => setProject({ ...project, video: e.target.files[0] })}
                bg="whiteAlpha.100"
                color="white"
                required
              />
              <FormErrorMessage>{errors.video}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="gold"
              size="lg"
              w="full"
              isLoading={isSubmitting}
            >
              Create Project
            </Button>
          </VStack>
        </VStack>
      </Container>
    </MotionBox>
  );
};

export default CreateProject; 