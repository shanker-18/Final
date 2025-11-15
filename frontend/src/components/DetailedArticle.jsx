import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  useColorModeValue,
  Icon,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion.create(Box);

const articleContent = {
  title: "The Future of Freelancing: A Comprehensive Guide",
  sections: [
    {
      title: "Introduction to Modern Freelancing",
      content: `The landscape of work is rapidly evolving, with freelancing emerging as a dominant force in the global economy. This comprehensive guide explores the current state of freelancing, future trends, and how professionals can position themselves for success in this dynamic environment.

In recent years, we've witnessed a significant shift in how work is performed and distributed. The traditional nine-to-five office model is giving way to more flexible, project-based arrangements, creating unprecedented opportunities for skilled professionals across various industries.`
    },
    {
      title: "The Digital Transformation of Work",
      content: `Technology has been the primary catalyst in transforming how we work. The rise of digital platforms, collaboration tools, and cloud-based services has made it easier than ever for freelancers to connect with clients globally and deliver high-quality work remotely.

Key technological advancements that have shaped the freelance landscape include:
• Cloud-based project management tools
• Virtual collaboration platforms
• Digital payment systems
• AI-powered matching algorithms
• Remote work infrastructure`
    },
    {
      title: "Building a Successful Freelance Career",
      content: `Success in freelancing requires more than just technical skills. Modern freelancers must develop a comprehensive skill set that includes:

1. Personal Branding
- Creating a strong online presence
- Developing a unique value proposition
- Building a professional portfolio

2. Business Management
- Setting competitive rates
- Managing finances and taxes
- Time management and productivity
- Client relationship management

3. Continuous Learning
- Staying updated with industry trends
- Acquiring new skills and certifications
- Networking and community engagement`
    },
    {
      title: "Navigating Challenges and Opportunities",
      content: `While freelancing offers numerous benefits, it also comes with its own set of challenges. Understanding and preparing for these challenges is crucial for long-term success.

Common Challenges:
• Income stability
• Work-life balance
• Client acquisition
• Project management
• Legal and administrative tasks

Opportunities:
• Global client base
• Flexible scheduling
• Higher earning potential
• Professional growth
• Work-life integration`
    },
    {
      title: "The Future Outlook",
      content: `The freelance economy is projected to continue its growth trajectory, with several trends shaping its future:

1. Increased Remote Work Adoption
2. Rise of Specialized Platforms
3. Integration of AI and Automation
4. Focus on Skill-based Hiring
5. Evolution of Payment Systems

As we look ahead, freelancers who adapt to these changes and continuously evolve their skills will be best positioned to thrive in this dynamic landscape.`
    },
    {
      title: "Conclusion",
      content: `The freelance revolution is here to stay, offering unprecedented opportunities for professionals who are willing to embrace this new way of working. By understanding the landscape, developing essential skills, and staying ahead of trends, freelancers can build successful and sustainable careers in this exciting new economy.

Remember that success in freelancing is a journey, not a destination. It requires continuous learning, adaptation, and growth. Whether you're just starting or looking to expand your freelance business, the opportunities are boundless for those who are prepared to seize them.`
    }
  ]
};

const DetailedArticle = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  const handleDownloadPDF = () => {
    // Implement PDF download functionality
    console.log('Downloading PDF...');
  };

  return (
    <Box bg={bgColor} minH="100vh" py={20}>
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Button
              leftIcon={<Icon as={FaArrowLeft} />}
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button
              rightIcon={<Icon as={FaDownload} />}
              colorScheme="blue"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </HStack>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading
              size="2xl"
              color={textColor}
              mb={8}
              textAlign="center"
            >
              {articleContent.title}
            </Heading>

            <VStack spacing={12} align="stretch">
              {articleContent.sections.map((section, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Heading size="lg" mb={4} color={textColor}>
                    {section.title}
                  </Heading>
                  <Text
                    fontSize="lg"
                    color={textColor}
                    lineHeight="tall"
                    whiteSpace="pre-line"
                  >
                    {section.content}
                  </Text>
                  {index < articleContent.sections.length - 1 && (
                    <Divider my={8} />
                  )}
                </MotionBox>
              ))}
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default DetailedArticle; 