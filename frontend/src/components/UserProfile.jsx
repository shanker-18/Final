import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// External auth removed; logout disabled
import { FaUser, FaCode, FaSearch, FaPlus, FaList, FaStar, FaBell, FaClock, FaCog, FaSignOutAlt, FaEdit, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import './UserProfile.css';
import { Button, Box, Text, VStack, HStack, Avatar, useToast, Divider, useBreakpointValue } from '@chakra-ui/react';
import { getUserRole } from '../utils/userRole';

const UserProfile = ({ user }) => {
    const [showProjectMenu, setShowProjectMenu] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast({
                title: 'Logged out successfully',
                status: 'success',
                duration: 3000,
            });
            navigate('/login', { replace: true });
        } catch (error) {
            toast({
                title: 'Error logging out',
                status: 'error',
                duration: 3000,
            });
        }
    };

    const handleNavigate = (path, message) => {
        navigate(path);
        if (message) {
            toast({
                title: message,
                status: 'success',
                duration: 2000,
            });
        }
    };

    const role = getUserRole(user);

    const getRoleIcon = () => {
        if (role === 'developer') {
            return <FaCode className="role-icon" title="Developer" />;
        }
        return <FaSearch className="role-icon" title="Project Seeker" />;
    };

    const getRoleText = () => {
        if (!role) return '';
        return role === 'developer' ? 'Developer' : 'Project Seeker';
    };

    const ProjectMenu = () => (
        <div className="project-menu">
            <button className="menu-item" onClick={() => console.log('Add Project')}>
                <FaPlus /> Add Project
            </button>
            <button className="menu-item" onClick={() => console.log('View Projects')}>
                <FaList /> View My Projects
            </button>
        </div>
    );

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        // Add logic to follow/unfollow the user in the database
    };

    return (
        <Box
            p={isMobile ? 2 : 4}
            bg="gray.800"
            borderRadius="md"
            boxShadow="2xl"
            w={isMobile ? '100vw' : '320px'}
            minH={isMobile ? '100vh' : 'auto'}
            position={isMobile ? 'fixed' : 'relative'}
            top={isMobile ? 0 : 'auto'}
            left={isMobile ? 0 : 'auto'}
            zIndex={isMobile ? 2000 : 'auto'}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <VStack spacing={4} w="full" align="center">
                <Avatar size="xl" name={user?.name} src={user?.avatar} bg="gold.400" color="gray.900" />
                <HStack spacing={2}>
                    <Text fontSize="xl" color="white" fontWeight="bold">{user?.name}</Text>
                    <Box px={3} py={1} bg="purple.300" color="gray.900" borderRadius="full" fontSize="sm" fontWeight="bold">
                        {getRoleText().toUpperCase()}
                    </Box>
                </HStack>
                <Text color="whiteAlpha.700" fontSize="sm">{user?.email}</Text>
                <Button
                    leftIcon={<FaEdit />}
                    colorScheme="gold"
                    variant="outline"
                    w="full"
                    onClick={() => handleNavigate('/edit-profile', 'Edit your profile')}
                >
                    Edit Profile
                </Button>
            </VStack>
            <Divider my={4} borderColor="whiteAlpha.300" />
            <Box w="full">
                <Text color="whiteAlpha.700" fontWeight="bold" mb={2} ml={2} fontSize="sm">Projects</Text>
                <VStack spacing={1} align="stretch">
                    <Button
                        leftIcon={<FaSearch />}
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        justifyContent="flex-start"
                        onClick={() => handleNavigate('/projects', 'Browsing projects')}
                        w="full"
                    >
                        Browse Projects
                    </Button>
                    <Button
                        leftIcon={<FaStar />}
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        justifyContent="flex-start"
                        onClick={() => handleNavigate('/saved-projects', 'Viewing saved projects')}
                        w="full"
                    >
                        Saved Projects
                    </Button>
                    <Button
                        leftIcon={<FaBell />}
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        justifyContent="flex-start"
                        onClick={() => handleNavigate('/notifications', 'Viewing notifications')}
                        w="full"
                    >
                        Notifications
                    </Button>
                    <Button
                        leftIcon={<FaClock />}
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        justifyContent="flex-start"
                        onClick={() => handleNavigate('/recent-activity', 'Viewing recent activity')}
                        w="full"
                    >
                        Recent Activity
                    </Button>
                    <Button
                        leftIcon={<FaCog />}
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        justifyContent="flex-start"
                        onClick={() => handleNavigate('/settings', 'Opening settings')}
                        w="full"
                    >
                        Settings
                    </Button>
                    {/* Developer-specific options */}
                    {role === 'developer' && (
                        <>
                            <Button
                                leftIcon={<FaList />}
                                variant="ghost"
                                colorScheme="whiteAlpha"
                                justifyContent="flex-start"
                                onClick={() => handleNavigate('/my-projects', 'Viewing your projects')}
                                w="full"
                            >
                                View My Projects
                            </Button>
                            <Button
                                leftIcon={<FaPlus />}
                                variant="ghost"
                                colorScheme="whiteAlpha"
                                justifyContent="flex-start"
                                onClick={() => handleNavigate('/add-project', 'Add a new project')}
                                w="full"
                            >
                                Add Project
                            </Button>
                        </>
                    )}
                </VStack>
            </Box>
            <Divider my={4} borderColor="whiteAlpha.300" />
            <Box w="full">
                <VStack spacing={1} align="stretch">
                    <Button
                        leftIcon={<FaQuestionCircle />}
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        justifyContent="flex-start"
                        onClick={() => handleNavigate('/help', 'Opening help & support')}
                        w="full"
                    >
                        Help & Support
                    </Button>
                    <Button
                        leftIcon={<FaInfoCircle />}
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        justifyContent="flex-start"
                        onClick={() => handleNavigate('/about', 'About this platform')}
                        w="full"
                    >
                        About
                    </Button>
                </VStack>
            </Box>
            <Divider my={4} borderColor="whiteAlpha.300" />
            <Button
                leftIcon={<FaSignOutAlt />}
                colorScheme="red"
                variant="solid"
                w="full"
                mt={2}
                onClick={handleLogout}
            >
                Logout
            </Button>
        </Box>
    );
};

export default UserProfile; 