import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Icon,
  HStack,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaRocket, FaUsers, FaLightbulb, FaCode, FaShieldAlt, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion.create(Box);
const MotionContainer = motion.create(Container);
const MotionText = motion.create(Text);

const features = [
  {
    icon: FaRocket,
    title: "Launch Your Career",
    description: "Start your freelancing journey with powerful tools and resources designed for success.",
    color: "blue.400"
  },
  {
    icon: FaUsers,
    title: "Connect & Collaborate",
    description: "Find the perfect clients and build lasting professional relationships.",
    color: "purple.400"
  },
  {
    icon: FaLightbulb,
    title: "Showcase Your Skills",
    description: "Create an impressive portfolio that highlights your expertise and achievements.",
    color: "yellow.400"
  },
  {
    icon: FaCode,
    title: "Professional Growth",
    description: "Access resources and opportunities to enhance your skills and expand your expertise.",
    color: "green.400"
  },
  {
    icon: FaShieldAlt,
    title: "Secure Platform",
    description: "Work with confidence on our secure and reliable platform.",
    color: "red.400"
  },
  {
    icon: FaGlobe,
    title: "Global Opportunities",
    description: "Connect with clients worldwide and expand your business globally.",
    color: "cyan.400"
  }
];

const LearnMore = () => {
  const navigate = useNavigate();
  const [featuresData] = useState(features);
  const [loading] = useState(false);

  const handleStartJourney = () => {
    navigate('/projects');
  };

  return (
    <Box
      minH="100vh"
      bg="dark.900"
      pt={20}
      pb={20}
      overflow="hidden"
      position="relative"
    >
      {/* Animated background particles */}
      {[...Array(30)].map((_, i) => (
        <MotionBox
          key={i}
          position="absolute"
          width={i % 3 === 0 ? "4px" : "2px"}
          height={i % 3 === 0 ? "4px" : "2px"}
          borderRadius="full"
          bg={i % 3 === 0 ? "gold.400" : "gold.200"}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0.2
          }}
          animate={{
            y: ["-20vh", "120vh"],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      <MotionContainer
        maxW="container.xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <VStack spacing={16}>
          {/* Back Button with hover effect */}
          <HStack w="full" justify="space-between">
            <MotionBox
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                icon={<FaArrowLeft />}
                onClick={() => navigate('/')}
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                size="lg"
              />
            </MotionBox>
          </HStack>

          {/* Hero Section with enhanced animations */}
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            textAlign="center"
            w="full"
          >
            <MotionBox
              animate={{
                textShadow: [
                  "0 0 20px rgba(255,215,0,0.5)",
                  "0 0 10px rgba(255,215,0,0.2)",
                  "0 0 20px rgba(255,215,0,0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heading
                fontSize={["4xl", "5xl", "6xl"]}
                bgGradient="linear(to-r, gold.200, gold.400, gold.200)"
                bgClip="text"
                mb={6}
              >
                Welcome to the Future of Freelancing
              </Heading>
            </MotionBox>
            <MotionText
              fontSize={["xl", "2xl"]}
              color="whiteAlpha.900"
              maxW="3xl"
              mx="auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Discover a platform designed to empower freelancers and connect them with amazing opportunities worldwide.
            </MotionText>
          </MotionBox>

          {/* Features Grid with staggered animations */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {loading ? (
              <Box w="full" textAlign="center" py={10}>
                <Text color="white">Loading features...</Text>
              </Box>
            ) : featuresData.map((feature, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  p={8}
                  bg="whiteAlpha.100"
                  borderRadius="xl"
                  borderLeft="4px solid"
                  borderColor={feature.color}
                  transition="all 0.3s"
                  _hover={{
                    bg: "whiteAlpha.200",
                    transform: "translateY(-5px)",
                    boxShadow: `0 4px 20px ${feature.color}33`
                  }}
                >
                  <MotionBox
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <Icon
                      as={feature.icon}
                      boxSize={10}
                      color={feature.color}
                      mb={4}
                    />
                  </MotionBox>
                  <Heading
                    size="md"
                    color="white"
                    mb={4}
                  >
                    {feature.title}
                  </Heading>
                  <Text
                    color="whiteAlpha.900"
                    fontSize="lg"
                  >
                    {feature.description}
                  </Text>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>

          {/* Call to Action with enhanced animation */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            textAlign="center"
            mt={12}
          >
            <MotionBox
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                colorScheme="gold"
                px={12}
                py={7}
                fontSize="xl"
                onClick={handleStartJourney}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 0 30px rgba(255, 215, 0, 0.3)",
                }}
              >
                Start Your Journey
              </Button>
            </MotionBox>
          </MotionBox>
        </VStack>
      </MotionContainer>
    </Box>
  );
};

export default LearnMore;