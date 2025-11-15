import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Button,
  useToast,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  HStack,
  Icon,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  SimpleGrid,
  Progress,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { FaArrowLeft, FaEye, FaEyeSlash, FaUserTie, FaCode, FaGithub, FaBriefcase, FaGlobe, FaBuilding, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useColorMode } from '@chakra-ui/react';
// External auth and database calls removed; this component currently renders UI only.

const MotionBox = motion.create(Box);
const MotionContainer = motion.create(Container);

const RoleCard = ({ title, description, icon, isSelected, onClick }) => (
  <Box
    as="button"
    w="full"
    p={8}
    borderRadius="xl"
    bg={isSelected ? 'whiteAlpha.200' : 'whiteAlpha.100'}
    borderWidth="2px"
    borderColor={isSelected ? 'gold.400' : 'transparent'}
    onClick={onClick}
    transition="all 0.3s"
    _hover={{
      transform: 'translateY(-4px)',
      shadow: 'xl',
      borderColor: 'gold.400',
    }}
    textAlign="left"
  >
    <VStack align="flex-start" spacing={4}>
      <Icon as={icon} boxSize={8} color="gold.400" />
      <Text fontSize="xl" fontWeight="bold" color="white">
        {title}
      </Text>
      <Text color="whiteAlpha.800">
        {description}
      </Text>
    </VStack>
  </Box>
);

