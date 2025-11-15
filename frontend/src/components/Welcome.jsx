import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  useToast,
  Spinner,
  Center,
  HStack,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import { FaRocket, FaCode, FaSearch, FaUserAstronaut, FaFilm } from 'react-icons/fa';
import UserMenu from '../components/UserMenu';

const MotionBox = motion.create(Box);
const MotionHeading = motion.create(Heading);
const MotionText = motion.create(Text);
const MotionVStack = motion.create(VStack);
const MotionFlex = motion.create(Flex);

// Create a motion component for the icon that properly handles refs
const MotionIconWrapper = motion.create(Box);

// Floating animation for particles
const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Pulse animation for the main container
const pulseAnimation = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Glow animation for text
const glowAnimation = {
  initial: { textShadow: "0 0 0px rgba(255,215,0,0)" },
  animate: {
    textShadow: [
      "0 0 20px rgba(255,215,0,0.5)",
      "0 0 10px rgba(255,215,0,0.2)",
      "0 0 20px rgba(255,215,0,0.5)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const Welcome = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // Auth disabled: set a simple guest user
    setUser({ name: 'Guest', currentRole: 'seeker' });
  }, []);

  const handleContinue = () => {
    if (!user) return;

    // Both developers and seekers should go to /projects
    // The Projects component will handle showing the appropriate view
    setLoading(true);
    setTimeout(() => {
      navigate('/projects', { replace: true });
    }, 500);
  };

  if (loading) {
    return (
      <AnimatedBackground>
        <Center minH="100vh">
          <MotionBox
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Spinner size="xl" color="gold.400" thickness="4px" />
          </MotionBox>
        </Center>
      </AnimatedBackground>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <AnimatedBackground key="welcome-page">
        <UserMenu user={user} />
        <Box pt={28} pb={20} minH="100vh" position="relative" overflow="hidden">
          {/* Animated particles */}
          {[...Array(20)].map((_, i) => (
            <MotionBox
              key={i}
              position="absolute"
              width="4px"
              height="4px"
              borderRadius="full"
              bg="gold.400"
              initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          <Container maxW="container.lg">
            <MotionVStack
              spacing={12}
              initial="initial"
              animate="animate"
              exit="initial"
              variants={pulseAnimation}
            >
              <MotionIconWrapper
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon
                  as={FaUserAstronaut}
                  w={20}
                  h={20}
                  color="gold.400"
                />
              </MotionIconWrapper>

              <MotionHeading
                fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
                bgGradient="linear(to-r, gold.200, gold.400, gold.200)"
                bgClip="text"
                textAlign="center"
                variants={glowAnimation}
              >
                Welcome{user?.name ? `, ${user.name}!` : '!'}
              </MotionHeading>

              <MotionText
                color="whiteAlpha.900"
                fontSize={{ base: "xl", md: "2xl" }}
                textAlign="center"
                maxW="2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                {user?.currentRole === 'developer' 
                  ? "Ready to showcase your amazing projects to potential clients?"
                  : "Ready to discover amazing projects and talented developers?"}
              </MotionText>

              <HStack spacing={8} justify="center">
                <MotionBox
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Button
                    size="lg"
                    colorScheme="gold"
                    onClick={handleContinue}
                    leftIcon={user?.currentRole === 'developer' ? <FaCode /> : <FaSearch />}
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: '0 0 30px rgba(255,215,0,0.4)'
                    }}
                    _active={{
                      transform: 'scale(0.95)'
                    }}
                    transition="all 0.3s"
                    px={8}
                    py={7}
                    fontSize="xl"
                  >
                    {user?.currentRole === 'developer' 
                      ? 'Go to My Projects'
                      : 'Browse Projects'}
                  </Button>
                </MotionBox>

                <MotionBox
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    colorScheme="whiteAlpha"
                    leftIcon={<FaRocket />}
                    onClick={() => navigate('/insights')}
                    _hover={{
                      transform: 'scale(1.05)',
                      boxShadow: '0 0 30px rgba(255,255,255,0.2)',
                      bg: 'whiteAlpha.100'
                    }}
                    _active={{
                      transform: 'scale(0.95)'
                    }}
                    transition="all 0.3s"
                    px={8}
                    py={7}
                    fontSize="xl"
                  >
                    Insights
                  </Button>
                </MotionBox>
              </HStack>
              
              <MotionBox
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <Button
                  size="lg"
                  variant="solid"
                  colorScheme="purple"
                  leftIcon={<FaFilm />}
                  onClick={() => navigate('/dev-reels')}
                  _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 30px rgba(128,90,213,0.4)'
                  }}
                  _active={{
                    transform: 'scale(0.95)'
                  }}
                  transition="all 0.3s"
                  px={8}
                  py={7}
                  fontSize="xl"
                >
                  Watch DevReels
                </Button>
              </MotionBox>
            </MotionVStack>
          </Container>
        </Box>
      </AnimatedBackground>
    </AnimatePresence>
  );
};

export default Welcome;
