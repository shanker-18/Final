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
  Avatar,
  IconButton,
  useToast,
  Text,
  Divider,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCamera, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// External auth and storage removed; OTP/profile updates are disabled in this build.
import { sendOtpToPhone, verifyPhoneOtp, sendOtpToEmail, verifyEmailOtp } from '../utils/otpService';

const MotionBox = motion.create(Box);

const EditProfile = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    photoURL: '',
  });

  // OTP States
  const [otpPhone, setOtpPhone] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpSentPhone, setOtpSentPhone] = useState(false);
  const [otpSentEmail, setOtpSentEmail] = useState(false);
  const [verificationId, setVerificationId] = useState(''); // Store verification ID
  const [confirmationResult, setConfirmationResult] = useState(null); // Store confirmation result for phone verification

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.data() || {};

        setUserData({
          displayName: user.displayName || '',
          email: user.email || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          skills: data.skills || '',
          photoURL: user.photoURL || '',
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const user = auth.currentUser;
      
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `profile_images/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      // Update auth profile
      await updateProfile(user, { photoURL });

      // Update state
      setUserData(prev => ({ ...prev, photoURL }));

      toast({
        title: 'Profile photo updated',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating profile image:', error);
      toast({
        title: 'Error updating photo',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      
      // Update auth profile
      await updateProfile(user, {
        displayName: userData.displayName,
      });

      // Update Firestore data
      await updateDoc(doc(db, 'users', user.uid), {
        phone: userData.phone,
        location: userData.location,
        bio: userData.bio,
        skills: userData.skills,
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

  const validatePhoneNumber = (phoneNumber) => {
    // Basic validation for phone number format
    const phoneRegex = /^[0-9]{10}$/; // Adjust regex as needed for your requirements
    return phoneRegex.test(phoneNumber);
  };

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log("reCAPTCHA verified successfully!", response);
      },
      'expired-callback': () => {
        console.log("reCAPTCHA expired. Resetting...");
        setupRecaptcha();
      }
    }, auth);
  };

  const sendOTP = async () => {
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, userData.phone, appVerifier);
      setConfirmationResult(confirmationResult);
      setOtpSentPhone(true);
      toast({ title: 'OTP sent to phone', status: 'success' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({ title: 'Error sending OTP', description: error.message || 'An unknown error occurred', status: 'error' });
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otpPhone);
        if (result.user) {
          setIsPhoneVerified(true);
          toast({ title: 'Phone verified successfully', status: 'success' });
        }
      }
    } catch (error) {
      console.error('Error verifying phone OTP:', error);
      toast({ title: 'OTP verification failed', description: error.message, status: 'error' });
    }
  };

  const verifyOTP = async (type) => {
    try {
      if (type === 'email') {
        const success = await verifyEmailOtp(userData.email, otpEmail);
        if (success) {
          setIsEmailVerified(true);
          toast({ title: 'Email verified successfully', status: 'success' });
        }
      }
    } catch (error) {
      toast({ title: 'OTP verification failed', description: error.message, status: 'error' });
    }
  };

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
            <Heading color="white" size="lg">Edit Profile</Heading>
            <Box w={10} /> {/* Spacer */}
          </HStack>

          <Divider borderColor="whiteAlpha.200" />

          <VStack as="form" onSubmit={handleSubmit} spacing={8}>
            <div id="recaptcha-container"></div>
            {/* Profile Photo */}
            <VStack>
              <Box position="relative">
                <Avatar
                  size="2xl"
                  src={userData.photoURL}
                  name={userData.displayName}
                />
                <IconButton
                  icon={<FaCamera />}
                  size="sm"
                  rounded="full"
                  position="absolute"
                  bottom={0}
                  right={0}
                  colorScheme="gold"
                  onClick={() => document.getElementById('imageInput').click()}
                />
                <Input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  display="none"
                  onChange={handleImageChange}
                />
              </Box>
              <Text color="whiteAlpha.600" fontSize="sm">
                Click the camera icon to change profile photo
              </Text>
            </VStack>

            {/* Form Fields */}
            <VStack spacing={6} w="full">
              <FormControl>
                <FormLabel color="white">Full Name</FormLabel>
                <Input
                  value={userData.displayName}
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    displayName: e.target.value
                  }))}
                  bg="whiteAlpha.100"
                  border="none"
                  color="white"
                />
              </FormControl>

              <FormControl>
                <FormLabel color="white">Email</FormLabel>
                <HStack>
                  <Input
                    value={userData.email}
                    isReadOnly
                    bg="whiteAlpha.50"
                    border="none"
                    color="whiteAlpha.700"
                  />
                  {isEmailVerified ? (
                    <Text color="green.400">Verified</Text>
                  ) : (
                    <Button colorScheme="blue" size="sm" onClick={() => sendOTP('email')}>
                      {otpSentEmail ? 'Resend OTP' : 'Verify'}
                    </Button>
                  )}
                </HStack>
                {otpSentEmail && (
                  <HStack>
                    <Input
                      placeholder="Enter OTP"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                    />
                    <Button colorScheme="green" size="sm" onClick={() => verifyOTP('email')}>
                      Submit OTP
                    </Button>
                  </HStack>
                )}
              </FormControl>

              <FormControl>
                <FormLabel color="white">Phone</FormLabel>
                <HStack>
                  <Input
                    value={userData.phone}
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))}
                    bg="whiteAlpha.100"
                    border="none"
                    color="white"
                  />
                  {isPhoneVerified ? (
                    <Text color="green.400">Verified</Text>
                  ) : (
                    <Button colorScheme="blue" size="sm" onClick={sendOTP}>
                      {otpSentPhone ? 'Resend OTP' : 'Verify'}
                    </Button>
                  )}
                </HStack>
                {otpSentPhone && (
                  <HStack>
                    <Input
                      placeholder="Enter OTP"
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value)}
                    />
                    <Button colorScheme="green" size="sm" onClick={handleVerifyCode}>
                      Submit OTP
                    </Button>
                  </HStack>
                )}
              </FormControl>

              <FormControl>
                <FormLabel color="white">Location</FormLabel>
                <Input
                  value={userData.location}
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    location: e.target.value
                  }))}
                  bg="whiteAlpha.100"
                  border="none"
                  color="white"
                />
              </FormControl>

              <FormControl>
                <FormLabel color="white">Bio</FormLabel>
                <Input
                  value={userData.bio}
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    bio: e.target.value
                  }))}
                  bg="whiteAlpha.100"
                  border="none"
                  color="white"
                />
              </FormControl>

              <FormControl>
                <FormLabel color="white">Skills</FormLabel>
                <Input
                  value={userData.skills}
                  onChange={(e) => setUserData(prev => ({
                    ...prev,
                    skills: e.target.value
                  }))}
                  bg="whiteAlpha.100"
                  border="none"
                  color="white"
                  placeholder="e.g., React, Node.js, UI/UX Design"
                />
              </FormControl>
            </VStack>

            <Button
              type="submit"
              colorScheme="gold"
              size="lg"
              w="full"
              isLoading={loading}
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