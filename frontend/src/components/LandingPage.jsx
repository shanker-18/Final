import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Grid,
  Flex,
  Link as ChakraLink,
  IconButton,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Image,
} from '@chakra-ui/react';
import { keyframes, Global } from '@emotion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
// External auth removed
import { useToast } from '@chakra-ui/react';
import { FaRocket, FaUsers, FaLightbulb, FaCode, FaRobot, FaBrain, FaEnvelope, FaPhone, FaMapMarker, FaArrowRight, FaClock, FaUser } from 'react-icons/fa';
import Insights from './Insights';

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

const colorCycle = keyframes`
  0% { color: rgba(255, 215, 0, 0.12); }
  50% { color: rgba(255, 180, 0, 0.12); }
  100% { color: rgba(255, 215, 0, 0.12); }
`;

const floatingParticles = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
`;

const rippleEffect = keyframes`
  0% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.5); opacity: 0.2; }
  100% { transform: scale(2); opacity: 0; }
`;

const darkWave = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
`;

const FeatureCard = ({ title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 + 1.5 }}
    whileHover={{ scale: 1.05, y: -10 }}
  >
    <Box
      p={8}
      borderRadius="xl"
      bg="rgba(255, 255, 255, 0.03)"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      transition="all 0.3s"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 'xl',
        padding: '2px',
        background: 'linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
      }}
    >
      <Heading
        size="md"
        mb={4}
        color="neon.gold"
        textShadow="0 0 10px #FFD700"
      >
        {title}
      </Heading>
      <Text color="neon.white">{description}</Text>
    </Box>
  </motion.div>
);

const WelcomeAnimation = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.97)',
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          transition: {
            duration: 1,
            ease: "easeOut"
          }
        }}
        exit={{ 
          scale: 1.1, 
          opacity: 0,
          transition: {
            duration: 0.8,
            ease: "easeInOut"
          }
        }}
      >
        <Text
          fontSize={["5xl", "7xl", "8xl"]}
          fontWeight="bold"
          bgGradient="linear(to-r, gold.200, gold.400, gold.200)"
          bgClip="text"
          textAlign="center"
          sx={{
            textShadow: '0 0 40px rgba(255, 215, 0, 0.4)'
          }}
        >
          Welcome to Hub
        </Text>
      </motion.div>
    </motion.div>
  );
};

const hasSeenWelcome = false;

const CustomFonts = () => (
  <Global
    styles={`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Orbitron:wght@700&display=swap');
    `}
  />
);

const AnimatedParticles = () => (
  <Box
    position="absolute"
    top={0}
    left={0}
    right={0}
    bottom={0}
    overflow="hidden"
    pointerEvents="none"
    zIndex={0}
  >
    {[...Array(20)].map((_, i) => (
      <Box
        key={i}
        position="absolute"
        top={`${Math.random() * 100}%`}
        left={`${Math.random() * 100}%`}
        width={`${Math.random() * 2 + 1}px`}
        height={`${Math.random() * 2 + 1}px`}
        bg="gold.400"
        borderRadius="full"
        sx={{
          animation: `${floatingParticles} ${Math.random() * 3 + 2}s infinite ease-in-out`,
          opacity: Math.random() * 0.3 + 0.1,
        }}
      />
    ))}
  </Box>
);

const MotionDiv = motion.create('div');
const MotionBox = motion.create(Box);
const MotionText = motion.create(Text);

const BlurRevealText = ({ text, delay = 0 }) => {
  const words = text.split(' ');
  
  return (
    <HStack spacing={1} flexWrap="wrap" justify="center">
      {words.map((word, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ 
            duration: 1,
            delay: delay + (index * 0.1),
            ease: "easeOut"
          }}
        >
          <Text
            display="inline-block"
            color="whiteAlpha.900"
            fontSize={["lg", "xl", "2xl"]}
            fontFamily="Space Grotesk"
            textShadow="0 0 10px rgba(255,255,255,0.2)"
          >
            {word}&nbsp;
          </Text>
        </motion.div>
      ))}
    </HStack>
  );
};

