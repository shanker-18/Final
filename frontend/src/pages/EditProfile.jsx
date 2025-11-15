import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  IconButton,
  useToast,
  Text,
  Divider,
  Textarea,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const MotionBox = motion.create(Box);

const EditProfile = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    country: '',
    bio: '',
    companyName: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/auth');
          return;
        }

        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.data() || {};

        setUserData({
          name: data.firstName || data.name || user.displayName || '',
          email: user.email || '',
          country: data.country || '',
          bio: data.bio || '',
          companyName: data.companyName || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error fetching profile',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      }
    };

    fetchUserData();
  }, [navigate, toast]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      
      // Update auth profile display name
      await updateProfile(user, {
        displayName: userData.name,
      });

      // Update Firestore data
      await updateDoc(doc(db, 'users', user.uid), {
        name: userData.name,
        country: userData.country,
        bio: userData.bio,
        companyName: userData.companyName,
        updatedAt: new Date(),
      });

      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
      });

      navigate(-1);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      minH="100vh"
      bg="dark.900"
      pt={{ base: 4, md: 28 }}
      pb={{ base: 4, md: 20 }}
    >
      <Container maxW={{ base: '100vw', md: 'container.md' }} px={{ base: 2, md: 0 }}>
        <VStack spacing={{ base: 4, md: 8 }} align="stretch">
          <HStack justify="space-between" w="full">
            <IconButton
              icon={<FaArrowLeft />}
              onClick={() => navigate(-1)}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              size={{ base: 'md', md: 'lg' }}
            />
            <Heading color="white" size={{ base: 'md', md: 'lg' }} textAlign="center" flex={1}>
              Edit Profile
            </Heading>
            <Box w={{ base: 8, md: 10 }} /> {/* Spacer */}
          </HStack>

          <Divider borderColor="whiteAlpha.200" />

          <VStack as="form" onSubmit={handleSubmit} spacing={{ base: 4, md: 8 }} w="full">
            {/* Basic Information */}
            <VStack spacing={{ base: 4, md: 6 }} w="full">
              <FormControl w="full">
                <FormLabel color="white">Name</FormLabel>
                <Input
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  bg="whiteAlpha.100"
                  color="white"
                  fontSize={{ base: 'sm', md: 'md' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="white">Email</FormLabel>
                <Input
                  value={userData.email}
                  isReadOnly
                  bg="whiteAlpha.50"
                  color="whiteAlpha.700"
                  fontSize={{ base: 'sm', md: 'md' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="white">Country</FormLabel>
                <Input
                  value={userData.country}
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    country: e.target.value
                  }))}
                  bg="whiteAlpha.100"
                  color="white"
                  fontSize={{ base: 'sm', md: 'md' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="white">Bio</FormLabel>
                <Textarea
                  value={userData.bio}
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    bio: e.target.value
                  }))}
                  bg="whiteAlpha.100"
                  color="white"
                  rows={4}
                  fontSize={{ base: 'sm', md: 'md' }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="white">Company Name</FormLabel>
                <Input
                  value={userData.companyName}
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    companyName: e.target.value
                  }))}
                  bg="whiteAlpha.100"
                  color="white"
                  fontSize={{ base: 'sm', md: 'md' }}
                />
              </FormControl>
            </VStack>

            <Button
              type="submit"
              colorScheme="gold"
              size={{ base: 'md', md: 'lg' }}
              w="full"
              isLoading={loading}
              fontSize={{ base: 'md', md: 'lg' }}
            >
              Save Changes
            </Button>
          </VStack>
        </VStack>
      </Container>
    </MotionBox>
  );
};

export default EditProfile;