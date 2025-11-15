import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Container, Heading, Text, Grid, Stack, Tag, Button, Input, Select, Icon, useColorModeValue } from '@chakra-ui/react';
import { SearchIcon, TimeIcon, StarIcon } from '@chakra-ui/icons';
import { keyframes } from '@emotion/react';

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const FindWork = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    fetchJobs();
    const timeout = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://remoteok.io/api');
      const data = await response.json();
      setJobs(data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Box 
      minH="100vh" 
      bg="gray.900"
      pt={{ base: "72px", md: "96px" }}
      position="relative"
      overflow="hidden"
    >
      {/* Background Text - More transparent and smaller */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="100%"
        textAlign="center"
        zIndex={0}
        opacity={0.08}
      >
        <Text
          fontSize={{ base: "12vw", md: "15vw" }}
          fontWeight="900"
          color="#FFD700"
          letterSpacing="normal"
          whiteSpace="nowrap"
        >
          Freelance Hub
        </Text>
      </Box>

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <AnimatePresence>
          {showContent && (
            <Stack spacing={12}>
              {/* Animated Header Section */}
              <Stack spacing={6} textAlign="center">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={headingVariants}
                >
                  <Heading
                    fontSize={{ base: "4xl", md: "6xl" }}
                    bgGradient="linear(to-r, gold.200, gold.400)"
                    bgClip="text"
                    letterSpacing="tight"
                  >
                    Find Your Next Opportunity
                  </Heading>
                </motion.div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  transition={{ delay: 0.3 }}
                >
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    color="whiteAlpha.900"
                  >
                    Discover thousands of remote opportunities worldwide
                  </Text>
                </motion.div>
              </Stack>

              {/* Search Section with Animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Box
                  p={8}
                  bg="whiteAlpha.100"
                  borderRadius="2xl"
                  backdropFilter="blur(10px)"
                  boxShadow="lg"
                >
                  <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                    <Input
                      placeholder="Search jobs..."
                      bg="whiteAlpha.200"
                      border="none"
                      _placeholder={{ color: "whiteAlpha.500" }}
                      color="white"
                      fontSize="lg"
                      height="56px"
                    />
                    <Select
                      placeholder="Category"
                      bg="whiteAlpha.200"
                      border="none"
                      color="white"
                      fontSize="lg"
                      height="56px"
                    >
                      <option value="web">Web Development</option>
                      <option value="mobile">Mobile Development</option>
                      <option value="design">Design</option>
                    </Select>
                    <Button
                      leftIcon={<SearchIcon />}
                      bg="gold.400"
                      color="gray.900"
                      _hover={{ bg: "gold.500" }}
                      fontSize="lg"
                      height="56px"
                      px={8}
                    >
                      Search
                    </Button>
                  </Stack>
                </Box>
              </motion.div>

              {/* Jobs Grid with Staggered Animation */}
              <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={8}>
                {loading ? (
                  [...Array(6)].map((_, idx) => (
                    <JobSkeleton key={idx} />
                  ))
                ) : (
                  jobs.map((job, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + (idx * 0.1) }}
                    >
                      <JobCard job={job} />
                    </motion.div>
                  ))
                )}
              </Grid>
            </Stack>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

const JobCard = ({ job }) => (
  <Box
    bg="whiteAlpha.100"
    p={8}
    borderRadius="2xl"
    backdropFilter="blur(10px)"
    position="relative"
    overflow="hidden"
    transition="all 0.3s"
    _hover={{
      transform: "translateY(-5px)",
      boxShadow: "0 0 30px rgba(255, 215, 0, 0.1)",
    }}
  >
    <Stack spacing={4}>
      <Stack direction="row" justify="space-between" align="start">
        <Stack spacing={2}>
          <Heading size="md" color="white">
            {job.position}
          </Heading>
          <Text color="whiteAlpha.700">
            {job.company}
          </Text>
        </Stack>
        <Tag colorScheme="yellow" size="lg">
          {job.salary}
        </Tag>
      </Stack>

      <Text color="whiteAlpha.800" noOfLines={3}>
        {job.description}
      </Text>

      <Stack direction="row" spacing={4}>
        {job.tags?.map((tag, idx) => (
          <Tag key={idx} colorScheme="blue" size="sm">
            {tag}
          </Tag>
        ))}
      </Stack>

      <Stack direction="row" justify="space-between" align="center">
        <Stack direction="row" align="center" spacing={2} color="whiteAlpha.700">
          <TimeIcon />
          <Text fontSize="sm">Posted {job.postedAt}</Text>
        </Stack>
        <Button
          variant="outline"
          borderColor="gold.400"
          color="gold.400"
          _hover={{ bg: "whiteAlpha.100" }}
        >
          Apply Now
        </Button>
      </Stack>
    </Stack>
  </Box>
);

const JobSkeleton = () => (
  <Box
    bg="whiteAlpha.100"
    p={6}
    borderRadius="xl"
    position="relative"
    overflow="hidden"
  >
    <Stack spacing={4}>
      <Box
        h="24px"
        w="60%"
        bg="whiteAlpha.200"
        borderRadius="md"
        sx={{
          animation: `${shimmer} 2s infinite linear`,
          backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          backgroundSize: '1000px 100%',
        }}
      />
      <Box
        h="20px"
        w="40%"
        bg="whiteAlpha.200"
        borderRadius="md"
        sx={{
          animation: `${shimmer} 2s infinite linear`,
          backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          backgroundSize: '1000px 100%',
        }}
      />
      <Box
        h="60px"
        w="100%"
        bg="whiteAlpha.200"
        borderRadius="md"
        sx={{
          animation: `${shimmer} 2s infinite linear`,
          backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          backgroundSize: '1000px 100%',
        }}
      />
    </Stack>
  </Box>
);

export default FindWork; 