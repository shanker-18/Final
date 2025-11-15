import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  Button,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion.create(Box);

const ArticleTemplate = ({ article }) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  return (
    <Box bg={bgColor} minH="100vh" py={20}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Button
            leftIcon={<Icon as={FaArrowLeft} />}
            variant="ghost"
            alignSelf="flex-start"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading
              size="2xl"
              color={textColor}
              mb={6}
            >
              {article.title}
            </Heading>

            <HStack spacing={6} mb={8}>
              <HStack>
                <Icon as={FaUser} />
                <Text>{article.author}</Text>
              </HStack>
              <HStack>
                <Icon as={FaClock} />
                <Text>{article.readTime} min read</Text>
              </HStack>
            </HStack>

            <Image
              src={article.image}
              alt={article.title}
              w="full"
              h="400px"
              objectFit="cover"
              borderRadius="xl"
              mb={8}
            />

            <VStack spacing={6} align="stretch">
              {article.content.map((section, index) => (
                <Box key={index}>
                  {section.heading && (
                    <Heading size="lg" mb={4}>
                      {section.heading}
                    </Heading>
                  )}
                  <Text fontSize="lg" lineHeight="tall">
                    {section.text}
                  </Text>
                </Box>
              ))}
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default ArticleTemplate; 