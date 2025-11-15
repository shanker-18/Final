import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Input,
  VStack,
  HStack,
  Select,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';

const MotionBox = motion(Box);
const MotionInput = motion(Input);
const MotionTag = motion(Tag);

const ProjectSearch = ({ 
  onSearch, 
  technologies = [], 
  initialSearchTerm = '',
  initialTechnologies = []
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedTech, setSelectedTech] = useState(initialTechnologies);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term, techs) => {
      onSearch({
        searchTerm: term,
        technologies: techs,
      });
    }, 300),
    [onSearch]
  );

  // Trigger search when component mounts with initial values
  useEffect(() => {
    if (initialSearchTerm || initialTechnologies.length > 0) {
      debouncedSearch(initialSearchTerm, initialTechnologies);
    }
  }, []);

  // Trigger search when inputs change
  useEffect(() => {
    debouncedSearch(searchTerm, selectedTech);
    return () => debouncedSearch.cancel();
  }, [searchTerm, selectedTech, debouncedSearch]);

  const handleTechSelect = (tech) => {
    if (!selectedTech.includes(tech)) {
      const newTech = [...selectedTech, tech];
      setSelectedTech(newTech);
    }
  };

  const handleTechRemove = (tech) => {
    const newTech = selectedTech.filter((t) => t !== tech);
    setSelectedTech(newTech);
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      bg="gray.900"
      p={6}
      borderRadius="xl"
      boxShadow="xl"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor="whiteAlpha.200"
    >
      <VStack spacing={4} width="100%">
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gold.400" />
          </InputLeftElement>
          <MotionInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by title, description, or technologies..."
            size="lg"
            bg="gray.800"
            color="white"
            border="2px solid"
            borderColor="gray.700"
            _hover={{ borderColor: "gold.400" }}
            _focus={{ 
              borderColor: "gold.400", 
              boxShadow: "0 0 0 1px var(--chakra-colors-gold-400)"
            }}
            _placeholder={{ color: "gray.400" }}
            initial={{ scale: 0.98 }}
            whileFocus={{ scale: 1 }}
          />
        </InputGroup>

        <Divider borderColor="whiteAlpha.200" />

        <HStack spacing={4} width="100%">
          <Box flex="1">
            <Text mb={2} fontSize="sm" color="gray.300" fontWeight="medium">
              Filter by Technology
            </Text>
            <Select
              placeholder="Select technology"
              onChange={(e) => handleTechSelect(e.target.value)}
              bg="gray.800"
              color="white"
              border="2px solid"
              borderColor="gray.700"
              _hover={{ borderColor: "gold.400" }}
              _focus={{ 
                borderColor: "gold.400",
                boxShadow: "0 0 0 1px var(--chakra-colors-gold-400)"
              }}
              icon={<SearchIcon />}
              iconColor="gold.400"
            >
              {technologies
                .filter(tech => !selectedTech.includes(tech))
                .map((tech) => (
                  <option 
                    key={tech} 
                    value={tech} 
                    style={{ 
                      background: '#1A202C',
                      color: 'white',
                      padding: '8px'
                    }}
                  >
                    {tech}
                  </option>
                ))}
            </Select>
          </Box>
        </HStack>

        {selectedTech.length > 0 && (
          <Wrap spacing={2} width="100%">
            {selectedTech.map((tech) => (
              <WrapItem key={tech}>
                <MotionTag
                  size="lg"
                  borderRadius="full"
                  variant="subtle"
                  colorScheme="gold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  px={4}
                  py={2}
                >
                  <TagLabel>{tech}</TagLabel>
                  <TagCloseButton 
                    onClick={() => handleTechRemove(tech)}
                    ml={2}
                  />
                </MotionTag>
              </WrapItem>
            ))}
          </Wrap>
        )}
      </VStack>
    </MotionBox>
  );
};

export default ProjectSearch;