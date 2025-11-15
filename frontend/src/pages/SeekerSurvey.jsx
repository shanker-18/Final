import React, { useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Progress,
  useToast,
  Textarea,
  SimpleGrid,
  Badge,
  Icon,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLaptopCode, 
  FaMobileAlt, 
  FaCloud, 
  FaRobot, 
  FaCog,
  FaReact,
  FaNodeJs,
  FaPython,
  FaJava,
  FaShoppingCart,
  FaGraduationCap,
  FaChartLine,
  FaBrain,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../config/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

const MotionBox = motion.create(Box);
const MotionStack = motion.create(Stack);

const SeekerSurvey = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  
  const [surveyData, setSurveyData] = useState({
    projectType: '',
    techStack: [],
    budgetRange: '',
    domain: '',
    requirements: '',
  });

  const toast = useToast();
  const navigate = useNavigate();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  // Project Type Options
  const projectTypes = [
    { id: 'website', label: 'Website', icon: FaLaptopCode, color: 'cyan.400' },
    { id: 'mobile-app', label: 'Mobile App', icon: FaMobileAlt, color: 'purple.400' },
    { id: 'saas', label: 'SaaS Platform', icon: FaCloud, color: 'blue.400' },
    { id: 'automation', label: 'Automation Tool', icon: FaCog, color: 'orange.400' },
    { id: 'ai-app', label: 'AI Application', icon: FaRobot, color: 'pink.400' },
  ];

  // Tech Stack Options
  const techStackOptions = [
    { id: 'react', label: 'React', icon: FaReact, color: 'cyan.400' },
    { id: 'nodejs', label: 'Node.js', icon: FaNodeJs, color: 'green.400' },
    { id: 'python', label: 'Python', icon: FaPython, color: 'blue.400' },
    { id: 'java', label: 'Java', icon: FaJava, color: 'red.400' },
    { id: 'flutter', label: 'Flutter', icon: FaMobileAlt, color: 'blue.300' },
    { id: 'mongodb', label: 'MongoDB', color: 'green.500' },
    { id: 'postgresql', label: 'PostgreSQL', color: 'blue.600' },
    { id: 'django', label: 'Django', color: 'green.600' },
    { id: 'vue', label: 'Vue.js', color: 'green.400' },
    { id: 'angular', label: 'Angular', color: 'red.500' },
  ];

  // Budget Ranges
  const budgetRanges = [
    { id: '5k-10k', label: '₹5,000 - ₹10,000', value: '5000-10000' },
    { id: '10k-20k', label: '₹10,000 - ₹20,000', value: '10000-20000' },
    { id: '20k-50k', label: '₹20,000 - ₹50,000', value: '20000-50000' },
    { id: '50k-100k', label: '₹50,000 - ₹1,00,000', value: '50000-100000' },
    { id: '100k+', label: '₹1,00,000+', value: '100000+' },
  ];

  // Domain Options
  const domainOptions = [
    { id: 'ecommerce', label: 'E-commerce', icon: FaShoppingCart, color: 'orange.400' },
    { id: 'education', label: 'Education', icon: FaGraduationCap, color: 'blue.400' },
    { id: 'finance', label: 'Finance', icon: FaChartLine, color: 'green.400' },
    { id: 'ai-ml', label: 'AI/ML', icon: FaBrain, color: 'purple.400' },
    { id: 'productivity', label: 'Productivity', icon: FaCog, color: 'cyan.400' },
    { id: 'marketplace', label: 'Marketplace', icon: FaShoppingCart, color: 'pink.400' },
    { id: 'healthcare', label: 'Healthcare', color: 'red.400' },
    { id: 'social', label: 'Social Media', color: 'blue.500' },
  ];

  const handleSelection = (field, value) => {
    setSurveyData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelection = (field, value) => {
    setSurveyData(prev => {
      const currentValues = prev[field] || [];
      const isSelected = currentValues.includes(value);
      
      return {
        ...prev,
        [field]: isSelected
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value]
      };
    });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return surveyData.projectType !== '';
      case 2:
        return surveyData.techStack.length > 0;
      case 3:
        return surveyData.budgetRange !== '';
      case 4:
        return surveyData.domain !== '';
      case 5:
        return surveyData.requirements.trim().length > 20;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep()) {
      toast({
        title: 'Incomplete step',
        description: 'Please complete the current step before proceeding.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      toast({
        title: 'Incomplete survey',
        description: 'Please complete all steps before submitting.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call AI recommendation API
      const response = await axios.post(`${API_BASE_URL}/api/survey/recommendations`, {
        userId: auth.currentUser?.uid,
        survey: surveyData,
      });

      // Update user document with survey completion
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          surveyCompleted: true,
          surveyData: surveyData,
          surveyCompletedAt: serverTimestamp(),
        });
      }

      setRecommendations(response.data);

      toast({
        title: 'Survey completed!',
        description: 'AI recommendations generated successfully.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Survey submission error:', error);
      toast({
        title: 'Submission failed',
        description: error.response?.data?.message || 'Unable to process survey. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewRecommendations = () => {
    navigate('/projects');
  };

  const renderStepContent = () => {
    const slideVariants = {
      enter: (direction) => ({
        x: direction > 0 ? 100 : -100,
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
      },
      exit: (direction) => ({
        x: direction < 0 ? 100 : -100,
        opacity: 0,
      }),
    };

    switch (currentStep) {
      case 1:
        return (
          <MotionStack
            spacing={6}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={3} align="start">
              <Heading size="lg" color="white">
                What type of project do you need?
              </Heading>
              <Text color="whiteAlpha.700">
                Select the category that best describes your project
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {projectTypes.map((type) => (
                <MotionBox
                  key={type.id}
                  p={6}
                  bg={surveyData.projectType === type.id ? 'whiteAlpha.200' : 'whiteAlpha.50'}
                  border="2px solid"
                  borderColor={surveyData.projectType === type.id ? type.color : 'whiteAlpha.200'}
                  borderRadius="xl"
                  cursor="pointer"
                  onClick={() => handleSelection('projectType', type.id)}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'translateY(-4px)',
                    borderColor: type.color,
                    bg: 'whiteAlpha.100',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <VStack spacing={3}>
                    <Icon as={type.icon} boxSize={10} color={type.color} />
                    <Text color="white" fontWeight="bold" fontSize="lg">
                      {type.label}
                    </Text>
                    {surveyData.projectType === type.id && (
                      <Icon as={FaCheckCircle} color={type.color} />
                    )}
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionStack>
        );

      case 2:
        return (
          <MotionStack
            spacing={6}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={3} align="start">
              <Heading size="lg" color="white">
                Select your preferred tech stack
              </Heading>
              <Text color="whiteAlpha.700">
                Choose one or more technologies (minimum 1 required)
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
              {techStackOptions.map((tech) => {
                const isSelected = surveyData.techStack.includes(tech.id);
                return (
                  <MotionBox
                    key={tech.id}
                    p={4}
                    bg={isSelected ? 'whiteAlpha.200' : 'whiteAlpha.50'}
                    border="2px solid"
                    borderColor={isSelected ? tech.color : 'whiteAlpha.200'}
                    borderRadius="lg"
                    cursor="pointer"
                    onClick={() => handleMultiSelection('techStack', tech.id)}
                    transition="all 0.3s ease"
                    _hover={{
                      transform: 'translateY(-2px)',
                      borderColor: tech.color,
                      bg: 'whiteAlpha.100',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <VStack spacing={2}>
                      {tech.icon && <Icon as={tech.icon} boxSize={8} color={tech.color} />}
                      <Text color="white" fontWeight="semibold" fontSize="sm" textAlign="center">
                        {tech.label}
                      </Text>
                      {isSelected && (
                        <Icon as={FaCheckCircle} color={tech.color} boxSize={5} />
                      )}
                    </VStack>
                  </MotionBox>
                );
              })}
            </SimpleGrid>

            {surveyData.techStack.length > 0 && (
              <Box mt={4}>
                <Text color="whiteAlpha.700" mb={2}>
                  Selected: {surveyData.techStack.length} technolog{surveyData.techStack.length === 1 ? 'y' : 'ies'}
                </Text>
                <Flex flexWrap="wrap" gap={2}>
                  {surveyData.techStack.map((tech) => {
                    const option = techStackOptions.find(t => t.id === tech);
                    return (
                      <Badge
                        key={tech}
                        colorScheme="yellow"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="sm"
                      >
                        {option?.label}
                      </Badge>
                    );
                  })}
                </Flex>
              </Box>
            )}
          </MotionStack>
        );

      case 3:
        return (
          <MotionStack
            spacing={6}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={3} align="start">
              <Heading size="lg" color="white">
                What's your budget range?
              </Heading>
              <Text color="whiteAlpha.700">
                Select the budget that works best for your project
              </Text>
            </VStack>

            <VStack spacing={4} align="stretch">
              {budgetRanges.map((budget) => (
                <MotionBox
                  key={budget.id}
                  p={5}
                  bg={surveyData.budgetRange === budget.value ? 'whiteAlpha.200' : 'whiteAlpha.50'}
                  border="2px solid"
                  borderColor={surveyData.budgetRange === budget.value ? 'cyan.400' : 'whiteAlpha.200'}
                  borderRadius="lg"
                  cursor="pointer"
                  onClick={() => handleSelection('budgetRange', budget.value)}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'translateX(8px)',
                    borderColor: 'cyan.400',
                    bg: 'whiteAlpha.100',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HStack justify="space-between">
                    <Text color="white" fontWeight="bold" fontSize="lg">
                      {budget.label}
                    </Text>
                    {surveyData.budgetRange === budget.value && (
                      <Icon as={FaCheckCircle} color="cyan.400" boxSize={6} />
                    )}
                  </HStack>
                </MotionBox>
              ))}
            </VStack>
          </MotionStack>
        );

      case 4:
        return (
          <MotionStack
            spacing={6}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={3} align="start">
              <Heading size="lg" color="white">
                Choose your project domain
              </Heading>
              <Text color="whiteAlpha.700">
                What industry or sector is your project focused on?
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {domainOptions.map((domain) => (
                <MotionBox
                  key={domain.id}
                  p={6}
                  bg={surveyData.domain === domain.id ? 'whiteAlpha.200' : 'whiteAlpha.50'}
                  border="2px solid"
                  borderColor={surveyData.domain === domain.id ? domain.color : 'whiteAlpha.200'}
                  borderRadius="xl"
                  cursor="pointer"
                  onClick={() => handleSelection('domain', domain.id)}
                  transition="all 0.3s ease"
                  _hover={{
                    transform: 'translateY(-4px)',
                    borderColor: domain.color,
                    bg: 'whiteAlpha.100',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <VStack spacing={3}>
                    {domain.icon && <Icon as={domain.icon} boxSize={10} color={domain.color} />}
                    <Text color="white" fontWeight="bold" fontSize="lg">
                      {domain.label}
                    </Text>
                    {surveyData.domain === domain.id && (
                      <Icon as={FaCheckCircle} color={domain.color} />
                    )}
                  </VStack>
                </MotionBox>
              ))}
            </SimpleGrid>
          </MotionStack>
        );

      case 5:
        return (
          <MotionStack
            spacing={6}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ duration: 0.3 }}
          >
            <VStack spacing={3} align="start">
              <Heading size="lg" color="white">
                Tell us more about your requirements
              </Heading>
              <Text color="whiteAlpha.700">
                Describe your project in detail (minimum 20 characters)
              </Text>
            </VStack>

            <FormControl>
              <Textarea
                value={surveyData.requirements}
                onChange={(e) => handleSelection('requirements', e.target.value)}
                placeholder="E.g., I need a modern e-commerce platform with payment integration, user authentication, product catalog, shopping cart, and order management. The platform should be mobile-responsive and have an admin dashboard..."
                rows={10}
                bg="whiteAlpha.50"
                border="2px solid"
                borderColor="whiteAlpha.200"
                color="white"
                _placeholder={{ color: 'whiteAlpha.500' }}
                _hover={{ borderColor: 'gold.400' }}
                _focus={{
                  borderColor: 'gold.400',
                  boxShadow: '0 0 0 1px #FFD700',
                }}
                fontSize="md"
                resize="vertical"
              />
              <Text
                color={surveyData.requirements.length >= 20 ? 'green.400' : 'whiteAlpha.600'}
                fontSize="sm"
                mt={2}
              >
                {surveyData.requirements.length} / 20 characters minimum
              </Text>
            </FormControl>

            {surveyData.requirements.trim().length >= 20 && (
              <Box p={4} bg="green.900" borderRadius="lg" border="1px solid" borderColor="green.400">
                <HStack>
                  <Icon as={FaCheckCircle} color="green.400" />
                  <Text color="white" fontSize="sm">
                    Great! Your requirements look good. Click Submit to get AI-powered recommendations.
                  </Text>
                </HStack>
              </Box>
            )}
          </MotionStack>
        );

      default:
        return null;
    }
  };

  if (recommendations) {
    return (
      <Box
        minH="100vh"
        bg="dark.900"
        pt={{ base: "100px", md: "120px" }}
        pb={20}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="radial(circle at top right, rgba(103, 232, 249, 0.15), transparent 70%)"
          opacity={0.3}
        />

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={8} align="stretch">
              <Box textAlign="center">
                <Icon as={FaCheckCircle} boxSize={16} color="green.400" mb={4} />
                <Heading size="2xl" color="white" mb={4}>
                  Survey Completed! 🎉
                </Heading>
                <Text color="whiteAlpha.700" fontSize="xl">
                  We've analyzed your requirements and found {recommendations.recommendations?.length || 0} matching projects
                </Text>
              </Box>

              <Box
                p={8}
                bg="whiteAlpha.50"
                borderRadius="xl"
                border="1px solid"
                borderColor="whiteAlpha.200"
              >
                <Heading size="md" color="white" mb={6}>
                  Top Recommendations
                </Heading>

                <VStack spacing={4} align="stretch">
                  {recommendations.recommendations?.map((rec, index) => (
                    <Box
                      key={index}
                      p={6}
                      bg="whiteAlpha.100"
                      borderRadius="lg"
                      border="2px solid"
                      borderColor="gold.400"
                    >
                      <HStack justify="space-between" mb={3}>
                        <Heading size="sm" color="white">
                          {rec.title}
                        </Heading>
                        <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                          {rec.matchScore}% Match
                        </Badge>
                      </HStack>

                      <Text color="whiteAlpha.800" mb={3}>
                        {rec.description}
                      </Text>

                      <Box
                        p={4}
                        bg="rgba(255, 215, 0, 0.1)"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gold.400"
                      >
                        <Text color="gold.200" fontSize="sm" fontWeight="medium" mb={2}>
                          Why this matches:
                        </Text>
                        <Text color="whiteAlpha.900" fontSize="sm">
                          {rec.explanation}
                        </Text>
                      </Box>

                      {rec.technologies && (
                        <Flex flexWrap="wrap" gap={2} mt={3}>
                          {rec.technologies.map((tech, i) => (
                            <Badge key={i} colorScheme="purple" px={2} py={1}>
                              {tech}
                            </Badge>
                          ))}
                        </Flex>
                      )}
                    </Box>
                  ))}
                </VStack>
              </Box>

              <HStack justify="center" spacing={4}>
                <Button
                  size="lg"
                  bg="gold.400"
                  color="gray.800"
                  _hover={{ bg: 'gold.500' }}
                  rightIcon={<FaArrowRight />}
                  onClick={handleViewRecommendations}
                >
                  View All Projects
                </Button>
              </HStack>
            </VStack>
          </MotionBox>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="dark.900"
      pt={{ base: "100px", md: "120px" }}
      pb={20}
      position="relative"
      overflow="hidden"
    >
      {/* Animated Background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at top right, rgba(103, 232, 249, 0.15), transparent 70%)"
        opacity={0.3}
      />

      <Container maxW="container.lg" position="relative" zIndex={1}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Stack spacing={8}>
            {/* Header */}
            <VStack spacing={4} textAlign="center">
              <Heading size="2xl" color="white">
                Project Discovery Survey
              </Heading>
              <Text color="whiteAlpha.700" fontSize="lg" maxW="600px">
                Help us understand your needs so we can recommend the perfect projects for you
              </Text>
            </VStack>

            {/* Progress Bar */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text color="whiteAlpha.700" fontSize="sm">
                  Step {currentStep} of {totalSteps}
                </Text>
                <Text color="whiteAlpha.700" fontSize="sm">
                  {Math.round(progress)}% Complete
                </Text>
              </HStack>
              <Progress
                value={progress}
                size="sm"
                colorScheme="yellow"
                borderRadius="full"
                bg="whiteAlpha.200"
              />
            </Box>

            {/* Survey Content */}
            <Box
              p={8}
              bg="rgba(0, 0, 0, 0.3)"
              borderRadius="xl"
              border="1px solid"
              borderColor="gold.400"
              backdropFilter="blur(10px)"
              minH="500px"
            >
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>
            </Box>

            {/* Navigation Buttons */}
            <HStack justify="space-between">
              <Button
                leftIcon={<FaArrowLeft />}
                onClick={prevStep}
                isDisabled={currentStep === 1}
                variant="outline"
                borderColor="gold.400"
                color="gold.400"
                _hover={{ bg: 'whiteAlpha.100' }}
                size="lg"
              >
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  rightIcon={<FaArrowRight />}
                  onClick={nextStep}
                  bg="gold.400"
                  color="gray.800"
                  _hover={{ bg: 'gold.500' }}
                  size="lg"
                  isDisabled={!validateStep()}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  rightIcon={isSubmitting ? <Spinner size="sm" /> : <FaCheckCircle />}
                  onClick={handleSubmit}
                  bg="green.400"
                  color="black"
                  _hover={{ bg: 'green.300' }}
                  size="lg"
                  isLoading={isSubmitting}
                  loadingText="Generating Recommendations..."
                  isDisabled={!validateStep()}
                >
                  Submit Survey
                </Button>
              )}
            </HStack>
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default SeekerSurvey;
