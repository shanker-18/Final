import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { BellIcon } from '@chakra-ui/icons';

const MotionBox = motion.create(Box);

const Notifications = () => {
  const notifications = []; // This would be fetched from your backend

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      minH="100vh"
      bg="gray.900"
      pt={28}
      pb={10}
    >
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <Heading
            color="white"
            display="flex"
            alignItems="center"
            gap={3}
          >
            <Icon as={BellIcon} />
            Notifications
          </Heading>

          {notifications.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {notifications.map((notification) => (
                <Box
                  key={notification.id}
                  p={4}
                  bg="whiteAlpha.100"
                  borderRadius="lg"
                >
                  <Text color="white">{notification.message}</Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <Box
              p={8}
              bg="whiteAlpha.100"
              borderRadius="xl"
              textAlign="center"
            >
              <Icon 
                as={BellIcon} 
                w={12} 
                h={12} 
                color="whiteAlpha.400" 
                mb={4} 
              />
              <Text 
                color="white" 
                fontSize="xl"
              >
                No notifications yet
              </Text>
              <Text 
                color="whiteAlpha.600" 
                mt={2}
              >
                We'll notify you when something important happens
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </MotionBox>
  );
};

export default Notifications; 