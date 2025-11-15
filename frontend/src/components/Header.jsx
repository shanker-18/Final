import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInsightsClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If on home page, scroll to insights section
      const insightsSection = document.getElementById('insights-section');
      if (insightsSection) {
        const headerOffset = 100;
        const elementPosition = insightsSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // If on another page, navigate to home and then scroll
      navigate('/', { state: { scrollToInsights: true } });
    }
    onClose(); // Close mobile menu if open
  };

  return (
    <Box
      as="header"
      position="fixed"
      w="100%"
      zIndex={1000}
      bg={isScrolled ? 'rgba(0, 0, 0, 0.8)' : 'transparent'}
      backdropFilter={isScrolled ? 'blur(10px)' : 'none'}
      transition="all 0.3s"
    >
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        maxW="container.xl"
        mx="auto"
        px={4}
      >
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
          variant="ghost"
          color="white"
        />
        <HStack spacing={8} alignItems="center">
          <Box cursor="pointer" onClick={() => navigate('/')}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgGradient="linear(to-r, gold.200, gold.400)"
              bgClip="text"
            >
              Marvas
            </Text>
          </Box>
          <HStack
            as="nav"
            spacing={4}
            display={{ base: 'none', md: 'flex' }}
          >
            <Button
              variant="ghost"
              color="white"
              onClick={() => navigate('/')}
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              color="white"
              onClick={handleInsightsClick}
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Insights
            </Button>
            <Button
              variant="ghost"
              color="white"
              onClick={() => navigate('/projects')}
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Projects
            </Button>
          </HStack>
        </HStack>

        <Flex alignItems="center">
          <Button
            variant="solid"
            colorScheme="gold"
            size="sm"
            mr={4}
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }} bg="gray.900">
          <Stack as="nav" spacing={4}>
            <Button
              w="full"
              variant="ghost"
              color="white"
              onClick={() => {
                navigate('/');
                onClose();
              }}
            >
              Home
            </Button>
            <Button
              w="full"
              variant="ghost"
              color="white"
              onClick={(e) => {
                handleInsightsClick(e);
                onClose();
              }}
            >
              Insights
            </Button>
            <Button
              w="full"
              variant="ghost"
              color="white"
              onClick={() => {
                navigate('/projects');
                onClose();
              }}
            >
              Projects
            </Button>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Header; 