const features = [
    {
      icon: FaRobot,
      title: "AI & ML Innovation",
      description: "Discover advanced AI solutions and automation for your business transformation needs."
    },
    {
      icon: FaCode,
      title: "Full-Stack Development",
      description: "Explore modern web technologies and frameworks to build robust applications."
    },
    {
      icon: FaBrain,
      title: "Tech Insights",
      description: "Stay updated with the latest advancements in AI and software development."
    }
  ];

  const insights = [
    {
      id: 'future-remote-work',
      title: "The Future of Remote Work in Freelancing",
      description: "Explore how remote work is reshaping the freelance landscape, emerging technologies, and strategies for success in the digital workspace.",
      category: "Remote Work",
      readTime: 10,
      author: "Sarah Johnson",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
    },
    {
      id: 'competitive-rates',
      title: "Setting Competitive Rates as a Freelancer",
      description: "Learn effective pricing strategies, market analysis, and value-based pricing to optimize your freelance income while staying competitive.",
      category: "Business",
      readTime: 8,
      author: "Michael Chen",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3"
    },
    {
      id: 'client-communication',
      title: "Mastering Client Communication",
      description: "Discover proven techniques for effective client communication, building long-term relationships, and handling difficult conversations professionally.",
      category: "Skills",
      readTime: 12,
      author: "Emma Thompson",
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3"
    },
    {
      id: 'freelance-tools',
      title: "Essential Tools for Modern Freelancers",
      description: "A comprehensive guide to the must-have tools and software that can streamline your freelance workflow and boost productivity.",
      category: "Technology",
      readTime: 15,
      author: "Alex Rodriguez",
      imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3"
    }
];

const aboutMarvas = {
  title: "About Marvas AI",
  description: "We are a cutting-edge   company specializing in AI solutions and full-stack development. Our mission is to transform businesses through innovative technology solutions.",
  features: [
    "🔹 AI & ML Innovation – Discover advanced AI solutions and automation.",
    "🔹 Full-Stack Development – Explore modern web technologies and frameworks.",
    "🔹 Tech Insights – Stay updated with the latest advancements in AI and software."
  ]
};

const helpTopics = [
  {
    title: "Getting Started",
    description: "Learn how to begin your journey with Marvas AI."
  },
  {
    title: "Services",
    description: "Explore our comprehensive range of tech solutions."
  },
  {
    title: "Support",
    description: "Get assistance from our dedicated support team."
  }
];

const BackgroundText = () => (
  <Box
    position="fixed"
    top={0}
    left={0}
    width="100vw"
    height="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    pointerEvents="none"
    zIndex={0}
    overflow="hidden"
  >
    <Text
      fontSize={["80px", "120px", "180px", "220px"]}
      fontFamily="Orbitron"
      fontWeight="black"
      color="whiteAlpha.100"
      opacity={0.1}
      textAlign="center"
      whiteSpace="nowrap"
      letterSpacing="tight"
      sx={{
        userSelect: "none",
        transform: "scale(1.2)",
      }}
    >
      FREELANCE HUB
    </Text>
  </Box>
);

const AnimatedBackground = () => (
  <Box
    position="fixed"
    top={0}
    left={0}
    right={0}
    bottom={0}
    zIndex={0}
    overflow="hidden"
  >
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="linear-gradient(45deg, rgba(0,0,0,0.97) 0%, rgba(20,20,20,0.95) 100%)"
    />
    {[...Array(20)].map((_, i) => (
      <Box
        key={i}
        position="absolute"
        top={`${Math.random() * 100}%`}
        left={`${Math.random() * 100}%`}
        width={`${Math.random() * 300 + 50}px`}
        height={`${Math.random() * 300 + 50}px`}
        borderRadius="full"
        bg="radial-gradient(circle, rgba(255,215,0,0.03) 0%, transparent 70%)"
        sx={{
          animation: `${darkWave} ${Math.random() * 10 + 10}s infinite ease-in-out`,
          animationDelay: `${Math.random() * -10}s`,
        }}
      />
    ))}
  </Box>
);

const ExpertiseSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const expertiseItems = [
    {
      icon: FaCode,
      title: "Full-Stack Development",
      description: "Expert developers ready to bring your ideas to life with cutting-edge technology and modern frameworks.",
      gradient: "linear(to-r, gold.200, gold.400)",
      bgImage: "url('/dev-pattern.svg')"
    },
    {
      icon: FaRocket,
      title: "AI & Innovation",
      description: "Innovative AI solutions that push boundaries and create exceptional user experiences.",
      gradient: "linear(to-r, gold.200, gold.400)",
      bgImage: "url('/ai-pattern.svg')"
    },
    {
      icon: FaUsers,
      title: "Team Collaboration",
      description: "Seamless collaboration between freelancers and clients for successful project delivery.",
      gradient: "linear(to-r, gold.200, gold.400)",
      bgImage: "url('/team-pattern.svg')"
    },
    {
      icon: FaLightbulb,
      title: "Creative Solutions",
      description: "Creative approaches to solve complex challenges and deliver outstanding results.",
      gradient: "linear(to-r, gold.200, gold.400)",
      bgImage: "url('/creative-pattern.svg')"
    }
  ];

  return (
    <Box py={20} position="relative" mb={20} id="expertise-section">
      {/* Animated Background Elements */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at 50% 50%, rgba(255,215,0,0.08) 0%, transparent 70%)"
        pointerEvents="none"
      >
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            as={motion.div}
            position="absolute"
            width={`${Math.random() * 4 + 2}px`}
            height={`${Math.random() * 4 + 2}px`}
            borderRadius="full"
            bg="gold.400"
            left={`${Math.random() * 100}%`}
            top={`${Math.random() * 100}%`}
            initial={{ opacity: 0.2 }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </Box>

      <Container maxW="container.xl" position="relative">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3
              }
            }
          }}
        >
          <VStack spacing={16}>
            <Box textAlign="center" position="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Heading
                  fontSize={["4xl", "5xl", "6xl"]}
                  bgGradient="linear(to-r, gold.200, gold.400)"
                  bgClip="text"
                  mb={4}
                  position="relative"
                  _after={{
                    content: '""',
                    position: "absolute",
                    bottom: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100px",
                    height: "4px",
                    bgGradient: "linear(to-r, gold.200, gold.400)",
                    borderRadius: "full"
                  }}
                >
                  Our Expertise
                </Heading>
                <Text
                  color="whiteAlpha.900"
                  fontSize={["lg", "xl"]}
                  maxW="2xl"
                  mx="auto"
                  mt={8}
                >
                  Discover our comprehensive range of services tailored to meet your project needs
                </Text>
              </motion.div>
            </Box>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={10}
              w="full"
            >
              {expertiseItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut"
                      }
                    }
                  }}
                >
                  <Box
                    as={motion.div}
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ duration: 0.3 }}
                    position="relative"
                    role="group"
                  >
                    <Box
                      p={8}
                      bg="whiteAlpha.50"
                      borderRadius="xl"
                      position="relative"
                      overflow="hidden"
                      minH="350px"
                      border="1px solid"
                      borderColor="whiteAlpha.100"
                      transition="all 0.3s"
                      _before={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgGradient: item.gradient,
                        opacity: 0,
                        transition: "opacity 0.3s"
                      }}
                      _after={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: item.bgImage,
                        backgroundSize: "cover",
                        opacity: 0.05,
                        transition: "opacity 0.3s"
                      }}
                      _hover={{
                        _before: { opacity: 0.1 },
                        _after: { opacity: 0.1 },
                        transform: "translateY(-8px)",
                        boxShadow: "xl"
                      }}
                    >
                      <VStack
                        spacing={6}
                        position="relative"
                        zIndex={1}
                      >
                        <Box
                          as={motion.div}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.8 }}
                        >
                          <Icon
                            as={item.icon}
                            boxSize={16}
                            color="transparent"
                            bgGradient={item.gradient}
                            bgClip="text"
                            filter="drop-shadow(0 0 8px rgba(255,255,255,0.3))"
                          />
                        </Box>
                        
                        <Heading
                          size="lg"
                          color="white"
                          textAlign="center"
                          bgGradient={item.gradient}
                          bgClip="text"
                          transition="all 0.3s"
                          _groupHover={{
                            transform: "scale(1.05)",
                            filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))"
                          }}
                        >
                          {item.title}
                        </Heading>

                        <Text
                          color="whiteAlpha.900"
                          textAlign="center"
                          fontSize="md"
                          lineHeight="tall"
                        >
                          {item.description}
                        </Text>
                      </VStack>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>
          </VStack>
        </motion.div>
      </Container>
    </Box>
  );
};

