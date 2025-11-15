import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Icon,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { TimeIcon, SearchIcon } from '@chakra-ui/icons';

const MotionBox = motion.create(Box);

const RecentActivity = () => {
  const searchHistory = []; // This would be fetched from your backend

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
            <Icon as={TimeIcon} />
            Recent Activity
          </Heading>

          {searchHistory.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {searchHistory.map((activity) => (
                <Box
                  key={activity.id}
                  p={4}
                  bg="whiteAlpha.100"
                  borderRadius="lg"
                  _hover={{ bg: "whiteAlpha.200" }}
                  transition="all 0.2s"
                >
                  <HStack justify="space-between">
                    <HStack spacing={3}>
                      <Icon as={SearchIcon} color="gold.400" />
                      <VStack align="start" spacing={1}>
                        <Text color="white">{activity.text}</Text>
                        <Text color="whiteAlpha.600" fontSize="sm">
                          {activity.timestamp}
                        </Text>
                      </VStack>
                    </HStack>
                    <Badge colorScheme="gold" variant="solid">
                      Search
                    </Badge>
                  </HStack>
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
                as={TimeIcon} 
                w={12} 
                h={12} 
                color="whiteAlpha.400" 
                mb={4} 
              />
              <Text 
                color="white" 
                fontSize="xl"
              >
                No recent activity
              </Text>
              <Text 
                color="whiteAlpha.600" 
                mt={2}
              >
                Your search history and activities will appear here
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </MotionBox>
  );
};

export default RecentActivity; 