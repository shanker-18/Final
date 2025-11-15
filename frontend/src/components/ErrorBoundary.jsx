import React, { Component } from 'react';
import { Box, Heading, Text, Button, VStack, Container, Icon } from '@chakra-ui/react';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionContainer = motion.create(Container);

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  const isRouteError = error?.message?.includes('No route matches URL');
  const errorMessage = isRouteError 
    ? "The page you're trying to access doesn't exist or has been moved."
    : "We encountered an unexpected error. Please try again.";

  return (
    <Box
      minH="100vh"
      w="100%"
      bg="dark.900"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={9999}
    >
      <MotionContainer
        maxW="container.xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={8} align="center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Icon 
              as={FaExclamationTriangle} 
              w={16} 
              h={16} 
              color="gold.400"
            />
          </motion.div>
          <Heading
            size="xl"
            bgGradient="linear(to-r, gold.400, gold.600)"
            bgClip="text"
            textAlign="center"
          >
            {isRouteError ? "Page Not Found" : "Oops! Something went wrong"}
          </Heading>
          <Text
            fontSize="lg"
            color="whiteAlpha.800"
            maxW="lg"
            textAlign="center"
          >
            {errorMessage}
          </Text>
          <Box>
            <Button
              leftIcon={<FaHome />}
              colorScheme="gold"
              size="lg"
              onClick={() => navigate('/')}
              mr={4}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
              }}
            >
              Go Home
            </Button>
            {!isRouteError && (
              <Button
                colorScheme="whiteAlpha"
                size="lg"
                onClick={resetErrorBoundary}
                _hover={{
                  transform: "translateY(-2px)",
                }}
              >
                Try Again
              </Button>
            )}
          </Box>
        </VStack>
      </MotionContainer>
    </Box>
  );
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={() => {
            this.setState({ hasError: false, error: null });
          }}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 