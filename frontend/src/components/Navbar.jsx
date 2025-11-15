import React, { useState, useEffect, useRef } from 'react';
import { Box, Flex, Button, Link as ChakraLink, IconButton, Stack, useDisclosure, Container, HStack, Menu, MenuButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, VStack, Text } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@chakra-ui/react';
import { FaUser, FaPlus, FaList } from 'react-icons/fa';
import NavbarProjectMenu from './NavbarProjectMenu';
import { useUser } from '../contexts/UserContext';
import { getUserRole } from '../utils/userRole';

const MotionFlex = motion.create(Flex);

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const { userData } = useUser();
  const menuRef = useRef();

  const role = getUserRole(userData);
  const isDeveloper = role === 'developer';

  // Close the developer projects dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // We cannot call setIsOpen here because it belongs to ProjectsButton;
        // the dropdown component itself will handle its own outside clicks.
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ProjectsButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    if (isDeveloper) {
      return (
        <Box position="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="lg"
            px={{ md: 6, lg: 8 }}
            fontSize={{ base: "lg", md: "xl" }}
            height={{ md: "48px", lg: "56px" }}
            onClick={() => setIsOpen(!isOpen)}
            _hover={{
              bg: "whiteAlpha.100"
            }}
          >
            Projects
          </Button>
          {isOpen && (
            <Box
              position="absolute"
              top="100%"
              right="0"
              bg="gray.800"
              borderRadius="md"
              boxShadow="lg"
              p={2}
              minW="200px"
              zIndex={1000}
            >
              <Stack spacing={2}>
                <Button
                  variant="ghost"
                  leftIcon={<FaPlus />}
                  justifyContent="flex-start"
                  w="100%"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/add-project');
                  }}
                  _hover={{ bg: "whiteAlpha.100" }}
                >
                  Add Project
                </Button>
                <Button
                  variant="ghost"
                  leftIcon={<FaList />}
                  justifyContent="flex-start"
                  w="100%"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/projects');
                  }}
                  _hover={{ bg: "whiteAlpha.100" }}
                >
                  View Projects
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      );
    }

    // For non-developers or non-logged-in users
    return (
      <Button
        as={Link}
        to="/projects"
        variant="ghost"
        size="lg"
        px={{ md: 6, lg: 8 }}
        fontSize={{ base: "lg", md: "xl" }}
        height={{ md: "48px", lg: "56px" }}
        _hover={{
          bg: "whiteAlpha.100"
        }}
      >
        Projects
      </Button>
    );
  };

  return (
    <Box
      position="fixed"
      w="100%"
      zIndex="1000"
      bg="rgba(17, 24, 39, 0.9)"
      backdropFilter="blur(12px)"
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
      transition="all 0.3s"
    >
      <Flex
        h={{ base: '20', md: '24' }}
        alignItems="center"
        justifyContent="space-between"
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChakraLink
            as={Link}
            to="/"
            fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
            fontWeight="bold"
            bgGradient="linear(to-r, gold.200, gold.400)"
            bgClip="text"
            _hover={{
              bgGradient: "linear(to-r, gold.300, gold.500)"
            }}
          >
            Freelance Hub
          </ChakraLink>
        </motion.div>

        {/* Mobile menu button */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onToggle}
          icon={isOpen ? <CloseIcon w={4} h={4} /> : <HamburgerIcon w={6} h={6} />}
          variant="ghost"
          color="neon.gold"
          aria-label="Toggle Navigation"
          size="lg"
          _hover={{
            bg: "whiteAlpha.100"
          }}
        />

        {/* Desktop Navigation */}
        <MotionFlex
          display={{ base: 'none', md: 'flex' }}
          gap={{ md: 5, lg: 8 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            as={Link}
            to="/insights"
            variant="ghost"
            size="lg"
            px={{ md: 6, lg: 8 }}
            fontSize={{ base: "lg", md: "xl" }}
            height={{ md: "48px", lg: "56px" }}
            _hover={{
              bg: "whiteAlpha.100"
            }}
          >
            Insights
          </Button>
          <ProjectsButton />
          <Button
            as={Link}
            to="/dev-reels"
            variant="ghost"
            size="lg"
            px={{ md: 6, lg: 8 }}
            fontSize={{ base: "lg", md: "xl" }}
            height={{ md: "48px", lg: "56px" }}
            _hover={{
              bg: "whiteAlpha.100"
            }}
          >
            DevReels
          </Button>
          <Button
            as={Link}
            to="/chat-room"
            variant="ghost"
            size="lg"
            px={{ md: 6, lg: 8 }}
            fontSize={{ base: "lg", md: "xl" }}
            height={{ md: "48px", lg: "56px" }}
            _hover={{
              bg: "whiteAlpha.100"
            }}
          >
            Chat Room
          </Button>
          <Button
            as={Link}
            to="/contact"
            variant="solid"
            size="lg"
            height={{ md: "48px", lg: "56px" }}
            px={{ md: 8, lg: 10 }}
            fontSize={{ base: "lg", md: "xl" }}
            bgGradient="linear(to-r, gold.400, gold.500)"
            _hover={{
              bgGradient: "linear(to-r, gold.500, gold.600)"
            }}
          >
            Contact
          </Button>
        </MotionFlex>

        {/* Mobile Navigation */}
        <Stack
          display={{ base: isOpen ? 'flex' : 'none', md: 'none' }}
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="rgba(17, 24, 39, 0.95)"
          backdropFilter="blur(12px)"
          p={6}
          spacing={4}
          borderBottom="1px solid"
          borderColor="whiteAlpha.100"
          animation="slideDown 0.3s ease-out"
        >
          <Button
            as={Link}
            to="/insights"
            variant="ghost"
            w="full"
            justifyContent="center"
            fontSize="lg"
            py={7}
            height="56px"
            _hover={{
              bg: "whiteAlpha.100"
            }}
          >
            Insights
          </Button>
          <ProjectsButton />
          <Button
            as={Link}
            to="/dev-reels"
            variant="ghost"
            w="full"
            justifyContent="center"
            fontSize="lg"
            py={7}
            height="56px"
            _hover={{
              bg: "whiteAlpha.100"
            }}
          >
            DevReels
          </Button>
          <Button
            as={Link}
            to="/chat-room"
            variant="ghost"
            w="full"
            justifyContent="center"
            fontSize="lg"
            py={7}
            height="56px"
            _hover={{
              bg: "whiteAlpha.100"
            }}
          >
            Chat Room
          </Button>
          <Button
            as={Link}
            to="/contact"
            variant="solid"
            w="full"
            py={7}
            height="56px"
            fontSize="lg"
            bgGradient="linear(to-r, gold.400, gold.500)"
            _hover={{
              bgGradient: "linear(to-r, gold.500, gold.600)"
            }}
          >
            Contact
          </Button>
        </Stack>

        {/* Developer-specific project menu removed to avoid duplicate "Projects" button */}
      </Flex>
    </Box>
  );
};

export default Navbar; 