const HelpSection = ({ handleGetStarted }) => (
  <Box py={20} position="relative">
    <Container maxW="container.xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.3
            }
          }
        }}
      >
        <VStack spacing={12} align="center">
          <Heading
            fontSize={["3xl", "4xl", "5xl"]}
            bgGradient="linear(to-r, gold.200, gold.400)"
            bgClip="text"
            textAlign="center"
          >
            How Can We Help?
          </Heading>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={8}
            w="full"
          >
            {helpTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: index * 0.2 }
                  }
                }}
              >
                <VStack
                  p={8}
                  bg="whiteAlpha.100"
                  borderRadius="xl"
                  spacing={4}
                  align="center"
                  cursor="pointer"
                  transition="all 0.3s"
                  _hover={{
                    transform: "translateY(-8px)",
                    bg: "whiteAlpha.200"
                  }}
                >
                  <Heading size="md" color="white">{topic.title}</Heading>
                  <Text color="whiteAlpha.800" textAlign="center">
                    {topic.description}
                  </Text>
                </VStack>
              </motion.div>
            ))}
          </SimpleGrid>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              size="lg"
              colorScheme="gold"
              px={8}
              fontSize="lg"
              fontWeight="bold"
              onClick={handleGetStarted}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 0 30px rgba(255, 215, 0, 0.3)",
              }}
            >
              Get Started
            </Button>
          </motion.div>
        </VStack>
      </motion.div>
    </Container>
  </Box>
);

const ContactSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <VStack spacing={16} w="full">
      <Heading
        fontSize={["3xl", "4xl", "5xl"]}
        bgGradient="linear(to-r, gold.200, gold.400)"
        bgClip="text"
        textAlign="center"
        position="relative"
        _after={{
          content: '""',
          display: 'block',
          width: '100px',
          height: '4px',
          bgGradient: 'linear(to-r, gold.200, gold.400)',
          margin: '20px auto 0',
          borderRadius: 'full'
        }}
      >
        Contact Us
      </Heading>
      <SimpleGrid columns={[1, null, 2]} spacing={10} w="full" maxW="4xl" mx="auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <VStack
            p={10}
            bg="whiteAlpha.50"
            borderRadius="xl"
            spacing={6}
            _hover={{ 
              bg: "whiteAlpha.100", 
              transform: "translateY(-5px)",
              boxShadow: "0 8px 30px rgba(255, 215, 0, 0.1)"
            }}
            transition="all 0.3s"
          >
            <Icon 
              as={FaEnvelope} 
              boxSize={10} 
              color="gold.400"
              transition="all 0.3s"
              _groupHover={{ transform: 'scale(1.1) rotate(5deg)' }}
            />
            <Text color="white" fontWeight="bold" fontSize="lg">Email</Text>
            <Text color="whiteAlpha.900">contact@freelancehub.com</Text>
          </VStack>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <VStack
            p={10}
            bg="whiteAlpha.50"
            borderRadius="xl"
            spacing={6}
            _hover={{ 
              bg: "whiteAlpha.100", 
              transform: "translateY(-5px)",
              boxShadow: "0 8px 30px rgba(255, 215, 0, 0.1)"
            }}
            transition="all 0.3s"
          >
            <Icon 
              as={FaMapMarker} 
              boxSize={10} 
              color="gold.400"
              transition="all 0.3s"
              _groupHover={{ transform: 'scale(1.1) rotate(5deg)' }}
            />
            <Text color="white" fontWeight="bold" fontSize="lg">Location</Text>
            <Text color="whiteAlpha.900">Chennai, Tamil Nadu, India</Text>
          </VStack>
        </motion.div>
      </SimpleGrid>
    </VStack>
  </motion.div>
);

const Navigation = () => (
  <HStack 
    position="fixed" 
    top={0} 
    left={0} 
    right={0} 
    zIndex={10}
    justify="space-between"
    px={8}
    py={4}
    bg="rgba(0,0,0,0.8)"
    backdropFilter="blur(10px)"
    borderBottom="1px solid"
    borderColor="whiteAlpha.100"
    transition="all 0.3s"
    _hover={{
      bg: "rgba(0,0,0,0.9)",
      borderColor: "whiteAlpha.200"
    }}
  >
    <HStack spacing={4}>
      <Image
        src="/logo.svg"
        alt="Freelance Hub Logo"
        h="40px"
        objectFit="contain"
      />
      <Text
        fontSize="2xl"
        fontWeight="bold"
        bgGradient="linear(to-r, gold.200, gold.400)"
        bgClip="text"
      >
        Freelance Hub
      </Text>
    </HStack>
    <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
      <NavLink href="#expertise-section">Services</NavLink>
      <NavLink href="#insights-section">Insights</NavLink>
      <NavLink href="#about-section">About</NavLink>
      <NavLink href="#contact-section">Contact</NavLink>
      <Button
        variant="outline"
        borderColor="gold.400"
        color="gold.400"
        _hover={{
          bg: "whiteAlpha.100",
          transform: "translateY(-2px)"
        }}
        onClick={() => navigate('/login')}
      >
        Sign In
      </Button>
    </HStack>
    <IconButton
      display={{ base: 'flex', md: 'none' }}
      aria-label="Open menu"
      icon={<HamburgerIcon />}
      variant="ghost"
      color="white"
      _hover={{ bg: "whiteAlpha.200" }}
    />
  </HStack>
);

