import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  Heading,
  Alert,
  AlertIcon,
  useToast,
  Container,
  useColorModeValue,
  AspectRatio,
  Text,
  Progress,
  Tag,
  HStack,
  IconButton,
  FormHelperText
} from '@chakra-ui/react';
import { useUser } from '../contexts/UserContext';
// External auth removed; AddProject relies on UserContext
import { CloseIcon } from '@chakra-ui/icons';
import ProjectVideo from './ProjectVideo';
import { API_BASE_URL } from '../services/api';

const API_URL = `${API_BASE_URL}/api`;

const AddProject = () => {
  const navigate = useNavigate();
  const { user, userData } = useUser();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    requirements: '',
    budget: '',
    category: '',
    video: null,
    videoPreview: null
  });
  const [techInput, setTechInput] = useState('');
  const [showTechError, setShowTechError] = useState(false);
  const [isTechValid, setIsTechValid] = useState(true);
  const [otherCategory, setOtherCategory] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTechInputChange = (e) => {
    setTechInput(e.target.value);
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      const newTechs = techInput.split(',')
        .map(tech => tech.trim())
        .filter(tech => tech && tech.length > 0);
      
      if (newTechs.length > 0) {
        setFormData(prev => ({
          ...prev,
          technologies: [...new Set([...prev.technologies, ...newTechs])]
        }));
        setTechInput('');
        setShowTechError(false); // Hide error when technology is added
      }
    }
  };

  const handleAddTech = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTechnology();
    }
  };

  const handleRemoveTech = (techToRemove) => {
    const updatedTechs = formData.technologies.filter(tech => tech !== techToRemove);
    setFormData(prev => ({
      ...prev,
      technologies: updatedTechs
    }));
    setShowTechError(updatedTechs.length === 0); // Show error only if no technologies remain
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select a video file smaller than 100MB',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a valid video file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        video: file,
        videoPreview: previewUrl
      }));

      // Show success toast
      toast({
        title: 'Video selected',
        description: 'Video file has been selected successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      category: value
    }));
    if (value !== 'other') {
      setOtherCategory('');
    }
  };

  const validateForm = () => {
    // Title validation
    if (!formData.title.trim()) {
      throw new Error('Title is required');
    }
    if (formData.title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters long');
    }

    // Description validation
    if (!formData.description.trim()) {
      throw new Error('Description is required');
    }
    if (formData.description.trim().length < 10) {
      throw new Error('Description must be at least 10 characters long');
    }

    // Technologies validation
    if (formData.technologies.length === 0) {
      setShowTechError(true); // Show error if no technologies during form submission
      throw new Error('At least one technology is required');
    }

    // Requirements validation
    if (!formData.requirements.trim()) {
      throw new Error('Requirements are required');
    }
    if (formData.requirements.trim().length < 10) {
      throw new Error('Requirements must be at least 10 characters long');
    }

    // Budget validation
    const budget = parseFloat(formData.budget);
    if (!budget || isNaN(budget) || budget <= 0) {
      throw new Error('Valid budget amount is required (must be greater than 0)');
    }

    // Category validation
    if (!formData.category) {
      throw new Error('Category is required');
    }
    if (formData.category === 'other' && !otherCategory.trim()) {
      throw new Error('Please specify the other category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      if (!user) {
        throw new Error('You must be logged in to create a project');
      }

      // Validate form
      validateForm();

      // Create project data object with proper type conversion (without video yet)
      let projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        technologies: formData.technologies,
        requirements: formData.requirements.trim(),
        budget: parseFloat(formData.budget),
        category: formData.category === 'other' ? otherCategory.trim() : formData.category.toLowerCase().trim(),
        seller: {
          id: user?.uid,
          name: user?.displayName || '',
          email: user?.email || '',
          role: userData?.currentRole || 'developer'
        },
        status: "active"
      };

      // 1) Create project in backend (MongoDB) to get a stable _id
      const createResponse = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create project');
      }

      const created = await createResponse.json();
      console.log('Project created:', created);
      const projectId = created?.data?._id || created?._id;

      // 2) If there is a video, upload it via backend so Cloudinary uses the same _id
      if (formData.video && projectId) {
        try {
          toast({
            title: 'Uploading video',
            description: 'Please wait while we upload your video...',
            status: 'info',
            duration: null,
            isClosable: false,
          });

          const videoFormData = new FormData();
          videoFormData.append('file', formData.video);

          const uploadResponse = await fetch(`${API_URL}/projects/${projectId}/upload-video`, {
            method: 'POST',
            body: videoFormData,
          });

          if (!uploadResponse.ok) {
            let message = 'Failed to upload video';
            try {
              const errorData = await uploadResponse.json();
              if (errorData?.message) {
                message = errorData.message;
              }
            } catch (_err) {
              // ignore JSON parse errors, keep default message
            }
            throw new Error(message);
          }

          const uploadResult = await uploadResponse.json();
          console.log('Video uploaded and project updated:', uploadResult);

          toast({
            title: 'Video uploaded',
            description: 'Video has been uploaded successfully!',
            status: 'success',
            duration: 3000,
          });
        } catch (error) {
          console.error('Error uploading video:', error);
          toast({
            title: 'Video upload failed',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          // We do not throw here so the project itself remains created.
        }
      }

      // Show success message
      toast({
        title: 'Success',
        description: 'Project created successfully!',
        status: 'success',
        duration: 3000,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        technologies: [],
        requirements: '',
        budget: '',
        category: '',
        video: null,
        videoPreview: null
      });
      setTechInput('');
      setOtherCategory('');
      setUploadProgress(0);

      // Navigate to project details
      navigate(`/project/${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Clean up video preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (formData.videoPreview) {
        URL.revokeObjectURL(formData.videoPreview);
      }
    };
  }, [formData.videoPreview]);

  if (!user) {
    return (
      <Box maxWidth="md" mx="auto" p={3}>
        <Alert status="warning">
          <AlertIcon />
          Please log in to access this page.
        </Alert>
      </Box>
    );
  }

  const isDeveloper = userData?.currentRole === 'developer';

  if (!isDeveloper) {
    return (
      <Box maxWidth="md" mx="auto" p={3}>
        <Alert status="error">
          <AlertIcon />
          Only developers can create projects. Please update your role in your profile settings.
        </Alert>
      </Box>
    );
  }

  return (
    <Box 
      minH="100vh" 
      w="100%" 
      p={4} 
      bg="gray.900"
    >
      <Container maxW="7xl" py={4}>
        <Heading mb={6} color="white" textAlign="center" size="xl">Create New Project</Heading>

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Box 
          bg="gray.800" 
          p={8} 
          borderRadius="xl" 
          boxShadow="2xl"
          border="1px"
          borderColor="gray.700"
        >
          <form onSubmit={handleSubmit} noValidate>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel color="gray.200">Title</FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                  required
                  bg="gray.700"
                  color="white"
                  border="1px"
                  borderColor="gray.600"
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.200">Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter project description"
                  rows={4}
                  required
                  bg="gray.700"
                  color="white"
                  border="1px"
                  borderColor="gray.600"
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
              </FormControl>

              <FormControl isRequired isInvalid={showTechError}>
                <FormLabel color="gray.200">Technologies *</FormLabel>
                <HStack spacing={2}>
                  <Input
                    value={techInput}
                    onChange={handleTechInputChange}
                    onKeyDown={handleAddTech}
                    placeholder="Type a technology and press Enter, comma, or Add button"
                    bg="gray.700"
                    color="white"
                    border="1px"
                    borderColor={showTechError ? "red.300" : "gray.600"}
                    _hover={{ borderColor: "blue.400" }}
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                  />
                  <Button
                    onClick={addTechnology}
                    colorScheme="blue"
                    px={6}
                    isDisabled={!techInput.trim()}
                  >
                    Add
                  </Button>
                </HStack>
                
                {formData.technologies.length > 0 ? (
                  <HStack mt={2} spacing={2} flexWrap="wrap">
                    {formData.technologies.map((tech, index) => (
                      <Tag
                        key={index}
                        size="md"
                        borderRadius="full"
                        variant="solid"
                        colorScheme="blue"
                      >
                        {tech}
                        <IconButton
                          size="xs"
                          ml={1}
                          icon={<CloseIcon />}
                          onClick={() => handleRemoveTech(tech)}
                          variant="ghost"
                          colorScheme="blue"
                          aria-label={`Remove ${tech}`}
                        />
                      </Tag>
                    ))}
                  </HStack>
                ) : (
                  <Text color="red.300" fontSize="sm" mt={1}>
                    Please add at least one technology
                  </Text>
                )}
                <FormHelperText color="gray.400">
                  Add technologies one at a time or separate multiple with commas
                </FormHelperText>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.200">Budget</FormLabel>
                <Input
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter project budget"
                  min={0}
                  required
                  bg="gray.700"
                  color="white"
                  border="1px"
                  borderColor="gray.600"
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.200">Requirements</FormLabel>
                <Textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="Enter project requirements"
                  rows={3}
                  required
                  bg="gray.700"
                  color="white"
                  border="1px"
                  borderColor="gray.600"
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="gray.200">Category</FormLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  placeholder="Select a category"
                  required
                  bg="gray.800"
                  color="white"
                  border="1px"
                  borderColor="gray.600"
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                  sx={{
                    "& option": {
                      bg: "gray.800",
                      color: "white"
                    }
                  }}
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Full Stack</option>
                  <option value="mobile">Mobile</option>
                  <option value="design">Design</option>
                  <option value="other">Other</option>
                </Select>
                
                {formData.category === 'other' && (
                  <Input
                    mt={2}
                    placeholder="Specify your category"
                    value={otherCategory}
                    onChange={(e) => setOtherCategory(e.target.value)}
                    bg="gray.800"
                    color="white"
                    border="1px"
                    borderColor="gray.600"
                    _hover={{ borderColor: "blue.400" }}
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #4299E1" }}
                  />
                )}
              </FormControl>

              <FormControl>
                <FormLabel color="gray.200">Video</FormLabel>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  display="none"
                  id="video-upload"
                />
                <VStack spacing={4} width="full">
                  <Button
                    as="label"
                    htmlFor="video-upload"
                    cursor="pointer"
                    colorScheme="blue"
                    width="full"
                    leftIcon={<i className="fas fa-upload" />}
                  >
                    {formData.video ? 'Change Video' : 'Upload Video'}
                  </Button>
                  
                  {formData.video && (
                    <Text color="gray.400" fontSize="sm">
                      Selected file: {formData.video.name}
                    </Text>
                  )}
                  
                  {uploadProgress > 0 && (
                    <Box width="full">
                      <Progress
                        value={uploadProgress}
                        size="sm"
                        colorScheme="blue"
                        borderRadius="full"
                      />
                      <Text color="gray.400" fontSize="sm" mt={1} textAlign="center">
                        Uploading: {uploadProgress}%
                      </Text>
                    </Box>
                  )}

                  {formData.videoPreview && (
                    <Box width="full" borderRadius="md" overflow="hidden" bg="gray.700">
                      <AspectRatio ratio={16/9}>
                        <video
                          src={formData.videoPreview}
                          controls
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </AspectRatio>
                    </Box>
                  )}
                </VStack>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                size="lg"
                isLoading={loading}
                loadingText="Creating Project..."
                mt={4}
                _hover={{ bg: "blue.500" }}
                _active={{ bg: "blue.600" }}
              >
                Create Project
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default AddProject; 