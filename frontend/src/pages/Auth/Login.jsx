import React, { useState, useEffect } from 'react';
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
  VStack,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../config/firebase';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const MotionBox = motion.create(Box);
const googleProvider = new GoogleAuthProvider();

auth.useDeviceLanguage();

auth.languageCode = 'en';

const Login = () => {
  const [userType, setUserType] = useState('developer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  // Color schemes based on user type
  const getColorScheme = () => {
    return userType === 'developer' ? 'cyan' : 'customBlue';
  };

  const getBgGradient = () => {
    return userType === 'developer'
      ? 'radial(circle at top right, rgba(129,230,217,0.15), transparent 70%)'
      : 'radial(circle at top right, rgba(77,159,255,0.15), transparent 70%)';
  };

  const getButtonBg = () => {
    return userType === 'developer' ? 'cyan.400' : 'customBlue.500';
  };

  const getButtonHoverBg = () => {
    return userType === 'developer' ? 'cyan.500' : 'customBlue.600';
  };

  const getTabSelectedBg = () => {
    return userType === 'developer' ? 'cyan.400' : 'customBlue.500';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user is a seeker and hasn't completed the survey
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      toast({
        title: 'Logged in successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect seekers to survey if not completed
      if (userData?.currentRole === 'seeker' && !userData?.surveyCompleted) {
        navigate('/seeker-survey', { replace: true });
      } else {
        navigate('/welcome', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      let description = 'Unable to login. Please check your credentials.';
      if (error.code === 'auth/user-not-found') description = 'No user found with that email.';
      if (error.code === 'auth/wrong-password') description = 'Incorrect password.';
      toast({ title: 'Login failed', description, status: 'error', duration: 4000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user is a seeker and hasn't completed the survey
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      toast({
        title: 'Logged in with Google',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect seekers to survey if not completed
      if (userData?.currentRole === 'seeker' && !userData?.surveyCompleted) {
        navigate('/seeker-survey', { replace: true });
      } else {
        navigate('/welcome', { replace: true });
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: 'Google login failed',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast({ title: 'Enter your email first', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({
        title: 'Reset link sent',
        description: 'Check your email for password reset instructions.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: 'Reset failed',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setResetLoading(false);
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
            <Tabs
              isFitted
              variant="unstyled"
              onChange={(index) => {
                const newUserType = index === 0 ? 'developer' : 'seeker';
                setUserType(newUserType);
              }}
              size="md"
              value={userType === 'developer' ? 0 : 1}
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

            <Stack spacing={6} textAlign="left" w="full">
              <Text 
                color="whiteAlpha.800" 
                fontSize="lg"
                fontWeight="medium"
                key={`${userType}-text`}
              >
                Access your project workspace
              </Text>
            </Stack>

            <VStack spacing={6} as="form" onSubmit={handleLogin}>
              <FormControl>
                <FormLabel color="white">Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  color="white"
                  _hover={{ borderColor: getButtonBg() }}
                  _focus={{ borderColor: getButtonBg(), boxShadow: `0 0 0 1px ${getButtonBg()}` }}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel color="white">Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    color="white"
                    _hover={{ borderColor: getButtonBg() }}
                    _focus={{ borderColor: getButtonBg(), boxShadow: `0 0 0 1px ${getButtonBg()}` }}
                    required
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      colorScheme={getColorScheme()}
                      onClick={() => setShowPassword(!showPassword)}
                      _hover={{ bg: 'transparent' }}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                w="100%"
                bg={getButtonBg()}
                color="white"
                _hover={{ bg: getButtonHoverBg() }}
                type="submit"
                isLoading={loading}
                loadingText="Signing in..."
              >
                Sign In
              </Button>

              <Button
                variant="link"
                color={userType === 'developer' ? 'cyan.300' : 'customBlue.300'}
                onClick={onOpen}
                _hover={{ textDecoration: 'none', opacity: 0.8 }}
              >
                Forgot Password?
              </Button>

              <Divider borderColor="whiteAlpha.400" />

              <Button
                w="100%"
                variant="outline"
                leftIcon={<FcGoogle />}
                onClick={handleGoogleLogin}
                isLoading={loading}
                loadingText="Signing in with Google..."
                color="white"
                borderColor="whiteAlpha.400"
                _hover={{ bg: 'whiteAlpha.100' }}
              >
                Continue with Google
              </Button>

              <Text color="whiteAlpha.700">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{ color: userType === 'developer' ? '#76E4F7' : '#63B3ED' }}
                >
                  Sign up
                </Link>
              </Text>
            </VStack>
          </Stack>
        </MotionBox>
      </Container>

      {/* Forgot Password Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="dark.800" border="1px solid" borderColor={getButtonBg()}>
          <ModalHeader color="white">Reset Password</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text color="whiteAlpha.800">
                Enter your email address and we'll send you a link to reset your password.
              </Text>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  color="white"
                  _hover={{ borderColor: getButtonBg() }}
                  _focus={{ borderColor: getButtonBg(), boxShadow: `0 0 0 1px ${getButtonBg()}` }}
                />
              </FormControl>
              <Button
                w="100%"
                bg={getButtonBg()}
                color="white"
                _hover={{ bg: getButtonHoverBg() }}
                onClick={handleForgotPassword}
                isLoading={resetLoading}
                loadingText="Sending..."
              >
                Send Reset Link
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Login; 