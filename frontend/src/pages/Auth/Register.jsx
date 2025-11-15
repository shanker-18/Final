import React, { useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Tabs,
  TabList,
  Tab,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../config/firebase';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Create reusable motion components
const MotionBox = motion.create(Box);
const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const [userType, setUserType] = useState('developer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGoogleRegistering, setIsGoogleRegistering] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // Color schemes based on user type
  const getColorScheme = () => {
    return userType === 'developer' ? 'customRed' : 'customBlue';
  };

  const getBgGradient = () => {
    return userType === 'developer'
      ? 'radial(circle at top right, rgba(255,77,77,0.15), transparent 70%)'
      : 'radial(circle at top right, rgba(77,159,255,0.15), transparent 70%)';
  };

  const getButtonBg = () => {
    return userType === 'developer' ? 'customRed.500' : 'customBlue.500';
  };

  const getButtonHoverBg = () => {
    return userType === 'developer' ? 'customRed.600' : 'customBlue.600';
  };

  const getTabSelectedBg = () => {
    return userType === 'developer' ? 'customRed.500' : 'customBlue.500';
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsRegistering(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update basic profile
      await updateProfile(firebaseUser, {
        displayName: name,
      });

      const role = userType === 'developer' ? 'developer' : 'seeker';

      // Create Firestore user document with role info
      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(
        userRef,
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: name,
          phone,
          currentRole: role,
          roles: [role],
          userType: role,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast({
        title: 'Registration successful',
        description: `Welcome to Freelance Hub as a ${role}!`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      // Redirect seekers to survey, developers to welcome page
      if (role === 'seeker') {
        navigate('/seeker-survey', { replace: true });
      } else {
        navigate('/welcome', { replace: true });
      }
    } catch (error) {
      console.error('Registration error:', error);
      let description = 'Unable to register. Please try again.';
      if (error.code === 'auth/email-already-in-use')
        description = 'This email is already registered.';
      toast({ title: 'Registration failed', description, status: 'error', duration: 4000, isClosable: true });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleRegistering(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const role = userType === 'developer' ? 'developer' : 'seeker';

      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(
        userRef,
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || name,
          phone,
          currentRole: role,
          roles: [role],
          userType: role,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast({
        title: 'Registered with Google',
        description: `Welcome to Freelance Hub as a ${role}!`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      // Redirect seekers to survey, developers to welcome page
      if (role === 'seeker') {
        navigate('/seeker-survey', { replace: true });
      } else {
        navigate('/welcome', { replace: true });
      }
    } catch (error) {
      console.error('Google registration error:', error);
      toast({
        title: 'Google registration failed',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsGoogleRegistering(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="dark.900"
      py={32}
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="flex-start"
      justifyContent="center"
    >
      {/* Animated Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient={getBgGradient()}
        opacity={0.3}
        transition="all 0.3s ease"
      />

      <Container maxW="container.md" centerContent>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          w="100%"
        >
          <Stack
            spacing={8}
            bg="rgba(0, 0, 0, 0.3)"
            rounded="xl"
            p={{ base: 8, sm: 10 }}
            pb={12}
            backdropFilter="blur(10px)"
            border="1px solid"
            borderColor={userType === 'developer' ? 'cyan.400' : 'customBlue.500'}
            transition="all 0.3s ease"
            mb={16}
            mx="auto"
            maxW="480px"
            w="100%"
            boxShadow={`0 0 20px ${userType === 'developer' ? 'rgba(103, 232, 249, 0.1)' : 'rgba(77, 159, 255, 0.1)'}`}
          >
            <Stack spacing={6} textAlign="center">
              <Heading
                fontSize="2xl"
                color="white"
                fontWeight="bold"
              >
                Create Account
              </Heading>
              <Text color="whiteAlpha.800" fontSize="md">
                Join our freelancing community
              </Text>
            </Stack>

            <Tabs
              isFitted
              variant="unstyled"
              onChange={(index) => setUserType(index === 0 ? 'developer' : 'seeker')}
              size="md"
            >
              <TabList mb={8}>
                <Tab
                  color="whiteAlpha.800"
                  bg="transparent"
                  _selected={{ 
                    color: 'white',
                    bg: 'transparent',
                    borderColor: userType === 'developer' ? 'cyan.400' : 'whiteAlpha.400'
                  }}
                  transition="all 0.3s ease"
                  fontSize="md"
                  py={3}
                  borderWidth={1}
                  borderColor={userType === 'developer' ? 'cyan.400' : 'whiteAlpha.200'}
                  borderRadius="md"
                  _hover={{ borderColor: userType === 'developer' ? 'cyan.300' : 'whiteAlpha.400' }}
                  mr={2}
                >
                  Developer
                </Tab>
                <Tab
                  color="whiteAlpha.800"
                  bg="transparent"
                  _selected={{ 
                    color: 'white',
                    bg: 'transparent',
                    borderColor: userType === 'seeker' ? 'customBlue.500' : 'whiteAlpha.400'
                  }}
                  transition="all 0.3s ease"
                  fontSize="md"
                  py={3}
                  borderWidth={1}
                  borderColor={userType === 'seeker' ? 'customBlue.500' : 'whiteAlpha.200'}
                  borderRadius="md"
                  _hover={{ borderColor: userType === 'seeker' ? 'customBlue.400' : 'whiteAlpha.400' }}
                >
                  Project Seeker
                </Tab>
              </TabList>
            </Tabs>

            <form onSubmit={handleRegister}>
              <Stack spacing={5}>
                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.600" fontSize="sm">Full Name</FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor={userType === 'developer' ? 'cyan.400' : 'customBlue.500'}
                    color="white"
                    _placeholder={{ color: 'whiteAlpha.500' }}
                    _hover={{ borderColor: userType === 'developer' ? 'cyan.300' : 'customBlue.400' }}
                    _focus={{ 
                      borderColor: userType === 'developer' ? 'cyan.400' : 'customBlue.500',
                      boxShadow: userType === 'developer' ? '0 0 0 1px #67E8F9' : '0 0 0 1px #4D9FFF'
                    }}
                    size="lg"
                    fontSize="md"
                    h="50px"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.600" fontSize="sm">Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor={userType === 'developer' ? 'cyan.400' : 'customBlue.500'}
                    color="white"
                    _placeholder={{ color: 'whiteAlpha.500' }}
                    _hover={{ borderColor: userType === 'developer' ? 'cyan.300' : 'customBlue.400' }}
                    _focus={{ 
                      borderColor: userType === 'developer' ? 'cyan.400' : 'customBlue.500',
                      boxShadow: userType === 'developer' ? '0 0 0 1px #67E8F9' : '0 0 0 1px #4D9FFF'
                    }}
                    size="lg"
                    fontSize="md"
                    h="50px"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.600" fontSize="sm">Phone Number</FormLabel>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor={userType === 'developer' ? 'cyan.400' : 'customBlue.500'}
                    color="white"
                    _placeholder={{ color: 'whiteAlpha.500' }}
                    _hover={{ borderColor: userType === 'developer' ? 'cyan.300' : 'customBlue.400' }}
                    _focus={{ 
                      borderColor: userType === 'developer' ? 'cyan.400' : 'customBlue.500',
                      boxShadow: userType === 'developer' ? '0 0 0 1px #67E8F9' : '0 0 0 1px #4D9FFF'
                    }}
                    size="lg"
                    fontSize="md"
                    h="50px"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.600" fontSize="sm">Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      bg="whiteAlpha.50"
                      border="1px solid"
                      borderColor={userType === 'developer' ? 'cyan.400' : 'customBlue.500'}
                      color="white"
                      _placeholder={{ color: 'whiteAlpha.500' }}
                      _hover={{ borderColor: userType === 'developer' ? 'cyan.300' : 'customBlue.400' }}
                      _focus={{ 
                        borderColor: userType === 'developer' ? 'cyan.400' : 'customBlue.500',
                        boxShadow: userType === 'developer' ? '0 0 0 1px #67E8F9' : '0 0 0 1px #4D9FFF'
                      }}
                      fontSize="md"
                      h="50px"
                    />
                    <InputRightElement h="50px" w="50px">
                      <IconButton
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        color="whiteAlpha.600"
                        _hover={{ color: 'white' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.600" fontSize="sm">Confirm Password</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor={userType === 'developer' ? 'cyan.400' : 'customBlue.500'}
                    color="white"
                    _placeholder={{ color: 'whiteAlpha.500' }}
                    _hover={{ borderColor: userType === 'developer' ? 'cyan.300' : 'customBlue.400' }}
                    _focus={{ 
                      borderColor: userType === 'developer' ? 'cyan.400' : 'customBlue.500',
                      boxShadow: userType === 'developer' ? '0 0 0 1px #67E8F9' : '0 0 0 1px #4D9FFF'
                    }}
                    size="lg"
                    fontSize="md"
                    h="50px"
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg={userType === 'seeker' ? 'customBlue.500' : 'transparent'}
                  color="white"
                  size="lg"
                  fontSize="md"
                  h="50px"
                  _hover={{ 
                    bg: userType === 'seeker' ? 'customBlue.600' : 'whiteAlpha.100',
                    borderColor: userType === 'developer' ? 'cyan.300' : 'transparent'
                  }}
                  isLoading={isRegistering}
                  loadingText="Registering..."
                  transition="all 0.3s ease"
                  borderWidth={1}
                  borderColor={userType === 'developer' ? 'cyan.400' : 'transparent'}
                >
                  Register
                </Button>
              </Stack>
            </form>

            <Stack spacing={6} pt={4}>
              <Divider borderColor="whiteAlpha.200" />
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                borderColor={userType === 'developer' ? 'cyan.400' : 'customBlue.500'}
                color="white"
                leftIcon={<FcGoogle size="24px" />}
                _hover={{ 
                  bg: 'whiteAlpha.100',
                  borderColor: userType === 'developer' ? 'cyan.300' : 'customBlue.400'
                }}
                isLoading={isGoogleRegistering}
                loadingText="Registering with Google..."
                transition="all 0.3s ease"
                size="lg"
                h="50px"
                fontSize="md"
              >
                Continue with Google
              </Button>
            </Stack>

            <Box pt={6} pb={2}>
              <Text color="whiteAlpha.700" textAlign="center" fontSize="sm">
                Already have an account?{' '}
                <Button
                  variant="link"
                  color={userType === 'developer' ? 'cyan.400' : 'customBlue.500'}
                  onClick={() => navigate('/login')}
                  transition="all 0.3s ease"
                  fontSize="sm"
                  fontWeight="medium"
                  textDecoration="underline"
                  _hover={{ 
                    color: userType === 'developer' ? 'cyan.300' : 'customBlue.400',
                    textDecoration: 'underline'
                  }}
                >
                  Login here
                </Button>
              </Text>
            </Box>
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Register; 