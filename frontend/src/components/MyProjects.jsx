import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, SimpleGrid, Card, CardBody, Stack, Button, Container, Badge, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const checkUserAndFetchProjects = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    navigate('/login');
                    return;
                }

                // First check if user is a developer
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (!userDoc.exists() || userDoc.data().userType !== 'developer') {
                    navigate('/');
                    return;
                }
                setUserType(userDoc.data().userType);

                // Fetch projects from backend API
                const response = await fetch(`${API_BASE_URL}/api/ads`);
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                
                const data = await response.json();
                
                // Filter projects for current user
                const userProjects = data.filter(project => 
                    project.seller?.id === user.uid
                );
                
                setProjects(userProjects);
            } catch (error) {
                console.error('Error:', error);
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

        checkUserAndFetchProjects();
    }, [navigate]);

    if (loading) {
        return (
            <Container maxW="container.xl" pt={20}>
                <Text textAlign="center" fontSize="lg">Loading your projects...</Text>
            </Container>
        );
    }

    if (userType !== 'developer') {
        return (
            <Container maxW="container.xl" pt={20}>
                <Box 
                    textAlign="center" 
                    p={8} 
                    borderRadius="lg" 
                    bg="gray.800"
                >
                    <Text fontSize="xl" mb={4}>
                        Only developers can access this page
                    </Text>
                    <Button
                        colorScheme="blue"
                        onClick={() => navigate('/')}
                    >
                        Go Back Home
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="container.xl" pt={20}>
            <Stack spacing={6}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Heading size="xl" mb={6}>My Projects</Heading>
                    <Button
                        colorScheme="blue"
                        onClick={() => navigate('/add-project')}
                    >
                        Add New Project
                    </Button>
                </Box>

                {projects.length === 0 ? (
                    <Box 
                        textAlign="center" 
                        p={8} 
                        borderRadius="lg" 
                        bg="gray.800"
                    >
                        <Text fontSize="xl" mb={4}>You haven't created any projects yet</Text>
                        <Text mb={6} color="gray.400">
                            Start by creating your first project to showcase your work
                        </Text>
                        <Button
                            colorScheme="blue"
                            size="lg"
                            onClick={() => navigate('/add-project')}
                        >
                            Create Your First Project
                        </Button>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {projects.map((project) => (
                            <Card 
                                key={project.id} 
                                bg="gray.800" 
                                borderRadius="lg"
                                overflow="hidden"
                                _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s' }}
                            >
                                <CardBody>
                                    <Stack spacing={4}>
                                        <Heading size="md" color="white">
                                            {project.title}
                                        </Heading>
                                        
                                        <Text color="gray.300" noOfLines={3}>
                                            {project.description}
                                        </Text>
                                        
                                        {project.technologies && (
                                            <Stack direction="row" flexWrap="wrap" gap={2}>
                                                {project.technologies.map((tech, index) => (
                                                    <Badge 
                                                        key={index}
                                                        colorScheme="blue"
                                                        variant="subtle"
                                                    >
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </Stack>
                                        )}
                                        
                                        {project.budget && (
                                            <Text color="green.400" fontWeight="bold">
                                                Budget: ${project.budget}
                                            </Text>
                                        )}
                                        
                                        <Stack direction="row" spacing={4}>
                                            <Button
                                                colorScheme="blue"
                                                onClick={() => navigate(`/project/${project.id}`)}
                                                flex={1}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                variant="outline"
                                                colorScheme="red"
                                                onClick={() => navigate(`/edit-project/${project.id}`)}
                                                flex={1}
                                            >
                                                Edit
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </CardBody>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
            </Stack>
        </Container>
    );
};

export default MyProjects; 