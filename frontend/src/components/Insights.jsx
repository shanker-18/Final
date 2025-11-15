import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  VStack,
  HStack,
  Icon,
  Tag,
  useColorModeValue,
  Image,
  Flex,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaBookReader, FaClock, FaArrowRight, FaUser } from 'react-icons/fa';
import { keyframes } from '@emotion/react';

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionHeading = motion.create(Heading);
const MotionText = motion.create(Text);

// Blast animation for page entry
const pageVariants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  exit: {
    scale: 1.2,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

// Add these animation variants at the top
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const ArticleCard = ({ article, index }) => {
  const navigate = useNavigate();
  
  const handleLearnMore = (e) => {
    e.preventDefault();
    navigate(`/article/${article.id}`);
  };

  return (
    <MotionBox
      variants={cardVariants}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLearnMore}
      position="relative"
      overflow="hidden"
      borderRadius="xl"
      bg="whiteAlpha.50"
      transition="all 0.3s"
      cursor="pointer"
    >
      <Box p={6}>
        <VStack align="stretch" spacing={4}>
          <Image 
            src={article.imageUrl} 
            alt={article.title}
            borderRadius="lg"
            objectFit="cover"
            h="200px"
            w="100%"
          />
          <VStack align="stretch" spacing={2}>
            <Heading size="md" color="white">
              {article.title}
            </Heading>
            <Text color="whiteAlpha.800" noOfLines={2}>
              {article.excerpt}
            </Text>
          </VStack>
          <HStack spacing={4} color="whiteAlpha.700">
            <HStack>
              <Icon as={FaUser} />
              <Text fontSize="sm">{article.author}</Text>
            </HStack>
            <HStack>
              <Icon as={FaClock} />
              <Text fontSize="sm">{article.readTime} min read</Text>
            </HStack>
          </HStack>
          <Tag size="sm" colorScheme="gold" alignSelf="flex-start">
            {article.category}
          </Tag>
        </VStack>
      </Box>
    </MotionBox>
  );
};

const Insights = () => {
  const articles = [
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

  return (
    <AnimatePresence>
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <Box minH="100vh" bg="gray.900" pt={28}>
          <Container maxW="container.xl">
            <VStack spacing={16} align="stretch">
              <MotionHeading
                fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                bgGradient="linear(to-r, gold.200, gold.400)"
                bgClip="text"
                textAlign="center"
                variants={{
                  initial: { opacity: 0, y: -20 },
                  animate: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut"
                    }
                  }
                }}
                initial="initial"
                animate="animate"
                _hover={{
                  transform: "scale(1.02)",
                  textShadow: "0 0 8px rgba(255,215,0,0.6)"
                }}
              >
                Latest Insights
              </MotionHeading>

              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(2, 1fr)"
                }}
                gap={8}
              >
                {articles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} />
                ))}
              </Grid>
            </VStack>
          </Container>
        </Box>
      </MotionBox>
    </AnimatePresence>
  );
};

export default Insights;