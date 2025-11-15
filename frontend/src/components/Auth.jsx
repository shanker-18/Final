case 3:
  return formData.role === 'developer' ? (
    <VStack spacing={8} pb={8}>
      <FormControl isInvalid={errors.primarySkills}>
        <FormLabel color="gray.800">Primary Skills (comma-separated)</FormLabel>
        <Input
          value={formData.primarySkills}
          onChange={(e) => setFormData({ ...formData, primarySkills: e.target.value })}
          placeholder="e.g., React, Node.js, Python"
          bg="white"
          color="gray.800"
          _placeholder={{ color: "gray.500" }}
          _focus={{
            borderColor: "gray.300",
            boxShadow: "0 0 0 1px gray.300"
          }}
          fontSize="md"
          p={6}
          border="1px solid"
          borderColor="gray.200"
        />
        <FormErrorMessage>{errors.primarySkills}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.yearsOfExperience}>
        <FormLabel color="gray.800">Years of Experience</FormLabel>
        <Select
          value={formData.yearsOfExperience}
          onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
          bg="white"
          color="gray.800"
          _focus={{
            borderColor: "gray.300",
            boxShadow: "0 0 0 1px gray.300"
          }}
          fontSize="md"
          p={2}
          h="50px"
          border="1px solid"
          borderColor="gray.200"
        >
          <option value="" style={{ backgroundColor: "white", color: "gray.800" }}>Select experience</option>
          <option value="0-1" style={{ backgroundColor: "white", color: "gray.800" }}>Less than 1 year</option>
          <option value="1-3" style={{ backgroundColor: "white", color: "gray.800" }}>1-3 years</option>
          <option value="3-5" style={{ backgroundColor: "white", color: "gray.800" }}>3-5 years</option>
          <option value="5-10" style={{ backgroundColor: "white", color: "gray.800" }}>5-10 years</option>
          <option value="10+" style={{ backgroundColor: "white", color: "gray.800" }}>10+ years</option>
        </Select>
        <FormErrorMessage>{errors.yearsOfExperience}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel color="gray.800">GitHub Profile</FormLabel>
        <Input
          value={formData.githubProfile}
          onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
          placeholder="https://github.com/username"
          bg="white"
          color="gray.800"
          _placeholder={{ color: "gray.500" }}
          _focus={{
            borderColor: "gray.300",
            boxShadow: "0 0 0 1px gray.300"
          }}
          fontSize="md"
          p={6}
          border="1px solid"
          borderColor="gray.200"
        />
      </FormControl>

      <FormControl>
        <FormLabel color="gray.800">Portfolio URL</FormLabel>
        <Input
          value={formData.portfolioUrl}
          onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
          placeholder="https://your-portfolio.com"
          bg="white"
          color="gray.800"
          _placeholder={{ color: "gray.500" }}
          _focus={{
            borderColor: "gray.300",
            boxShadow: "0 0 0 1px gray.300"
          }}
          fontSize="md"
          p={6}
          border="1px solid"
          borderColor="gray.200"
        />
      </FormControl>

      <FormControl isInvalid={errors.preferredWorkType}>
        <FormLabel color="gray.800">Preferred Work Type</FormLabel>
        <Select
          value={formData.preferredWorkType}
          onChange={(e) => setFormData({ ...formData, preferredWorkType: e.target.value })}
          bg="white"
          color="gray.800"
          _focus={{
            borderColor: "gray.300",
            boxShadow: "0 0 0 1px gray.300"
          }}
          fontSize="md"
          p={2}
          h="50px"
          border="1px solid"
          borderColor="gray.200"
        >
          <option value="" style={{ backgroundColor: "white", color: "gray.800" }}>Select work type</option>
          <option value="full-time" style={{ backgroundColor: "white", color: "gray.800" }}>Full-time</option>
          <option value="part-time" style={{ backgroundColor: "white", color: "gray.800" }}>Part-time</option>
          <option value="contract" style={{ backgroundColor: "white", color: "gray.800" }}>Contract</option>
          <option value="freelance" style={{ backgroundColor: "white", color: "gray.800" }}>Freelance</option>
        </Select>
        <FormErrorMessage>{errors.preferredWorkType}</FormErrorMessage>
      </FormControl>
    </VStack>
  ) : (
    // ... existing seeker form code ...
  ); 