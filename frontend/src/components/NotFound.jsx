import React from 'react';
import { Box, Heading, Text, Button, VStack, Container } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion.create(Box);

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.xl" h="100vh" display="flex" alignItems="center" justifyContent="center">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        textAlign="center"
        py={10}
        px={6}
      >
        <VStack spacing={6}>
          <Heading
            as="h1"
            size="4xl"
            bgGradient="linear(to-r, gold.400, gold.600)"
            bgClip="text"
            mb={2}
          >
            404
          </Heading>
          <Heading
            as="h2"
            size="xl"
            color="white"
            mb={2}
          >
            Page Not Found
          </Heading>
          <Text fontSize="lg" color="whiteAlpha.800" maxW="lg">
            Sorry, we couldn't find the page you're looking for. Let's get you back on track.
          </Text>
          <Button
            colorScheme="gold"
            size="lg"
            onClick={() => navigate(-1)}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
            }}
          >
            Go Back
          </Button>
        </VStack>
      </MotionBox>
    </Container>
  );
};

export default NotFound; 