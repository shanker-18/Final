import React, { useState, useEffect } from 'react';
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
  Select,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Spinner,
  Center,
  Text,
  InputGroup,
  InputRightElement,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
// External auth removed; access is handled server-side
import AnimatedBackground from '../components/AnimatedBackground';
import { FaUpload } from 'react-icons/fa';

const EditProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    technologies: [],
    videoUrl: '',
    price: '',
    requirements: '',
    duration: ''
  });
  const [newTechnology, setNewTechnology] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [sellerId, setSellerId] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);

  // Category options
  const categoryOptions = [
    { value: 'web', label: 'Web Development', icon: '💻', color: 'blue.400' },
    { value: 'mobile', label: 'Mobile Development', icon: '📱', color: 'green.400' },
    { value: 'design', label: 'Design', icon: '🎨', color: 'purple.400' },
    { value: 'ai', label: 'AI & Machine Learning', icon: '🤖', color: 'red.400' },
    { value: 'blockchain', label: 'Blockchain', icon: '⛓️', color: 'orange.400' },
    { value: 'other', label: 'Other', icon: '🔧', color: 'gray.400' }
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate('/login');
          return;
        }

        console.log('Current User:', {
          uid: currentUser.uid,
          email: currentUser.email
        });

        const token = await currentUser.getIdToken();
        const response = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }

        const responseData = await response.json();
        console.log('Full API Response:', responseData);

        // Check if the data is nested inside a data property
        const projectData = responseData.data || responseData;
        console.log('Project Data after extraction:', projectData);
        console.log('Current User ID:', currentUser.uid);
        console.log('Project Seller Info:', {
          seller: projectData.seller,
          seller_id: projectData.seller_id,
          sellerId: projectData.sellerId
        });

        // Check if seller is nested or direct
        const sellerId = projectData.seller?.id || projectData.seller_id || projectData.sellerId;
        console.log('Extracted Seller ID:', sellerId);
        console.log('Comparison:', {
          sellerId: sellerId,
          currentUserId: currentUser.uid,
          areEqual: sellerId === currentUser.uid
        });

        if (!sellerId || sellerId !== currentUser.uid) {
          console.log('Access denied - IDs do not match');
          console.log('Types:', {
            sellerId: typeof sellerId,
            userId: typeof currentUser.uid
          });
          toast({
            title: 'Access Denied',
            description: 'You can only edit your own projects',
            status: 'error',
            duration: 3000,
          });
          navigate('/projects');
          return;
        }

        console.log('Access granted - setting form data');
        setProject(projectData);
        setFormData({
          title: projectData.title || '',
          description: projectData.description || '',
          category: projectData.category || '',
          technologies: projectData.technologies || [],
          videoUrl: projectData.video_url || projectData.videoUrl || '',
          price: projectData.price?.toString() || '',
          requirements: projectData.requirements || '',
          duration: projectData.duration || ''
        });
        setSellerId(sellerId);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch project details',
          status: 'error',
          duration: 3000,
        });
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Only MP4, WebM, OGG, and MOV files are allowed.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    // Validate file size (100MB limit)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 100MB.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setVideoFile(file);
  };

  const uploadVideo = async () => {
    if (!videoFile) return null;
    
    try {
      setVideoUploading(true);
      
      const formData = new FormData();
      formData.append('video', videoFile);
      
      const response = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/video`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload video');
      }
      
      const data = await response.json();
      setVideoUploading(false);
      
      return data.video?.url || null;
    } catch (error) {
      setVideoUploading(false);
      console.error('Error uploading video:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload video. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    }
  };

  const handleAddTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const handleRemoveTechnology = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to update a project');
      }

      // Validate that current user is the project owner
      if (currentUser.uid !== sellerId) {
        throw new Error('You do not have permission to edit this project');
      }

      let videoUrl = formData.videoUrl;
      
      // If a new video file was selected, upload it first
      if (videoFile) {
        const uploadedVideoUrl = await uploadVideo();
        if (uploadedVideoUrl) {
          videoUrl = uploadedVideoUrl;
        }
      }

      const token = await currentUser.getIdToken();
      const priceValue = parseFloat(formData.price);

      // Format data to match MongoDB structure
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        technologies: formData.technologies,
        // Use the correct field names matching the database schema
        video: videoUrl ? {
          url: videoUrl
        } : undefined,
        price: priceValue,
        requirements: formData.requirements,
        duration: formData.duration,
        seller: {
          id: currentUser.uid,
          name: currentUser.displayName || 'Anonymous',
          avatar: currentUser.photoURL || ''
        }
      };

      console.log('Sending update data:', updateData);

      // Use the new endpoint with proper error handling
      const response = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (!response.ok) {
        const errorMessage = responseData.message || responseData.detail || 'Failed to update project';
        console.error('Update error:', errorMessage);
        throw new Error(errorMessage);
      }

      toast({
        title: 'Success',
        description: 'Project updated successfully',
        status: 'success',
        duration: 3000,
      });
      navigate('/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update project',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('You must be logged in to delete a project');
      }

      const token = await currentUser.getIdToken();
      const response = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
        status: 'success',
        duration: 3000,
      });
      navigate('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete project',
        status: 'error',
        duration: 3000,
      });
    }
    onClose();
  };

  if (loading) {
    return (
      <AnimatedBackground>
        <Center minH="100vh">
          <Spinner size="xl" color="gold.400" />
        </Center>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <Box pt={28} pb={20}>
        <Container maxW="container.md">
          <VStack spacing={8} align="stretch">
            <Heading
              color="white"
              bgGradient="linear(to-r, gold.200, gold.400)"
              bgClip="text"
              textAlign="center"
              fontSize={{ base: "3xl", md: "4xl" }}
            >
              Edit Project
            </Heading>

            <Box
              as="form"
              onSubmit={handleSubmit}
              bg="whiteAlpha.100"
              p={8}
              borderRadius="xl"
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor="whiteAlpha.300"
              boxShadow="xl"
              _hover={{
                borderColor: "gold.400",
                boxShadow: "2xl"
              }}
              transition="all 0.3s"
            >
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel color="white" fontWeight="bold">Project Title</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    bg="whiteAlpha.200"
                    color="white"
                    _hover={{ bg: "whiteAlpha.300" }}
                    _focus={{ bg: "whiteAlpha.300", borderColor: "gold.400" }}
                    fontSize="lg"
                    height="50px"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="white" fontWeight="bold">Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    bg="whiteAlpha.200"
                    color="white"
                    _hover={{ bg: "whiteAlpha.300" }}
                    _focus={{ bg: "whiteAlpha.300", borderColor: "gold.400" }}
                    minH="150px"
                    fontSize="md"
                    resize="vertical"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="white" fontWeight="bold">Category</FormLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    bg="whiteAlpha.200"
                    color="white"
                    _hover={{ bg: "whiteAlpha.300" }}
                    _focus={{ bg: "whiteAlpha.300", borderColor: "gold.400" }}
                    height="50px"
                    fontSize="lg"
                    sx={{
                      option: {
                        bg: 'gray.800',
                        color: 'white',
                        _hover: { bg: 'whiteAlpha.200' },
                        padding: '12px',
                        fontSize: '16px'
                      }
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#2D3748', color: 'white' }}>
                      Select a Category
                    </option>
                    {categoryOptions.map(category => (
                      <option
                        key={category.value}
                        value={category.value}
                        style={{ backgroundColor: '#2D3748', color: 'white', padding: '12px' }}
                      >
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel color="white">Technologies</FormLabel>
                  <InputGroup>
                    <Input
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      placeholder="Add technology"
                      bg="whiteAlpha.200"
                      color="white"
                      _hover={{ bg: "whiteAlpha.300" }}
                      _focus={{ bg: "whiteAlpha.300", borderColor: "gold.400" }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTechnology();
                        }
                      }}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleAddTechnology}
                        colorScheme="gold"
                        bg="gold.400"
                        color="gray.800"
                        _hover={{ bg: "gold.500" }}
                      >
                        Add
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Box mt={2}>
                    <HStack spacing={2} wrap="wrap">
                      {formData.technologies.map((tech, index) => (
                        <Tag
                          key={index}
                          size="md"
                          borderRadius="full"
                          variant="solid"
                          bg="gold.400"
                          color="gray.800"
                          mt={2}
                        >
                          <TagLabel>{tech}</TagLabel>
                          <TagCloseButton
                            onClick={() => handleRemoveTechnology(tech)}
                            _hover={{ bg: "whiteAlpha.300" }}
                          />
                        </Tag>
                      ))}
                    </HStack>
                  </Box>
                </FormControl>

                <FormControl>
                  <FormLabel color="white">Video URL</FormLabel>
                  <Input
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    bg="whiteAlpha.200"
                    color="white"
                    _hover={{ bg: "whiteAlpha.300" }}
                    _focus={{ bg: "whiteAlpha.300", borderColor: "gold.400" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="white">Upload New Video</FormLabel>
                  <Box
                    border="2px dashed"
                    borderColor="whiteAlpha.300"
                    borderRadius="md"
                    p={4}
                    textAlign="center"
                    bg="whiteAlpha.100"
                    _hover={{ borderColor: "gold.400", bg: "whiteAlpha.200" }}
                  >
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      style={{ display: 'none' }}
                      id="video-upload"
                    />
                    <label htmlFor="video-upload">
                      <Button
                        as="span"
                        cursor="pointer"
                        colorScheme="gold"
                        size="md"
                        leftIcon={<FaUpload />}
                        isLoading={videoUploading}
                        loadingText="Uploading..."
                      >
                        {videoFile ? 'Change Video File' : 'Select Video File'}
                      </Button>
                    </label>
                    {videoFile && (
                      <Text mt={2} color="white">
                        Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </Text>
                    )}
                    <Text fontSize="sm" color="whiteAlpha.600" mt={2}>
                      Accepted formats: MP4, WebM, OGG, MOV (Max 100MB)
                    </Text>
                  </Box>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="white">Price (USD)</FormLabel>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    bg="whiteAlpha.200"
                    color="white"
                    _hover={{ bg: "whiteAlpha.300" }}
                    _focus={{ bg: "whiteAlpha.300", borderColor: "gold.400" }}
                  />
                </FormControl>

                <HStack spacing={4} width="100%" justify="space-between" pt={6}>
                  <Button
                    onClick={onOpen}
                    bg="red.500"
                    color="white"
                    _hover={{ bg: "red.600" }}
                    size="lg"
                  >
                    Delete Project
                  </Button>
                  <HStack spacing={4}>
                    <Button
                      onClick={() => navigate('/projects')}
                      variant="outline"
                      color="white"
                      _hover={{ bg: "whiteAlpha.200" }}
                      size="lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      bg="gold.400"
                      color="gray.800"
                      _hover={{ bg: "gold.500" }}
                      _active={{ bg: "gold.600" }}
                      size="lg"
                      isLoading={submitting}
                      loadingText="Updating..."
                      fontWeight="bold"
                    >
                      Update Project
                    </Button>
                  </HStack>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" color="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Project
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AnimatedBackground>
  );
};

export default EditProject; 