const NavLink = ({ href, children }) => (
  <ChakraLink
    href={href}
    color="whiteAlpha.900"
    fontWeight="medium"
    transition="all 0.3s"
    _hover={{
      color: "gold.400",
      transform: "translateY(-2px)"
    }}
  >
    {children}
  </ChakraLink>
);

const HeroSection = ({ opacity, handleLearnMore, handleExploreProjects }) => (
  <motion.div style={{ opacity }}>
    <VStack spacing={12} textAlign="center" minH="100vh" justify="center" pt={20}>
      <Box maxW="4xl" mx="auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Heading
            fontSize={["4xl", "5xl", "7xl"]}
            fontWeight="bold"
            bgGradient="linear(to-r, gold.200, gold.400, gold.200)"
            bgClip="text"
            mb={6}
            textShadow="0 0 40px rgba(255, 215, 0, 0.3)"
            letterSpacing="tight"
            lineHeight="shorter"
          >
            Welcome to <br />
            Freelance Hub
          </Heading>
        </motion.div>

        <BlurRevealText
          text="Where talented freelancers showcase their innovative projects and connect with visionary clients seeking expertise."
          delay={0.5}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Text
            fontSize={["lg", "xl", "2xl"]}
            color="whiteAlpha.900"
            mt={8}
            maxW="3xl"
            mx="auto"
            lineHeight="tall"
            fontWeight="medium"
          >
            Join our thriving community where exceptional freelancers demonstrate their skills through 
            portfolio projects, and businesses discover the perfect talent to bring their visions to life.
          </Text>
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <Stack
          direction={["column", "row"]}
          spacing={6}
          pt={8}
        >
          <Button
            size="lg"
            bg="gold.400"
            color="gray.900"
            px={12}
            py={7}
            fontSize="xl"
            fontWeight="bold"
            _hover={{
              bg: "gold.500",
              transform: "translateY(-2px)",
              boxShadow: "0 0 30px rgba(255, 215, 0, 0.3)",
            }}
            onClick={handleLearnMore}
            rightIcon={<Icon as={FaArrowRight} />}
          >
            Learn More
          </Button>
          <Button
            size="lg"
            variant="outline"
            borderColor="gold.400"
            borderWidth={2}
            color="gold.400"
            px={12}
            py={7}
            fontSize="xl"
            fontWeight="bold"
            _hover={{
              bg: "whiteAlpha.100",
              transform: "translateY(-2px)",
              boxShadow: "0 0 30px rgba(255, 215, 0, 0.15)",
            }}
            onClick={handleExploreProjects}
            rightIcon={<Icon as={FaRocket} />}
          >
            Explore Projects
          </Button>
        </Stack>
      </motion.div>

      <Box position="absolute" bottom={10} left="50%" transform="translateX(-50%)">
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Icon
            as={FaArrowRight}
            transform="rotate(90deg)"
            color="gold.400"
            boxSize={8}
            cursor="pointer"
            onClick={() => {
              const expertiseSection = document.getElementById('expertise-section');
              if (expertiseSection) {
                expertiseSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        </motion.div>
      </Box>
    </VStack>
  </motion.div>
);

const InsightsSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const handleLearnMore = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  return (
    <Box
      id="insights-section"
      as="section"
      py={20}
      position="relative"
      overflow="hidden"
      scrollMarginTop="100px"
    >
      {/* Animated background elements */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at 50% 50%, rgba(255,215,0,0.08) 0%, transparent 70%)"
        pointerEvents="none"
      >
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            as={motion.div}
            position="absolute"
            width={`${Math.random() * 4 + 2}px`}
            height={`${Math.random() * 4 + 2}px`}
            borderRadius="full"
            bg="gold.400"
            left={`${Math.random() * 100}%`}
            top={`${Math.random() * 100}%`}
            initial={{ opacity: 0.2 }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </Box>

      <Container maxW="container.xl">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3
              }
            }
          }}
        >
          <VStack spacing={16}>
            <Box textAlign="center" position="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Heading
                  fontSize={["4xl", "5xl", "6xl"]}
                  bgGradient="linear(to-r, gold.200, gold.400)"
                  bgClip="text"
                  mb={4}
                  position="relative"
                  _after={{
                    content: '""',
                    position: "absolute",
                    bottom: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100px",
                    height: "4px",
                    bgGradient: "linear(to-r, gold.200, gold.400)",
                    borderRadius: "full"
                  }}
                >
                  Latest Insights
                </Heading>
                <Text
                  color="whiteAlpha.900"
                  fontSize={["lg", "xl"]}
                  maxW="2xl"
                  mx="auto"
                  mt={8}
                >
                  Stay updated with the latest trends and innovations in technology
                </Text>
              </motion.div>
            </Box>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={10}
              w="full"
            >
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut"
                      }
                    }
                  }}
                >
                  <Box
                    p={8}
                    bg="whiteAlpha.50"
                    borderRadius="xl"
                    position="relative"
                    overflow="hidden"
                    minH="400px"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    transition="all 0.3s"
                    _before={{
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgGradient: "linear(to-br, whiteAlpha.50, transparent)",
                      opacity: 0,
                      transition: "opacity 0.3s"
                    }}
                    _hover={{
                      transform: "translateY(-8px)",
                      bg: "whiteAlpha.100",
                      _before: {
                        opacity: 0.1
                      }
                    }}
                  >
                    <VStack spacing={6} align="start" height="100%">
                      <Box
                        position="relative"
                        w="full"
                        h="200px"
                        borderRadius="lg"
                        overflow="hidden"
                        mb={4}
                      >
                        <Image
                          src={insight.imageUrl}
                          alt={insight.title}
                          objectFit="cover"
                          w="full"
                          h="full"
                          transition="transform 0.3s"
                          _groupHover={{
                            transform: "scale(1.05)"
                          }}
                        />
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          bottom={0}
                          bg="blackAlpha.600"
                          transition="opacity 0.3s"
                          _groupHover={{
                            opacity: 0.7
                          }}
                        />
                      </Box>
                      <Heading
                        size="md"
                        color="white"
                        bgGradient="linear(to-r, gold.200, gold.400)"
                        bgClip="text"
                      >
                        {insight.title}
                      </Heading>
                      <Text color="whiteAlpha.900" noOfLines={3}>
                        {insight.description}
                      </Text>
                      <HStack spacing={4} mt="auto" w="full">
                        <HStack spacing={2}>
                          <Icon as={FaClock} color="gold.400" />
                          <Text color="whiteAlpha.700" fontSize="sm">
                            {insight.readTime} min read
                          </Text>
                        </HStack>
                        <HStack spacing={2}>
                          <Icon as={FaUser} color="gold.400" />
                          <Text color="whiteAlpha.700" fontSize="sm">
                            {insight.author}
                          </Text>
                        </HStack>
                      </HStack>
                      <Button
                        variant="ghost"
                        color="gold.400"
                        rightIcon={<Icon as={FaArrowRight} />}
                        _hover={{
                          bg: "whiteAlpha.100",
                          transform: "translateX(4px)"
                        }}
                        onClick={() => handleLearnMore(insight.id)}
                        alignSelf="flex-start"
                        transition="all 0.3s"
                      >
                        Learn More
                      </Button>
                    </VStack>
                  </Box>
                </motion.div>
              ))}
            </SimpleGrid>
          </VStack>
        </motion.div>
      </Container>
    </Box>
  );
};

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      as="section"
      py={20}
      position="relative"
      overflow="hidden"
    >
      {/* Animated background elements */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at 50% 50%, rgba(255,215,0,0.08) 0%, transparent 70%)"
        pointerEvents="none"
      />

      <Container maxW="container.xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <VStack spacing={16}>
            <Box textAlign="center" position="relative">
              <Heading
                fontSize={["4xl", "5xl", "6xl"]}
                bgGradient="linear(to-r, gold.200, gold.400)"
                bgClip="text"
                mb={4}
                position="relative"
                _after={{
                  content: '""',
                  position: "absolute",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100px",
                  height: "4px",
                  bgGradient: "linear(to-r, gold.200, gold.400)",
                  borderRadius: "full"
                }}
              >
                {aboutMarvas.title}
              </Heading>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={16} w="full">
              <Box>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <VStack align="start" spacing={8}>
                    <Text
                      fontSize="xl"
                      color="whiteAlpha.900"
                      lineHeight="tall"
                    >
                      {aboutMarvas.description}
                    </Text>
                    <Button
                      size="lg"
                      bgGradient="linear(to-r, gold.400, gold.500)"
                      color="gray.900"
                      _hover={{
                        bgGradient: "linear(to-r, gold.500, gold.600)",
                        transform: "translateY(-2px)"
                      }}
                      rightIcon={<Icon as={FaArrowRight} />}
                      onClick={() => navigate('/learn-more')}
                    >
                      Learn More About Us
                    </Button>
                  </VStack>
                </motion.div>
              </Box>

              <Box>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <VStack
                    spacing={6}
                    align="start"
                    bg="whiteAlpha.50"
                    borderRadius="xl"
                    p={8}
                    position="relative"
                    overflow="hidden"
                    _before={{
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgGradient: "linear(to-br, whiteAlpha.100, transparent)",
                      opacity: 0.5
                    }}
                  >
                    {aboutMarvas.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        style={{ width: "100%" }}
                      >
                        <HStack
                          w="full"
                          p={4}
                          bg="whiteAlpha.50"
                          borderRadius="lg"
                          transition="all 0.3s"
                          _hover={{
                            bg: "whiteAlpha.100",
                            transform: "translateX(8px)"
                          }}
                        >
                          <Box
                            color="gold.400"
                            fontSize="xl"
                            mr={4}
                          >
                            {feature.split('–')[0]}
                          </Box>
                          <Text color="whiteAlpha.900">
                            {feature.split('–')[1]}
                          </Text>
                        </HStack>
                      </motion.div>
                    ))}
                  </VStack>
                </motion.div>
              </Box>
            </SimpleGrid>
          </VStack>
        </motion.div>
      </Container>
    </Box>
  );
};

