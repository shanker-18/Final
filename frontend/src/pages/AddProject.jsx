import React, { useState } from 'react';
import { Box, Button, Input, Textarea, FormControl, FormLabel, VStack, useToast } from '@chakra-ui/react';

const AddProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your backend POST logic here
    toast({ title: 'Project submitted!', status: 'success' });
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Project Name</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          {/* Add more fields as needed */}
          <Button type="submit" colorScheme="gold">
            Submit Project
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddProject; 