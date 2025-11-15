import React, { useState } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Avatar,
  Text,
  Box,
  useToast,
  HStack,
  VStack,
  Icon,
  Tooltip,
  Badge,
  MenuGroup,
  Button,
  Divider,
  Heading,
  Flex
} from '@chakra-ui/react';
import { 
  SettingsIcon, 
  UnlockIcon, 
  AddIcon, 
  ExternalLinkIcon,
  StarIcon,
  BellIcon,
  InfoIcon,
  EditIcon,
  TimeIcon,
  SearchIcon,
  QuestionIcon,
  EmailIcon,
} from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaUser } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { getUserRole, isDeveloper as isDevHelper, getUserRoleLabel } from '../utils/userRole';

const UserMenu = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, userData, loading } = useUser();
  const [searchHistory, setSearchHistory] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const role = getUserRole(userData);
  const isDeveloper = role === 'developer';
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged out successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/', { replace: true });
    } catch (error) {
      toast({
        title: 'Error logging out',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box 
      position="fixed"
      top={4} 
      right={4}
      zIndex={2000}
    >
      <Menu>
        <Tooltip 
          label={isLoggedIn ? 'View profile & settings' : 'Login or Register'} 
          placement="bottom"
        >
          <MenuButton
            as={IconButton}
            icon={
              user ? (
                <Avatar
                  size="sm"
                  name={user.displayName || user.email}
                  src={user.photoURL}
                  bg="gold.400"
                  color="gray.900"
                />
              ) : (
                <Box
                  bg="whiteAlpha.200"
                  w={8}
                  h={8}
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="2px solid"
                  borderColor="whiteAlpha.300"
                >
                  <Icon as={FaUser} color="white" boxSize={4} />
                </Box>
              )
            }
            variant="unstyled"
            _hover={{ transform: 'scale(1.05)' }}
            transition="all 0.2s"
          />
        </Tooltip>
        <MenuList 
          bg="gray.800" 
          boxShadow="xl"
          p={4}
          minW="320px"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          {isLoggedIn ? (
            <>
              <VStack align="start" p={4} mb={4} bg="whiteAlpha.100" rounded="lg" spacing={4}>
                <Flex justify="space-between" w="full" align="center">
                  <Avatar 
                    size="lg" 
                    name={user.displayName || user.email}
                    src={user.photoURL}
                    bg="gold.400"
                  />
                  {role && (
                    <Badge 
                      colorScheme={isDeveloper ? 'green' : 'purple'} 
                      px={3} 
                      py={1} 
                      rounded="full"
                      fontSize="sm"
                    >
                      {isDeveloper ? 'DEVELOPER' : 'PROJECT SEEKER'}
                    </Badge>
                  )}
                </Flex>
                <VStack align="start" spacing={1} w="full">
                  <Text color="white" fontWeight="bold" fontSize="md">
                    {user.displayName || user.email}
                  </Text>
                  <Text color="whiteAlpha.700" fontSize="sm">
                    {user.email}
                  </Text>
                </VStack>
              </VStack>

              <VStack spacing={2} align="stretch">
                <MenuItem
                  icon={<EditIcon boxSize={4} />}
                  onClick={() => navigate('/edit-profile')}
                  bg="whiteAlpha.50"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  color="white"
                  p={3}
                  rounded="md"
                >
                  Edit Profile
                </MenuItem>

                {isDeveloper && (
                  <MenuGroup title="Projects" color="whiteAlpha.700">
                    <MenuItem
                      icon={<AddIcon boxSize={4} />}
                      onClick={() => navigate('/add-project')}
                      bg="whiteAlpha.50"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      color="white"
                      p={3}
                      rounded="md"
                    >
                      Add Project
                    </MenuItem>

                    <MenuItem
                      icon={<StarIcon boxSize={4} />}
                      onClick={() => navigate('/my-projects')}
                      bg="whiteAlpha.50"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      color="white"
                      p={3}
                      rounded="md"
                    >
                      View My Projects
                    </MenuItem>
                  </MenuGroup>
                )}

                {!isDeveloper && (
                  <MenuGroup title="Projects" color="whiteAlpha.700">
                    <MenuItem
                      icon={<SearchIcon boxSize={4} />}
                      onClick={() => navigate('/projects')}
                      bg="whiteAlpha.50"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      color="white"
                      p={3}
                      rounded="md"
                    >
                      Browse Projects
                    </MenuItem>

                    <MenuItem
                      icon={<StarIcon boxSize={4} />}
                      onClick={() => navigate('/saved-projects')}
                      bg="whiteAlpha.50"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      color="white"
                      p={3}
                      rounded="md"
                    >
                      Saved Projects
                    </MenuItem>
                  </MenuGroup>
                )}

                {/* Notifications and Recent Activity removed */}

                {/* Settings removed */}

                <Divider my={2} borderColor="whiteAlpha.300" />

                <Button
                  leftIcon={<ExternalLinkIcon />}
                  onClick={handleLogout}
                  bg="red.600"
                  color="white"
                  _hover={{ bg: 'red.700' }}
                  size="md"
                  w="full"
                  rounded="md"
                >
                  Logout
                </Button>
              </VStack>
            </>
          ) : (
            <>
              <VStack spacing={4} p={4} bg="whiteAlpha.50" rounded="lg" mb={4}>
                <Icon as={FaUser} boxSize={10} color="whiteAlpha.600" />
                <Text color="white" fontWeight="bold">
                  Welcome to Freelance Hub
                </Text>
                <Text color="whiteAlpha.700" fontSize="sm" textAlign="center">
                  Sign in to access all features and start your journey
                </Text>
              </VStack>

              <VStack spacing={3}>
                <Button
                  w="full"
                  colorScheme="gold"
                  onClick={() => navigate('/login')}
                  leftIcon={<UnlockIcon />}
                >
                  Login
                </Button>
                <Button
                  w="full"
                  variant="outline"
                  borderColor="gold.400"
                  color="white"
                  onClick={() => navigate('/register')}
                  leftIcon={<AddIcon />}
                  _hover={{ bg: 'whiteAlpha.100' }}
                >
                  Register
                </Button>
              </VStack>
            </>
          )}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default UserMenu; 