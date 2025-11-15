import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  VStack,
  HStack,
  Text,
  Input,
  Avatar,
  Tooltip,
  Spinner,
  Flex,
  Badge,
  useDisclosure,
  Collapse,
  Divider,
  Button,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  CloseButton,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { SmallCloseIcon, SearchIcon } from '@chakra-ui/icons';
import { FaRobot, FaPaperPlane, FaCode, FaGithub, FaReact, FaNodeJs, FaDatabase, FaTimes, FaExpand } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';

const MotionBox = motion(Box);
const MotionFlex = motion.create(Flex);

// Message component for chat
const Message = React.memo(({ message, isUser }) => (
  <MotionBox
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    alignSelf={isUser ? "flex-end" : "flex-start"}
    maxW="85%"
    mb={2}
  >
    <HStack alignItems="start" spacing={2}>
      {!isUser && (
        <Avatar
          size="sm"
          icon={<FaRobot />}
          bg="gold.400"
          color="gray.900"
        />
      )}
      <Box
        bg={isUser ? "gold.400" : "whiteAlpha.200"}
        color={isUser ? "gray.900" : "white"}
        p={3}
        borderRadius="lg"
        borderTopLeftRadius={!isUser ? "0" : "lg"}
        borderTopRightRadius={isUser ? "0" : "lg"}
        boxShadow="sm"
      >
        <Text fontSize="sm">{message.text}</Text>
        
        {/* Project suggestion display */}
        {message.projects && message.projects.length > 0 && (
          <VStack align="start" mt={2} spacing={2}>
            <Text fontSize="xs" fontWeight="bold" color={isUser ? "gray.800" : "gold.200"}>
              Suggested Projects:
            </Text>
            {message.projects.map((project, idx) => (
              <Box
                key={idx}
                p={2}
                bg={isUser ? "whiteAlpha.300" : "blackAlpha.300"}
                borderRadius="md"
                w="100%"
              >
                <Text fontSize="xs" fontWeight="bold">{project.title}</Text>
                <Text fontSize="xs" noOfLines={2}>{project.description}</Text>
                <Wrap mt={1} spacing={1}>
                  {project.technologies && project.technologies.map((tech, techIdx) => (
                    <WrapItem key={techIdx}>
                      <Tag size="sm" colorScheme="gold" variant="subtle">
                        <TagLabel fontSize="2xs">{tech}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
                <Button
                  size="xs"
                  mt={2}
                  colorScheme="gold"
                  onClick={() => {
                    window.location.href = `/project/${project.id}`;
                  }}
                >
                  View Project →
                </Button>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
      {isUser && (
        <Avatar
          size="sm"
          bg="gray.600"
        />
      )}
    </HStack>
  </MotionBox>
));

// Typing indicator
const TypingIndicator = () => (
  <HStack spacing={2} alignItems="center" p={2}>
    <Avatar
      size="sm"
      icon={<FaRobot />}
      bg="gold.400"
      color="gray.900"
    />
    <Box bg="whiteAlpha.200" px={4} py={2} borderRadius="lg" borderTopLeftRadius="0">
      <HStack spacing={1}>
        <MotionBox
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
          h="8px" w="8px" borderRadius="full" bg="gold.400"
        />
        <MotionBox
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
          h="8px" w="8px" borderRadius="full" bg="gold.400"
        />
        <MotionBox
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
          h="8px" w="8px" borderRadius="full" bg="gold.400"
        />
      </HStack>
    </Box>
  </HStack>
);

// Project suggestion component
const ProjectSuggestion = ({ project, onSelect }) => (
  <MotionBox
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    p={3}
    bg="whiteAlpha.100"
    borderRadius="md"
    cursor="pointer"
    onClick={() => onSelect(project)}
    mb={2}
  >
    <HStack>
      <Box>
        <Text fontWeight="bold" fontSize="sm">{project.title}</Text>
        <Text fontSize="xs" color="whiteAlpha.700" noOfLines={1}>{project.description}</Text>
      </Box>
    </HStack>
  </MotionBox>
);

const ChatBot = ({ isFullPage = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hi there! 👋 I'm your FreelanceHub AI assistant. I can help you with:\n\n• Finding projects based on your skills\n• Answering questions about the platform\n• Providing project recommendations\n• Explaining features and how to use them\n\nWhat would you like to know?", 
      isUser: false 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen || isFullPage) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isFullPage]);

  // Send a message either from the current state or an explicit text
  // (when called from key handlers to avoid losing the last character).
  const handleSend = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    const userMessage = { id: Date.now(), text, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const chatApiUrl = API_BASE_URL ? `${API_BASE_URL}/api/chat` : '';

      if (!chatApiUrl) {
        throw new Error('Chat API is not configured.');
      }

      const response = await fetch(chatApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message: text 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get response');
      }
      
      setTimeout(() => {
        setIsTyping(false);
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          isUser: false
        };
        
        // Add projects if available
        if (data.projects && data.projects.length > 0) {
          botMessage.projects = data.projects;
        }
        
        setMessages(prev => [...prev, botMessage]);
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      let errorMessage;
      if (error.message === 'Failed to fetch') {
        errorMessage = "Sorry, I'm having trouble connecting to the server. Please make sure the backend is running on port 5000.";
      } else {
        errorMessage = "Sorry, I'm having trouble processing your request. Please try again.";
      }
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: errorMessage,
        isUser: false
      }]);

      toast({
        title: 'Connection Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Use a plain render function (not a nested component) so React doesn't
  // treat this as a brand-new component type on every parent re-render.
  // This prevents the chatbot from unmounting/remounting (and losing focus)
  // every time the input state changes.
  const renderChatContent = () => (
    <VStack h="full" spacing={4}>
      <Box
        flex={1}
        w="full"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 215, 0, 0.5)',
            borderRadius: '24px',
          },
        }}
      >
        <VStack spacing={4} p={4} align="stretch">
          <AnimatePresence>
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isUser={message.isUser}
              />
            ))}
          </AnimatePresence>
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Wrap input + button in a small form so only Enter or the button
          can trigger sending. Typing alone does nothing. */}
      <Box as="form" w="full" p={4} spacing={2} onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
        <HStack w="full" spacing={2}>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about FreelanceHub..."
            bg="whiteAlpha.100"
            color="white"
            _placeholder={{ color: 'whiteAlpha.500' }}
            _focus={{
              borderColor: 'gold.400',
              boxShadow: '0 0 0 1px gold.400',
            }}
            size="md"
            autoComplete="off"
            spellCheck="false"
            type="text"
            px={4}
            py={2}
            minH="44px"
          />
          <Button
            colorScheme="gold"
            type="submit"
            isLoading={isTyping}
            disabled={!input.trim()}
            aria-label="Send message"
            h="44px"
            w="44px"
            p={0}
          >
            <FaPaperPlane />
          </Button>
        </HStack>
      </Box>
    </VStack>
  );

  if (isFullPage) {
    return (
      <Box
        h="calc(100vh - 80px)"
        maxW="1200px"
        mx="auto"
        p={4}
      >
        <VStack h="full" spacing={4}>
          <HStack w="full" justify="space-between" p={4}>
            <HStack spacing={3}>
              <Avatar size="sm" icon={<FaRobot />} bg="gold.400" />
              <Text color="white" fontSize="xl">FreelanceHub Assistant</Text>
            </HStack>
          </HStack>
          <Box
            flex={1}
            w="full"
            bg="gray.900"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="xl"
          >
            {renderChatContent()}
          </Box>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <MotionBox
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            position="fixed"
            bottom={24}
            right={6}
            w="350px"
            h="500px"
            bg="gray.900"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
            zIndex={9999}
          >
            <VStack h="full" spacing={0}>
              <HStack
                w="full"
                justify="space-between"
                p={4}
                borderBottom="1px solid"
                borderColor="whiteAlpha.200"
              >
                <HStack spacing={3}>
                  <Avatar size="sm" icon={<FaRobot />} bg="gold.400" />
                  <Text color="white">FreelanceHub Assistant</Text>
                </HStack>
                <HStack spacing={2}>
                  <IconButton
                    icon={<FaExpand />}
                    variant="ghost"
                    color="white"
                    size="sm"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/chat-assistant');
                    }}
                  />
                  <IconButton
                    icon={<FaTimes />}
                    variant="ghost"
                    color="white"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  />
                </HStack>
              </HStack>
              <Box flex={1} w="full" overflow="hidden">
                {renderChatContent()}
              </Box>
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>

      <IconButton
        icon={<FaRobot />}
        aria-label="Open Chat"
        position="fixed"
        bottom={6}
        right={6}
        size="lg"
        colorScheme="gold"
        onClick={() => setIsOpen(!isOpen)}
        boxShadow="0 0 20px rgba(255, 215, 0, 0.3)"
        zIndex={9999}
        _hover={{
          transform: 'scale(1.1)',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.4)',
        }}
      />
    </>
  );
};

export default ChatBot;