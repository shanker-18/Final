import React from 'react';
import { Box } from '@chakra-ui/react';
import ChatBot from '../components/ChatBot';

const ChatAssistant = () => {
  return (
    <Box
      minH="100vh"
      bg="gray.900"
      pt="80px" // Account for navbar
    >
      <ChatBot isFullPage={true} />
    </Box>
  );
};

export default ChatAssistant; 