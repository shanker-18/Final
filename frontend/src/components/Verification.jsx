import React from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion.create(Box);

const Verification = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/'); // Navigate to the main page
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      minH="100vh"
      bg="gray.900"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      textAlign="center"
      p={5}
    >
      <VStack spacing={4}>
        <Heading color="white">Email Verified!</Heading>
        <Text color="whiteAlpha.700">
          Your email has been successfully verified. You can now access all features of the application.
        </Text>
        <Button colorScheme="gold" onClick={handleStart}>
          Start Using the App
        </Button>
      </VStack>
    </MotionBox>
  );
};

export default Verification; 