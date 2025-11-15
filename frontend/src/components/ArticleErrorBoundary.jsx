import React, { Component } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.900" py={20}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Button
            leftIcon={<Icon as={FaArrowLeft} />}
            variant="ghost"
            color="white"
            onClick={() => navigate(-1)}
            w="fit-content"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            Back
          </Button>

          <VStack spacing={6} align="center" py={12}>
            <Icon as={FaExclamationTriangle} w={12} h={12} color="red.400" />
            <Heading color="white" textAlign="center">
              Oops! Something went wrong
            </Heading>
            <Text color="gray.400" textAlign="center" maxW="600px">
              We encountered an error while loading this article. This might be due to missing or invalid content.
            </Text>
            <Text color="red.400" fontSize="sm" maxW="600px" fontFamily="monospace">
              Error: {error.message}
            </Text>
            <Button
              colorScheme="gold"
              onClick={resetErrorBoundary}
              mt={4}
            >
              Try Again
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

class ArticleErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Article Error:', error, errorInfo);
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

export default ArticleErrorBoundary; 