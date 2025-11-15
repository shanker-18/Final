import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Heading, Text, Stack, Grid, Icon, Button, Flex } from '@chakra-ui/react';
import { CheckIcon, StarIcon, LockIcon, AtSignIcon } from '@chakra-ui/icons';
import { keyframes } from '@emotion/react';

// Enhanced animations
const float = keyframes`
  0% { transform: translateY(0px) }
  50% { transform: translateY(-20px) }
  100% { transform: translateY(0px) }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const glowPulse = keyframes`
  0% { 
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.2),
                 0 0 60px rgba(255, 215, 0, 0.2);
    -webkit-text-stroke: 2px rgba(255, 215, 0, 0.5);
  }
  50% { 
    text-shadow: 0 0 50px rgba(255, 215, 0, 0.4),
                 0 0 80px rgba(255, 215, 0, 0.3);
    -webkit-text-stroke: 2px rgba(255, 215, 0, 0.7);
  }
  100% { 
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.2),
                 0 0 60px rgba(255, 215, 0, 0.2);
    -webkit-text-stroke: 2px rgba(255, 215, 0, 0.5);
  }
`;

const AboutHub = () => {
  return (
    <Box 
      minH="100vh" 
      bg="dark.900"
      position="relative"
      overflow="hidden"
      pt={{ base: "72px", md: "96px" }}
    >
      {/* Dynamic Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.4}
        background="linear-gradient(45deg, rgba(255,215,0,0.03) 0%, rgba(0,0,0,0) 70%), 
                    linear-gradient(135deg, rgba(138,43,226,0.03) 10%, rgba(0,0,0,0) 80%),
                    linear-gradient(225deg, rgba(0,255,255,0.03) 10%, rgba(0,0,0,0) 80%)"
      />

      {/* Floating Elements Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        overflow="hidden"
        pointerEvents="none"
      >
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            position="absolute"
            top={`${Math.random() * 100}%`}
            left={`${Math.random() * 100}%`}
            width={`${Math.random() * 3 + 1}px`}
            height={`${Math.random() * 3 + 1}px`}
            bg="gold.400"
            borderRadius="full"
            sx={{
              animation: `${float} ${Math.random() * 3 + 2}s infinite ease-in-out`,
              opacity: Math.random() * 0.5 + 0.2,
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
            }}
          />
        ))}
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" position="relative">
        <Stack spacing={20}>
          {/* Enhanced Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <Stack spacing={10} align="center" textAlign="center">
              <Box 
                position="relative"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: '-50px',
                  left: '-50px',
                  right: '-50px',
                  bottom: '-50px',
                  background: 'radial-gradient(circle at center, rgba(255,215,0,0.1) 0%, transparent 70%)',
                  animation: `${glowPulse} 4s infinite ease-in-out`,
                  borderRadius: 'full',
                  zIndex: -1
                }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                    rotate: [0, 1, 0] 
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heading
                    fontSize={{ base: "6xl", md: "8xl", lg: "9xl" }}
                    fontWeight="900"
                    bgGradient="linear(to-r, gold.200, gold.400, gold.200)"
                    bgClip="text"
                    letterSpacing="tight"
                    mb={6}
                    sx={{
                      textShadow: '0 0 40px rgba(255, 215, 0, 0.4)',
                    }}
                  >
                    Freelance Hub
                  </Heading>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <Text
                    fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                    color="whiteAlpha.900"
                    maxW="800px"
                    lineHeight="1.6"
                    bgGradient="linear(to-r, whiteAlpha.700, whiteAlpha.900, whiteAlpha.700)"
                    bgClip="text"
                  >
                    Where Innovation Meets Talent
                  </Text>
                </motion.div>
              </Box>
            </Stack>
          </motion.div>

          {/* Interactive Features Section */}
          <Grid
            templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
            gap={10}
            py={20}
          >
            {[
              {
                title: "For Freelancers",
                icon: StarIcon,
                description: "Access premium projects and build your career",
                color: "purple.400"
              },
              {
                title: "For Clients",
                icon: CheckIcon,
                description: "Find top talent for your projects",
                color: "cyan.400"
              },
              {
                title: "Secure Platform",
                icon: LockIcon,
                description: "Safe and reliable project management",
                color: "green.400"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * idx }}
                whileHover={{ scale: 1.05 }}
              >
                <EnhancedFeatureCard {...feature} />
              </motion.div>
            ))}
          </Grid>

          {/* Process Flow */}
          <Box py={20}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Heading
                textAlign="center"
                fontSize="5xl"
                bgGradient="linear(to-r, gold.200, gold.400)"
                bgClip="text"
                mb={16}
              >
                How It Works
              </Heading>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                gap={8}
              >
                {[
                  { step: "01", title: "Sign Up", icon: AtSignIcon },
                  { step: "02", title: "Create Profile", icon: StarIcon },
                  { step: "03", title: "Connect", icon: CheckIcon },
                  { step: "04", title: "Succeed", icon: LockIcon }
                ].map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 * idx }}
                  >
                    <ProcessStep {...step} />
                  </motion.div>
                ))}
              </Grid>
            </motion.div>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

const EnhancedFeatureCard = ({ title, icon, description, color }) => (
  <Box
    bg="rgba(255, 255, 255, 0.03)"
    backdropFilter="blur(10px)"
    borderRadius="2xl"
    p={8}
    position="relative"
    overflow="hidden"
    transition="all 0.3s"
    _before={{
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '2xl',
      padding: '2px',
      background: `linear-gradient(45deg, transparent, ${color}, transparent)`,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
    }}
    _hover={{
      transform: 'translateY(-5px)',
      boxShadow: `0 0 30px ${color}33`,
    }}
  >
    <Stack spacing={6}>
      <Icon as={icon} boxSize={10} color={color} />
      <Heading size="lg" color="white">
        {title}
      </Heading>
      <Text color="whiteAlpha.800" fontSize="lg">
        {description}
      </Text>
    </Stack>
  </Box>
);

const ProcessStep = ({ step, title, icon }) => (
  <Stack
    align="center"
    spacing={6}
    p={8}
    position="relative"
    _hover={{
      transform: 'translateY(-5px)',
    }}
    transition="all 0.3s"
  >
    <Box
      position="relative"
      w={20}
      h={20}
      borderRadius="full"
      bg="rgba(255, 215, 0, 0.1)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      _before={{
        content: '""',
        position: 'absolute',
        top: '-5px',
        left: '-5px',
        right: '-5px',
        bottom: '-5px',
        borderRadius: 'full',
        background: 'linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
        animation: `${shimmer} 2s infinite linear`
      }}
    >
      <Icon as={icon} boxSize={8} color="gold.400" />
    </Box>
    <Text
      fontSize="4xl"
      fontWeight="bold"
      bgGradient="linear(to-r, gold.200, gold.400)"
      bgClip="text"
    >
      {step}
    </Text>
    <Text color="whiteAlpha.900" fontSize="xl" fontWeight="semibold">
      {title}
    </Text>
  </Stack>
);

export default AboutHub; 