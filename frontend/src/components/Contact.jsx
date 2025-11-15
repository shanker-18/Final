import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  useToast,
  HStack,
  Icon,
  Link,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, 
  FaUser, 
  FaPaperPlane, 
  FaGithub, 
  FaLinkedin, 
  FaTwitter 
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const MotionBox = motion.create(Box);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    query: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(`Query from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.query}`
      );
      const mailtoLink = `mailto:freelancehub2k@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;

      toast({
        title: "Opening Email Client",
        description: "Your message has been prepared to send.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Clear form
      setFormData({ name: '', email: '', query: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Please try sending email directly to freelancehub2k@gmail.com",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Map the form field names to state properties
    const fieldMap = {
      'user_name': 'name',
      'user_email': 'email',
      'message': 'query'
    };
    
    setFormData(prev => ({
      ...prev,
      [fieldMap[name] || name]: value
    }));
  };

  return (
    <AnimatePresence mode="wait">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        minH="100vh"
        bg="gray.900"
        py={32}
        position="relative"
        overflow="hidden"
      >
        {/* Animated background elements */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="radial(circle at top right, rgba(255,215,0,0.1), transparent 70%)"
          opacity={0.3}
        />

        <Container maxW="container.md">
          <VStack spacing={16}>
            {/* Header Section */}
            <VStack spacing={6}>
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Heading
                  fontSize={{ base: "4xl", md: "6xl" }}
                  bgGradient="linear(to-r, gold.200, gold.400)"
                  bgClip="text"
                  mb={6}
                  letterSpacing="tight"
                >
                  Get in Touch
                </Heading>
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  color="whiteAlpha.900"
                  maxW="xl"
                  mx="auto"
                  lineHeight="tall"
                >
                  Have questions? We'd love to hear from you.
                </Text>
              </MotionBox>

              {/* Email Display */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                p={8}
                bg="whiteAlpha.100"
                rounded="xl"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                w="full"
                maxW="md"
                textAlign="center"
              >
                <HStack spacing={4} justify="center">
                  <Icon as={MdEmail} w={8} h={8} color="gold.400" />
                  <Text color="white" fontSize="xl" fontWeight="medium">
                    freelancehub2k@gmail.com
                  </Text>
                </HStack>
              </MotionBox>
            </VStack>

            {/* Contact Form */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              w="full"
              bg="whiteAlpha.50"
              p={8}
              rounded="xl"
              border="1px solid"
              borderColor="whiteAlpha.100"
              backdropFilter="blur(10px)"
            >
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel color="white">Name</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaUser} color="gold.400" />
                      </InputLeftElement>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        bg="whiteAlpha.100"
                        border="none"
                        _placeholder={{ color: "whiteAlpha.400" }}
                        color="white"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="white">Email</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaEnvelope} color="gold.400" />
                      </InputLeftElement>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email"
                        bg="whiteAlpha.100"
                        border="none"
                        _placeholder={{ color: "whiteAlpha.400" }}
                        color="white"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="white">Query</FormLabel>
                    <Textarea
                      name="query"
                      value={formData.query}
                      onChange={handleChange}
                      placeholder="Your message..."
                      bg="whiteAlpha.100"
                      border="none"
                      _placeholder={{ color: "whiteAlpha.400" }}
                      color="white"
                      rows={6}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    rightIcon={<FaPaperPlane />}
                    bg="gold.400"
                    color="gray.900"
                    size="lg"
                    w="full"
                    _hover={{
                      bg: "gold.500",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.3s"
                    isLoading={isSubmitting}
                  >
                    Send Message
                  </Button>
                </VStack>
              </form>
            </MotionBox>

            {/* Social Links */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <HStack spacing={6} justify="center">
                <Link href="https://github.com" isExternal>
                  <Icon
                    as={FaGithub}
                    w={6}
                    h={6}
                    color="white"
                    _hover={{ color: "gold.400", transform: "translateY(-2px)" }}
                    transition="all 0.3s"
                  />
                </Link>
                <Link href="https://linkedin.com" isExternal>
                  <Icon
                    as={FaLinkedin}
                    w={6}
                    h={6}
                    color="white"
                    _hover={{ color: "gold.400", transform: "translateY(-2px)" }}
                    transition="all 0.3s"
                  />
                </Link>
                <Link href="https://twitter.com" isExternal>
                  <Icon
                    as={FaTwitter}
                    w={6}
                    h={6}
                    color="white"
                    _hover={{ color: "gold.400", transform: "translateY(-2px)" }}
                    transition="all 0.3s"
                  />
                </Link>
              </HStack>
            </MotionBox>
          </VStack>
        </Container>
      </MotionBox>
    </AnimatePresence>
  );
};

export default Contact;