import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Flex,
  Heading,
  useColorModeValue,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Spinner,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser, FaComments } from 'react-icons/fa';

const MotionBox = motion.create(Box);

const RAG_API_BASE_URL =
  import.meta.env.VITE_RAG_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:5001' : '');

// Message component to display chat messages
const Message = ({ message, isUser }) => {
  const bgColor = isUser 
    ? useColorModeValue('gold.500', 'gold.400') 
    : useColorModeValue('whiteAlpha.200', 'whiteAlpha.200');
  
  const textColor = isUser 
    ? useColorModeValue('white', 'white') 
    : useColorModeValue('white', 'white');
  
  const alignSelf = isUser ? 'flex-end' : 'flex-start';
  const icon = isUser ? FaUser : FaRobot;
  
  // Process markdown-like formatting for code
  const processText = (text) => {
    // Replace code blocks with styled pre/code elements
    let processedText = text.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre style="background-color: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; overflow-x: auto; margin: 10px 0;"><code>${code}</code></pre>`;
    });
    
    // Replace inline code with styled code elements
    processedText = processedText.replace(/`([^`]+)`/g, '<code style="background-color: rgba(0,0,0,0.2); padding: 2px 4px; border-radius: 3px;">$1</code>');
    
    return processedText;
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      alignSelf={alignSelf}
      maxW="80%"
      mb={2}
    >
      <HStack alignItems="flex-start" spacing={2}>
        {!isUser && (
          <Box 
            bg="gold.500" 
            p={2} 
            borderRadius="full"
            color="white"
            fontSize="sm"
          >
            <Box as={icon} />
          </Box>
        )}
        <Box
          bg={bgColor}
          p={3}
          borderRadius="lg"
          borderBottomLeftRadius={isUser ? 'lg' : '0'}
          borderBottomRightRadius={isUser ? '0' : 'lg'}
          color={textColor}
          boxShadow="md"
        >
          <div dangerouslySetInnerHTML={{ __html: processText(message) }} />
        </Box>
        {isUser && (
          <Box 
            bg="gold.500" 
            p={2} 
            borderRadius="full"
            color="white"
            fontSize="sm"
          >
            <Box as={icon} />
          </Box>
        )}
      </HStack>
    </MotionBox>
  );
};

// Typing indicator component
const TypingIndicator = () => (
  <MotionBox
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    alignSelf="flex-start"
    mb={2}
  >
    <HStack alignItems="flex-start" spacing={2}>
      <Box 
        bg="gold.500" 
        p={2} 
        borderRadius="full"
        color="white"
        fontSize="sm"
      >
        <Box as={FaRobot} />
      </Box>
      <Box
        bg={useColorModeValue('whiteAlpha.200', 'whiteAlpha.200')}
        p={3}
        borderRadius="lg"
        borderBottomLeftRadius="0"
        color="white"
        boxShadow="md"
      >
        <HStack spacing={1}>
          <Box 
            h="8px" 
            w="8px" 
            borderRadius="full" 
            bg="white" 
            animation="typing 1s infinite"
            sx={{
              '@keyframes typing': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-5px)' }
              }
            }}
          />
          <Box 
            h="8px" 
            w="8px" 
            borderRadius="full" 
            bg="white" 
            animation="typing 1s infinite 0.2s"
            sx={{
              '@keyframes typing': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-5px)' }
              }
            }}
          />
          <Box 
            h="8px" 
            w="8px" 
            borderRadius="full" 
            bg="white" 
            animation="typing 1s infinite 0.4s"
            sx={{
              '@keyframes typing': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-5px)' }
              }
            }}
          />
        </HStack>
      </Box>
    </HStack>
  </MotionBox>
);

const LangChainChat = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant powered by LangChain and Ollama. How can I help you today?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botStatus, setBotStatus] = useState('checking');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Generate a random user ID
  const userId = useRef('user_' + Math.random().toString(36).substring(2, 15));

  // Check bot status on component mount
  useEffect(() => {
    checkBotStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkBotStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  const checkBotStatus = () => {
    if (!RAG_API_BASE_URL) {
      setBotStatus('offline');
      return;
    }

    fetch(`${RAG_API_BASE_URL}/chat/status`)
      .then(response => response.json())
      .then(data => {
        setBotStatus(data.status === 'online' ? 'online' : 'offline');
      })
      .catch(error => {
        console.error('Error checking bot status:', error);
        setBotStatus('offline');
      });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    
    // Clear input
    setInputValue('');
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      if (!RAG_API_BASE_URL) {
        throw new Error('RAG chat API is not configured.');
      }

      const response = await fetch(`${RAG_API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          user_id: userId.current
        }),
      });
      
      const data = await response.json();
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add bot response
      if (data.response) {
        setMessages(prev => [...prev, { text: data.response, isUser: false }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { text: `Sorry, I encountered an error: ${data.error}`, isUser: false }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add error message
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't connect to the server. Please try again later.", 
        isUser: false 
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <IconButton
        icon={<FaComments />}
        colorScheme="gold"
        borderRadius="full"
        position="fixed"
        bottom="20px"
        right="20px"
        size="lg"
        boxShadow="lg"
        onClick={onOpen}
        zIndex={999}
      />
      
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent bg={useColorModeValue('gray.900', 'gray.900')}>
          <DrawerCloseButton color="white" />
          <DrawerHeader borderBottomWidth="1px" color="white">
            <HStack>
              <FaRobot />
              <Text>LangChain Assistant</Text>
              <Badge 
                colorScheme={botStatus === 'online' ? 'green' : 'red'} 
                ml={2}
              >
                {botStatus === 'checking' ? (
                  <Spinner size="xs" />
                ) : botStatus === 'online' ? 'Online' : 'Offline'}
              </Badge>
            </HStack>
          </DrawerHeader>

          <DrawerBody p={0}>
            <Flex direction="column" h="100%">
              <VStack 
                flex="1" 
                overflowY="auto" 
                spacing={4} 
                p={4} 
                align="stretch"
              >
                {messages.map((message, index) => (
                  <Message 
                    key={index} 
                    message={message.text} 
                    isUser={message.isUser} 
                  />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </VStack>
              
              <Box p={4} borderTopWidth="1px">
                <form onSubmit={handleSubmit}>
                  <HStack>
                    <Input
                      ref={inputRef}
                      placeholder="Type your message..."
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      bg="whiteAlpha.100"
                      color="white"
                      _placeholder={{ color: 'whiteAlpha.500' }}
                      disabled={isTyping || botStatus !== 'online'}
                    />
                    <IconButton
                      icon={<FaPaperPlane />}
                      colorScheme="gold"
                      type="submit"
                      disabled={isTyping || !inputValue.trim() || botStatus !== 'online'}
                    />
                  </HStack>
                </form>
              </Box>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default LangChainChat; 