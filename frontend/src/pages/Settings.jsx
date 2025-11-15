import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Switch,
  IconButton,
  useColorMode,
  Divider,
  Button,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaSun,
  FaMoon,
  FaBell,
  FaGlobe,
  FaLock,
  FaUserShield,
  FaPalette,
  FaArrowLeft,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion.create(Box);

const SettingItem = ({ icon, title, description, children }) => (
  <HStack
    w="full"
    justify="space-between"
    p={4}
    bg="whiteAlpha.50"
    borderRadius="xl"
    transition="all 0.3s"
    _hover={{ bg: 'whiteAlpha.100' }}
  >
    <HStack spacing={4}>
      <Box
        p={2}
        borderRadius="lg"
        bg="whiteAlpha.100"
        color="gold.400"
      >
        {icon}
      </Box>
      <VStack align="start" spacing={0}>
        <Text color="white" fontWeight="bold">{title}</Text>
        <Text color="whiteAlpha.600" fontSize="sm">{description}</Text>
      </VStack>
    </HStack>
    {children}
  </HStack>
);

const Settings = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [notifications, setNotifications] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save settings to backend/database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Settings saved successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const ThemeSelector = () => (
    <VStack
      spacing={4}
      p={4}
      bg="whiteAlpha.50"
      borderRadius="xl"
      align="stretch"
    >
      <HStack justify="space-between">
        <Text color="white" fontWeight="bold">Light</Text>
        <IconButton
          icon={<FaSun />}
          variant={colorMode === 'light' ? 'solid' : 'ghost'}
          colorScheme="gold"
          onClick={() => colorMode !== 'light' && toggleColorMode()}
        />
      </HStack>
      <HStack justify="space-between">
        <Text color="white" fontWeight="bold">Dark</Text>
        <IconButton
          icon={<FaMoon />}
          variant={colorMode === 'dark' ? 'solid' : 'ghost'}
          colorScheme="gold"
          onClick={() => colorMode !== 'dark' && toggleColorMode()}
        />
      </HStack>
    </VStack>
  );

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      minH="100vh"
      bg="gray.900"
      pt={28}
      pb={20}
    >
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <IconButton
              icon={<FaArrowLeft />}
              onClick={() => navigate(-1)}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
            />
            <Heading color="white" size="lg">Settings</Heading>
            <Box w={10} /> {/* Spacer */}
          </HStack>

          <Divider borderColor="whiteAlpha.200" />

          <VStack spacing={6} align="stretch">
            <SettingItem
              icon={<FaPalette />}
              title="Theme"
              description="Customize your app appearance"
            >
              <Button
                size="sm"
                variant="ghost"
                colorScheme="gold"
                onClick={onOpen}
              >
                Customize
              </Button>
            </SettingItem>

            <SettingItem
              icon={<FaBell />}
              title="Notifications"
              description="Manage your notification preferences"
            >
              <Switch
                colorScheme="gold"
                isChecked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            </SettingItem>

            <SettingItem
              icon={<FaGlobe />}
              title="Auto-Translate"
              description="Automatically translate content"
            >
              <Switch
                colorScheme="gold"
                isChecked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
              />
            </SettingItem>

            <SettingItem
              icon={<FaLock />}
              title="Privacy Mode"
              description="Enhanced privacy settings"
            >
              <Switch
                colorScheme="gold"
                isChecked={privacyMode}
                onChange={(e) => setPrivacyMode(e.target.checked)}
              />
            </SettingItem>

            <SettingItem
              icon={<FaUserShield />}
              title="Security Settings"
              description="Manage your security preferences"
            >
              <Button
                size="sm"
                variant="ghost"
                colorScheme="gold"
                onClick={() => navigate('/security')}
              >
                Configure
              </Button>
            </SettingItem>
          </VStack>

          <Button
            colorScheme="gold"
            size="lg"
            w="full"
            mt={4}
            isLoading={loading}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </VStack>
      </Container>

      {/* Theme Customization Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent bg="gray.800">
          <DrawerCloseButton color="white" />
          <DrawerHeader color="white">Theme Settings</DrawerHeader>
          <DrawerBody>
            <VStack spacing={6}>
              <ThemeSelector />
              {/* Add more theme customization options here */}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </MotionBox>
  );
};

export default Settings;