const Auth = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { setColorMode } = useColorMode();
  const [isLogin, setIsLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    role: '',
    // Developer specific fields
    primarySkills: '',
    yearsOfExperience: '',
    githubProfile: '',
    portfolioUrl: '',
    preferredWorkType: '',
    // Seeker specific fields
    companyName: '',
    industry: '',
    companySize: '',
    projectDescription: '',
    projectType: '',
    preferredBudgetRange: '',
  });
  const [errors, setErrors] = useState({});

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0 && !isLogin) {
      if (!formData.role) newErrors.role = 'Please select a role';
    } else if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    } else if (step === 2) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.country) newErrors.country = 'Country is required';
    } else if (step === 3) {
      if (formData.role === 'developer') {
        if (!formData.primarySkills) newErrors.primarySkills = 'Primary skills are required';
        if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
        if (!formData.preferredWorkType) newErrors.preferredWorkType = 'Preferred work type is required';
      } else {
        if (!formData.companyName) newErrors.companyName = 'Company name is required';
        if (!formData.industry) newErrors.industry = 'Industry is required';
        if (!formData.projectType) newErrors.projectType = 'Project type is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        currentRole: formData.role,
        createdAt: new Date(),
        ...(formData.role === 'developer' ? {
          primarySkills: formData.primarySkills.split(',').map(skill => skill.trim()),
          yearsOfExperience: formData.yearsOfExperience,
          githubProfile: formData.githubProfile,
          portfolioUrl: formData.portfolioUrl,
          preferredWorkType: formData.preferredWorkType,
        } : {
          companyName: formData.companyName,
          industry: formData.industry,
          companySize: formData.companySize,
          projectType: formData.projectType,
          projectDescription: formData.projectDescription,
          preferredBudgetRange: formData.preferredBudgetRange,
        }),
      });

      await sendVerificationEmail(user);
      
      toast({
        title: 'Registration successful',
        description: 'Please verify your email',
        status: 'success',
        duration: 3000,
      });
      
      navigate('/verify');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <VStack spacing={6} as="form" onSubmit={handleLogin}>
      <FormControl isInvalid={errors.email}>
        <FormLabel color="white">Email</FormLabel>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          bg="whiteAlpha.100"
          color="white"
        />
        <FormErrorMessage>{errors.email}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.password}>
        <FormLabel color="white">Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            bg="whiteAlpha.100"
            color="white"
          />
          <InputRightElement>
            <IconButton
              icon={showPassword ? <FaEyeSlash /> : <FaEye />}
              variant="ghost"
              onClick={() => setShowPassword(!showPassword)}
              color="white"
            />
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{errors.password}</FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        colorScheme="gold"
        size="lg"
        w="full"
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );

  const renderRoleSelection = () => (
    <VStack spacing={8}>
      <Text color="white" fontSize="lg" textAlign="center">
        Choose how you want to join our platform
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
        <RoleCard
          title="Join as a Developer"
          description="Find exciting projects and showcase your skills to potential clients."
          icon={FaCode}
          isSelected={formData.role === 'developer'}
          onClick={() => {
            setFormData({ ...formData, role: 'developer' });
            setColorMode('developer');
            handleNext();
          }}
        />
        <RoleCard
          title="Join as a Client"
          description="Post projects and find talented developers for your needs."
          icon={FaUserTie}
          isSelected={formData.role === 'seeker'}
          onClick={() => {
            setFormData({ ...formData, role: 'seeker' });
            setColorMode('seeker');
            handleNext();
          }}
        />
      </SimpleGrid>
    </VStack>
  );

  const renderRegistrationSteps = () => {
    switch (currentStep) {
      case 0:
        return renderRoleSelection();

      case 1:
        return (
          <VStack spacing={6}>
            <HStack w="full" spacing={4}>
              <FormControl isInvalid={errors.firstName}>
                <FormLabel color="white">First Name</FormLabel>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  bg="whiteAlpha.100"
                  color="white"
                />
                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.lastName}>
                <FormLabel color="white">Last Name</FormLabel>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  bg="whiteAlpha.100"
                  color="white"
                />
                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
              </FormControl>
            </HStack>

            <FormControl isInvalid={errors.email}>
              <FormLabel color="white">Work Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                bg="whiteAlpha.100"
                color="white"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.phone}>
              <FormLabel color="white">Phone Number</FormLabel>
              <InputGroup>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  bg="whiteAlpha.100"
                  color="white"
                  placeholder="+1 (234) 567-8900"
                />
                <InputRightElement>
                  <Icon as={FaPhone} color="white" />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>

            <HStack w="full" spacing={4}>
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button colorScheme="gold" onClick={handleNext} flex={1}>Next</Button>
            </HStack>
          </VStack>
        );

      case 2:
        return (
          <VStack spacing={6}>
            <FormControl isInvalid={errors.password}>
              <FormLabel color="white">Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  bg="whiteAlpha.100"
                  color="white"
                />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    color="white"
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.confirmPassword}>
              <FormLabel color="white">Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  bg="whiteAlpha.100"
                  color="white"
                />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    color="white"
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.country}>
              <FormLabel color="white">Country</FormLabel>
              <InputGroup>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  bg="whiteAlpha.100"
                  color="white"
                />
                <InputRightElement>
                  <Icon as={FaGlobe} color="white" />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.country}</FormErrorMessage>
            </FormControl>

            <HStack w="full" spacing={4}>
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button colorScheme="gold" onClick={handleNext} flex={1}>Next</Button>
            </HStack>
          </VStack>
        );

      case 3:
        return formData.role === 'developer' ? (
          <VStack spacing={6}>
            <FormControl isInvalid={errors.primarySkills}>
              <FormLabel color="white">Primary Skills (comma-separated)</FormLabel>
              <Input
                value={formData.primarySkills}
                onChange={(e) => setFormData({ ...formData, primarySkills: e.target.value })}
                placeholder="e.g., React, Node.js, Python"
                bg="whiteAlpha.100"
                color="white"
              />
              <FormErrorMessage>{errors.primarySkills}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.yearsOfExperience}>
              <FormLabel color="white">Years of Experience</FormLabel>
              <Select
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                bg="whiteAlpha.100"
                color="white"
              >
                <option value="">Select experience</option>
                <option value="0-1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </Select>
              <FormErrorMessage>{errors.yearsOfExperience}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel color="white">GitHub Profile</FormLabel>
              <InputGroup>
                <Input
                  value={formData.githubProfile}
                  onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
                  placeholder="username"
                  bg="whiteAlpha.100"
                  color="white"
                />
                <InputRightElement>
                  <Icon as={FaGithub} color="white" />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel color="white">Portfolio URL</FormLabel>
              <Input
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                placeholder="https://your-portfolio.com"
                bg="whiteAlpha.100"
                color="white"
              />
            </FormControl>

            <FormControl isInvalid={errors.preferredWorkType}>
              <FormLabel color="white">Preferred Work Type</FormLabel>
              <Select
                value={formData.preferredWorkType}
                onChange={(e) => setFormData({ ...formData, preferredWorkType: e.target.value })}
                bg="whiteAlpha.100"
                color="white"
              >
                <option value="">Select work type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </Select>
              <FormErrorMessage>{errors.preferredWorkType}</FormErrorMessage>
            </FormControl>

            <HStack w="full" spacing={4}>
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button colorScheme="gold" onClick={handleRegister} isLoading={loading} flex={1}>
                Complete Registration
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack spacing={6}>
            <FormControl isInvalid={errors.companyName}>
              <FormLabel color="white">Company Name</FormLabel>
              <InputGroup>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  bg="whiteAlpha.100"
                  color="white"
                />
                <InputRightElement>
                  <Icon as={FaBuilding} color="white" />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.companyName}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.industry}>
              <FormLabel color="white">Industry</FormLabel>
              <Select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                bg="whiteAlpha.100"
                color="white"
              >
                <option value="">Select industry</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="ecommerce">E-commerce</option>
                <option value="other">Other</option>
              </Select>
              <FormErrorMessage>{errors.industry}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel color="white">Company Size</FormLabel>
              <Select
                value={formData.companySize}
                onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                bg="whiteAlpha.100"
                color="white"
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501+">501+ employees</option>
              </Select>
            </FormControl>

            <FormControl isInvalid={errors.projectType}>
              <FormLabel color="white">Project Type</FormLabel>
              <Select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                bg="whiteAlpha.100"
                color="white"
              >
                <option value="">Select project type</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-app">Mobile App Development</option>
                <option value="desktop-app">Desktop Application</option>
                <option value="ai-ml">AI/ML Development</option>
                <option value="blockchain">Blockchain Development</option>
                <option value="other">Other</option>
              </Select>
              <FormErrorMessage>{errors.projectType}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel color="white">Project Description</FormLabel>
              <Textarea
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                placeholder="Brief description of your typical project needs"
                bg="whiteAlpha.100"
                color="white"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="white">Preferred Budget Range</FormLabel>
              <Select
                value={formData.preferredBudgetRange}
                onChange={(e) => setFormData({ ...formData, preferredBudgetRange: e.target.value })}
                bg="whiteAlpha.100"
                color="white"
              >
                <option value="">Select budget range</option>
                <option value="<5000">Less than $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-25000">$10,000 - $25,000</option>
                <option value="25000-50000">$25,000 - $50,000</option>
                <option value="50000+">$50,000+</option>
              </Select>
            </FormControl>

            <HStack w="full" spacing={4}>
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button colorScheme="gold" onClick={handleRegister} isLoading={loading} flex={1}>
                Complete Registration
              </Button>
            </HStack>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      minH="100vh"
      bg="dark.900"
      pt={28}
      pb={20}
    >
      <MotionContainer
        maxW="container.md"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <VStack spacing={8}>
          <Heading color="white" textAlign="center">
            {isLogin ? 'Welcome Back' : (currentStep === 0 ? 'Join Our Platform' : 'Create Your Account')}
          </Heading>
          
          {!isLogin && (
            <Progress
              value={progress}
              size="sm"
              colorScheme="gold"
              w="full"
              borderRadius="full"
              bg="whiteAlpha.100"
            />
          )}
          
          <Box
            w="100%"
            p={8}
            borderRadius="xl"
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
          >
            {isLogin ? renderLoginForm() : renderRegistrationSteps()}

            <Divider my={6} borderColor="whiteAlpha.300" />

            <Text color="whiteAlpha.700" textAlign="center">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text
                as="span"
                color="gold.300"
                cursor="pointer"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setCurrentStep(0);
                  setFormData({});
                  setErrors({});
                }}
              >
                {isLogin ? 'Register here' : 'Login here'}
              </Text>
            </Text>
          </Box>
        </VStack>
      </MotionContainer>
    </MotionBox>
  );
};

export default Auth;