const LandingPage = () => {
  const [showWelcome, setShowWelcome] = useState(!hasSeenWelcome);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const scrollToInsights = () => {
    const insightsSection = document.getElementById('insights-section');
    if (insightsSection) {
      const headerOffset = 100; // Height of your fixed header plus some padding
      const elementPosition = insightsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Check if we should scroll to insights section
    if (location.state?.scrollToInsights) {
      // Add a slight delay to ensure the page is fully loaded
      setTimeout(scrollToInsights, 500);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleGetStarted = () => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to continue',
        status: 'info',
        duration: 3000,
        isClosable: true
      });
      navigate('/login');
    } else {
      navigate('/projects');
    }
  };

  const handleLearnMore = () => {
    navigate('/learn-more');
  };

  const handleExploreProjects = () => {
    navigate('/projects');
  };

  const handleServicesClick = () => {
    const expertiseSection = document.getElementById('expertise-section');
    if (expertiseSection) {
      expertiseSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSupportClick = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <CustomFonts />
      <AnimatePresence>
        {showWelcome && <WelcomeAnimation onComplete={() => setShowWelcome(false)} />}
      </AnimatePresence>

      <Box
        minH="100vh"
        bg="black"
        position="relative"
        overflow="hidden"
      >
        <AnimatedBackground />
        <BackgroundText />
        <AnimatedParticles />

        <Navigation />

        <Container 
          maxW="container.xl" 
          position="relative" 
          zIndex={1}
          px={{ base: 4, md: 6 }}
          mx="auto"
        >
          <VStack spacing={32}>
            <Box w="full">
              <HeroSection 
                opacity={opacity} 
                handleLearnMore={handleLearnMore}
                handleExploreProjects={handleExploreProjects}
              />
            </Box>

            <Box id="expertise-section">
              <ExpertiseSection />
            </Box>

            <Box id="insights-section">
              <InsightsSection />
            </Box>

            <Box id="about-section">
              <AboutSection />
            </Box>

            <Box id="help-section">
              <HelpSection handleGetStarted={handleGetStarted} />
            </Box>

            <Box id="contact-section">
              <ContactSection />
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;