import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  Badge,
  useColorModeValue,
  Flex,
  Divider,
  Button
} from '@chakra-ui/react';
import { FaRobot, FaComments, FaShieldAlt, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, isNew, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Box
      p={8}
      bg="whiteAlpha.100"
      borderRadius="xl"
      border="1px solid"
      borderColor="whiteAlpha.200"
      backdropFilter="blur(10px)"
      transform="auto"
      _hover={{ translateY: -2 }}
      transition="all 0.3s"
    >
      <VStack spacing={4} align="flex-start">
        <Flex justify="space-between" w="full" align="center">
          <Icon as={icon} w={10} h={10} color="gold.400" />
          {isNew && (
            <Badge colorScheme="purple" variant="solid">
              New
            </Badge>
          )}
        </Flex>
        <Heading size="md" color="white">
          {title}
        </Heading>
        <Text color="whiteAlpha.800">
          {description}
        </Text>
      </VStack>
    </Box>
  </motion.div>
);

const Quote = ({ text, author, role, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Box
      p={8}
      bg="whiteAlpha.50"
      borderRadius="xl"
      borderLeft="4px solid"
      borderColor="gold.400"
      _hover={{ transform: 'translateY(-2px)' }}
      transition="all 0.3s"
      boxShadow="xl"
    >
      <Text color="whiteAlpha.900" fontSize="xl" fontStyle="italic" mb={4} lineHeight="1.8">
        "{text}"
      </Text>
      <VStack align="start" spacing={1}>
        <Text color="gold.400" fontWeight="bold" fontSize="lg">
          {author}
        </Text>
        <Text color="whiteAlpha.700" fontSize="sm">
          {role}
        </Text>
      </VStack>
    </Box>
  </motion.div>
);

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaRobot,
      title: "AI Assistant",
      description: "Get personalized guidance and support from our advanced AI assistant, available 24/7.",
      isNew: true
    },
    {
      icon: FaComments,
      title: "Chat Room",
      description: "Connect with other freelancers and clients in real-time through our dedicated chat rooms.",
      isNew: true
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payments",
      description: "Enjoy peace of mind with our secure payment protection system.",
      isNew: false
    },
    {
      icon: FaUsers,
      title: "Community Support",
      description: "Join a thriving community of professionals and grow together.",
      isNew: false
    }
  ];

  return (
    <Box
      minH="100vh"
      bg="gray.900"
      pt={32}
      pb={20}
      overflow="hidden"
      position="relative"
    >
      {/* Animated background gradient */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at top right, rgba(255,215,0,0.1), transparent 70%)"
        opacity={0.3}
      />

      <Container maxW="container.xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={20}>
            {/* Header Section */}
            <VStack spacing={6}>
              <Heading
                fontSize={{ base: "4xl", md: "6xl" }}
                bgGradient="linear(to-r, gold.200, gold.400)"
                bgClip="text"
                textAlign="center"
                mb={4}
              >
                Platform Features
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="whiteAlpha.900"
                maxW="2xl"
                textAlign="center"
                lineHeight="1.8"
              >
                Discover powerful tools and features designed to elevate your freelancing journey
              </Text>
            </VStack>

            {/* Features Grid */}
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              spacing={8}
              w="full"
            >
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  delay={index * 0.2}
                />
              ))}
            </SimpleGrid>

            <Divider borderColor="whiteAlpha.200" />

            {/* Quotes Section */}
            <VStack spacing={8} w="full">
              <Quote
                text="As a freelance developer, Freelance Hub has transformed how I work. The AI assistant helps me find the perfect projects, while the secure payment system ensures I get paid on time, every time."
                author="Alex Rodriguez"
                role="Full Stack Developer | $150k+ earned"
                delay={0.8}
              />
              <Quote
                text="The platform's chat feature has been invaluable for client communication. I've built long-term relationships with clients worldwide, and the community support is exceptional."
                author="Emma Thompson"
                role="UI/UX Designer | Top Rated Freelancer"
                delay={1}
              />
              <Quote
                text="From finding high-paying projects to managing my freelance business, Freelance Hub provides all the tools I need. The AI-powered insights have helped me increase my rates by 40%."
                author="David Chen"
                role="Digital Marketing Specialist | 5 Years on Platform"
                delay={1.2}
              />
            </VStack>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <VStack spacing={6}>
                <Button
                  size="lg"
                  bg="gold.400"
                  color="gray.900"
                  _hover={{ bg: "gold.500", transform: 'translateY(-2px)' }}
                  transition="all 0.3s"
                  px={8}
                  py={6}
                  fontSize="xl"
                  onClick={() => navigate('/register')}
                >
                  Start Your Freelance Journey
                </Button>
                <Text color="whiteAlpha.600" fontSize="lg">
                  Join 50,000+ successful freelancers worldwide
                </Text>
              </VStack>
            </motion.div>
          </VStack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Features; 