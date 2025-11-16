import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Avatar,
  Divider,
  useToast,
  Flex,
  Badge,
  Heading,
  InputGroup,
  InputLeftElement,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  List,
  ListItem,
  Center,
  Button,
  Icon as ChakraIcon,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  SimpleGrid,
  CircularProgress,
  CircularProgressLabel
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPaperPlane, 
  FaSmile, 
  FaPaperclip, 
  FaCheck, 
  FaCheckDouble, 
  FaSearch, 
  FaTimes, 
  FaEllipsisV, 
  FaPlay, 
  FaPhone, 
  FaVideo, 
  FaPhoneSlash, 
  FaMicrophone, 
  FaMicrophoneSlash,
  FaHeart,
  FaThumbsUp,
  FaLaugh,
  FaSadTear,
  FaAngry,
  FaSurprise,
  FaReply,
  FaForward,
  FaCopy,
  FaDownload,
  FaImage,
  FaFileAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaMicrophoneAlt,
  FaVideoSlash
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { userChatApi } from '../services/api';

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionVStack = motion.create(VStack);

// Update gradient styles
const gradientBg = "linear-gradient(135deg, #1E1E2E 0%, #2D2D44 100%)";
const sidebarGradient = "linear-gradient(180deg, #2A2A3F 0%, #1E1E2E 100%)";
const messageAreaGradient = "linear-gradient(180deg, #2D2D44 0%, #1E1E2E 100%)";
const selectedChatBg = "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)";
const hoverBg = "linear-gradient(90deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)";
const myMessageGradient = "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)";
const otherMessageGradient = "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)";

const messageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -10 }
};

const ChatRoom = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ exact: [], similar: [] });
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [thumbnailError, setThumbnailError] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesContainerRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState('idle'); // 'idle', 'ringing', 'ongoing'
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [lastSeen, setLastSeen] = useState({});
  const [localVideoEnabled, setLocalVideoEnabled] = useState(true);
  const [localAudioEnabled, setLocalAudioEnabled] = useState(true);
  const [callError, setCallError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageReactions, setMessageReactions] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const typingTimeoutRef = useRef(null);

  // Search for other users to chat with (WhatsApp-style contact search)
  const handleSearch = async (e) => {
    const queryText = e.target.value;
    setSearchQuery(queryText);

    const trimmedQuery = queryText.trim().toLowerCase();
    if (!trimmedQuery) {
      // Empty search box – clear results
      setSearchResults({ exact: [], similar: [] });
      return;
    }

    try {
      // Firestore users collection (main Firebase project)
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);

      const allUsers = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== auth.currentUser?.uid);

      if (allUsers.length === 0) {
        toast({
          title: 'No Other Users',
          description: 'You are the only registered user. Ask someone else to sign up to start chatting.',
          status: 'info',
          duration: 3000,
        });
        setSearchResults({ exact: [], similar: [] });
        return;
      }

      const normalizeName = (user) => (
        (user.displayName || user.name || '').toLowerCase().trim()
      );

      const exactMatches = allUsers.filter(user => {
        const displayName = normalizeName(user);
        return displayName === trimmedQuery;
      });

      const similarUsers = allUsers.filter(user => {
        const displayName = normalizeName(user);
        const searchTerms = trimmedQuery.split(/\s+/);
        return searchTerms.some(term => term && displayName.includes(term));
      });

      // Do not spam toasts on each keypress; just show "No users found" in the UI
      // when both lists are empty.

      setSearchResults({
        exact: exactMatches,
        similar: similarUsers
          .filter(user => !exactMatches.some(exact => exact.id === user.id))
          .slice(0, 5),
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: 'Error',
        description: 'Failed to search users. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const createChatWithUser = async (selectedUser) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !selectedUser?.id) {
      toast({
        title: "Error",
        description: "Invalid user data",
        status: "error",
        duration: 3000
      });
      return;
    }

    // Prevent creating chat with self
    if (currentUser.uid === selectedUser.id) {
      toast({
        title: "Error",
        description: "You cannot start a chat with yourself",
        status: "error",
        duration: 3000
      });
      return;
    }

    try {
      const result = await userChatApi.createOrGetConversation(currentUser.uid, selectedUser);

      if (!result || !result.success || !result.conversation) {
        throw new Error(result?.message || 'Conversation not created');
      }

      const convo = result.conversation;
      const otherId = selectedUser.id;
      const info = (convo.participantInfo && convo.participantInfo[otherId]) || {};

      setSelectedChat({
        id: convo._id,
        user: {
          id: otherId,
          name: info.displayName || selectedUser.displayName || selectedUser.name || 'Unknown User',
          displayName: info.displayName || selectedUser.displayName || selectedUser.name || 'Unknown User',
          photoURL: info.photoURL || selectedUser.photoURL || '',
          email: info.email || selectedUser.email,
        },
      });
      onClose();
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: "Error",
        description: "Failed to create chat: " + error.message,
        status: "error",
        duration: 3000
      });
    }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please login to access the chat room",
        status: "warning",
        duration: 3000,
      });
      navigate('/login');
      return;
    }

    // Initialize chat with developer if provided in navigation state
    const initializeChat = async () => {
      if (location.state?.selectedDeveloper) {
        try {
          await createChatWithUser(location.state.selectedDeveloper);
        } catch (error) {
          console.error('Error initializing chat with developer:', error);
          toast({
            title: 'Error',
            description: 'Failed to open chat with developer',
            status: 'error',
            duration: 3000,
          });
        }
      }
    };

    initializeChat();

    // Load user's conversations from Mongo
    const loadChats = async () => {
      try {
        const { conversations } = await userChatApi.getConversations(currentUser.uid);
        const chatsList = conversations.map((convo) => {
          const otherUserId = convo.participants.find((id) => id !== currentUser.uid);
          const info = (convo.participantInfo && convo.participantInfo[otherUserId]) || {};
          return {
            id: convo._id,
            user: {
              id: otherUserId,
              name: info.displayName || 'Unknown User',
              photoURL: info.photoURL || '',
              displayName: info.displayName || 'Unknown User',
              email: info.email,
            },
            lastMessage: convo.lastMessage,
            lastMessageTime: convo.lastMessageTime
              ? { toDate: () => new Date(convo.lastMessageTime) }
              : null,
          };
        });

        setChats(chatsList);
      } catch (error) {
        console.error('Error processing chat data:', error);
        toast({
          title: "Error",
          description: "Failed to load chats",
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [navigate, toast, location.state]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedChat?.id) return;

    const fetchMessages = async () => {
      try {
        const { messages: apiMessages } = await userChatApi.getMessages(selectedChat.id);
        const mapped = apiMessages.map((m) => ({
          id: m._id,
          text: m.text,
          senderId: m.senderId,
          senderName: m.senderName,
          timestamp: { toDate: () => new Date(m.createdAt) },
          delivered: m.delivered,
          read: m.read,
        }));
        setMessages(mapped);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages',
          status: 'error',
          duration: 5000,
        });
      }
    };

    fetchMessages();
  }, [navigate, toast, selectedChat?.id]);

  // Handle typing indicators
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!selectedChat) return;
    
    // Set typing status
    if (!isTyping) {
      setIsTyping(true);
      updateTypingStatus(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateTypingStatus(false);
    }, 2000);
  };

  // Ensure pressing Enter sends the FULL message once, and typing alone
  // never sends anything.
  const handleMessageKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Use the current input value instead of relying on possibly stale state
      handleSendMessage(null, e.currentTarget.value);
    }
  };
  
  const updateTypingStatus = async (_typing) => {
    // Typing indicators are not yet implemented for Mongo backend.
  };

  // Send a message either from the stored state or an explicit text
  // (used when sending on Enter so we don't lose the last character).
  const handleSendMessage = async (e, overrideText) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const text = (overrideText ?? newMessage).trim();
    if (!text || !selectedChat || !auth.currentUser) return;

    // Clear typing indicator
    setIsTyping(false);
    updateTypingStatus(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      // Validate selectedChat has required properties
      if (!selectedChat.id || !selectedChat.user?.id) {
        throw new Error('Invalid chat or user data');
      }

      const currentUser = auth.currentUser;
      await userChatApi.sendMessage(selectedChat.id, {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email || 'User',
        text,
      });

      setNewMessage('');

      // Refresh messages after sending
      const { messages: apiMessages } = await userChatApi.getMessages(selectedChat.id);
      const mapped = apiMessages.map((m) => ({
        id: m._id,
        text: m.text,
        senderId: m.senderId,
        senderName: m.senderName,
        timestamp: { toDate: () => new Date(m.createdAt) },
        delivered: m.delivered,
        read: m.read,
      }));
      setMessages(mapped);
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const VideoThumbnail = ({ videoId, thumbnail }) => {
    const [showVideo, setShowVideo] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [thumbnailError, setThumbnailError] = useState(false);
    const videoRef = useRef(null);
    
    useEffect(() => {
      // If we have a direct thumbnail URL, try to load it
      if (thumbnail) {
        const img = new Image();
        img.onload = () => setThumbnailError(false);
        img.onerror = () => setThumbnailError(true);
        img.src = thumbnail;
      } else {
        setThumbnailError(true);
      }
    }, [thumbnail]);
    
    const handlePlay = () => {
      setIsLoading(true);
      setShowVideo(true);
      
      if (videoRef.current) {
        videoRef.current.addEventListener('loadeddata', () => {
          setIsLoading(false);
        });
        
        videoRef.current.addEventListener('error', () => {
          setIsLoading(false);
          setShowVideo(false);
          toast({
            title: "Error",
            description: "Failed to load video",
            status: "error",
            duration: 3000
          });
        });
      }
    };
    
    if (!showVideo) {
      return (
        <Box 
          w="full" 
          h="200px" 
          rounded="lg" 
          overflow="hidden"
          position="relative"
          cursor="pointer"
          onClick={handlePlay}
          bg="gray.900"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {thumbnailError ? (
            <VStack spacing={2} p={4}>
              <ChakraIcon 
                as={FaPlay} 
                color="whiteAlpha.800" 
                boxSize={8}
              />
              <Text color="whiteAlpha.800" fontSize="sm" textAlign="center">
                Click to Play Video
              </Text>
            </VStack>
          ) : (
            <Box
              w="full"
              h="full"
              backgroundImage={`url(${thumbnail})`}
              backgroundSize="cover"
              backgroundPosition="center"
              position="relative"
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.500"
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.3s"
                _hover={{ bg: "blackAlpha.700" }}
              >
                <ChakraIcon 
                  as={FaPlay} 
                  color="white" 
                  boxSize={12} 
                  opacity={0.8}
                  transition="all 0.3s"
                  _hover={{ transform: "scale(1.1)", opacity: 1 }}
                />
              </Box>
            </Box>
          )}
        </Box>
      );
    }
    
    return (
      <Box w="full" h="200px" rounded="lg" overflow="hidden" position="relative">
        {isLoading && (
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="blackAlpha.700"
            zIndex={1}
          >
            <Spinner size="xl" color="white" thickness="4px" />
          </Box>
        )}
        <video
          ref={videoRef}
          controls
          autoPlay
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          preload="metadata"
        >
          <source src={videoId} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>
    );
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
      if (isAtBottom) {
        scrollToBottom();
      }
    }
  };

  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        {
          urls: 'turn:numb.viagenie.ca',
          username: 'webrtc@live.com',
          credential: 'muazkh'
        }
      ],
      bundlePolicy: 'balanced',
      rtcpMuxPolicy: 'require',
      iceTransportPolicy: 'all',
      iceCandidatePoolSize: 10
    };

    const pc = new RTCPeerConnection(configuration);

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      console.log('Received remote track:', event.streams[0]);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      }
    };

    // Handle ICE connection state changes
    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
      switch(pc.iceConnectionState) {
        case 'connected':
          toast({
            title: "Call Connected",
            description: "Media connection established",
            status: "success",
            duration: 3000,
          });
          break;
        case 'failed':
          toast({
            title: "Connection Failed",
            description: "Unable to establish media connection",
            status: "error",
            duration: 3000,
          });
          handleEndCall();
          break;
        case 'disconnected':
          toast({
            title: "Disconnected",
            description: "Media connection lost",
            status: "warning",
            duration: 3000,
          });
          break;
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      switch(pc.connectionState) {
        case 'connected':
          setCallStatus('ongoing');
          break;
        case 'failed':
        case 'disconnected':
          handleEndCall();
          break;
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = async (event) => {
      if (!event.candidate) return;

      try {
        const activeCalls = await getDocs(
          query(
            collection(chatDb, 'calls'),
            where('status', 'in', ['ringing', 'ongoing']),
            where('users', 'array-contains', auth.currentUser.uid)
          )
        );

        if (!activeCalls.empty) {
          const callDoc = activeCalls.docs[0];
          await updateDoc(doc(chatDb, 'calls', callDoc.id), {
            candidates: arrayUnion(event.candidate.toJSON())
          });
        }
      } catch (error) {
        console.error('Error sending ICE candidate:', error);
      }
    };

    // Handle negotiation needed
    pc.onnegotiationneeded = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const activeCalls = await getDocs(
          query(
            collection(chatDb, 'calls'),
            where('status', 'in', ['ringing', 'ongoing']),
            where('users', 'array-contains', auth.currentUser.uid)
          )
        );

        if (!activeCalls.empty) {
          const callDoc = activeCalls.docs[0];
          await updateDoc(doc(chatDb, 'calls', callDoc.id), {
            offer: {
              type: pc.localDescription.type,
              sdp: pc.localDescription.sdp
            }
          });
        }
      } catch (error) {
        console.error('Error during negotiation:', error);
      }
    };

    peerConnection.current = pc;
    return pc;
  };

  const startLocalStream = async (isVideo) => {
    try {
      // First, ensure any existing streams are properly cleaned up
      await handleEndCall();
      
      // Wait a moment for devices to be released
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to get the media stream with retries
      let stream = null;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries && !stream) {
        try {
          const constraints = {
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            },
            video: isVideo ? {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user",
              frameRate: { ideal: 30 }
            } : false
          };

          stream = await navigator.mediaDevices.getUserMedia(constraints);
          break;
        } catch (error) {
          retryCount++;
          console.log(`Attempt ${retryCount} failed:`, error.name);
          
          if (error.name === 'NotReadableError' || error.name === 'AbortError') {
            // Device is in use, wait longer before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Force release of media devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            devices.forEach(device => {
              if (device.kind === 'videoinput' || device.kind === 'audioinput') {
                navigator.mediaDevices.getUserMedia({
                  [device.kind === 'videoinput' ? 'video' : 'audio']: {
                    deviceId: { exact: device.deviceId }
                  }
                }).then(s => {
                  s.getTracks().forEach(track => track.stop());
                }).catch(() => {});
              }
            });
            
            if (retryCount === maxRetries) {
              throw error;
            }
          } else {
            throw error;
          }
        }
      }

      if (!stream) {
        throw new Error('Failed to access media devices after multiple attempts');
      }

      // Clear existing streams
      if (localVideoRef.current) {
        if (localVideoRef.current.srcObject) {
          localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        localVideoRef.current.srcObject = null;
      }
      
      if (remoteVideoRef.current) {
        if (remoteVideoRef.current.srcObject) {
          remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        remoteVideoRef.current.srcObject = null;
      }

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      let errorMessage = 'Could not access camera/microphone';
      
      switch (error.name) {
        case 'NotAllowedError':
          errorMessage = 'Permission denied. Please allow access to camera/microphone.';
          break;
        case 'NotFoundError':
          errorMessage = 'No camera/microphone found. Please check your device.';
          break;
        case 'NotReadableError':
        case 'AbortError':
          errorMessage = 'Device is in use by another application. Please close other apps using the camera/microphone and try again.';
          break;
        case 'OverconstrainedError':
          errorMessage = 'Could not find suitable camera/microphone settings.';
          break;
        default:
          errorMessage = error.message || 'Could not access camera/microphone';
      }

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  const handleVideoCall = async () => {
    if (!selectedChat) return;
    
    try {
      // First, ensure any existing calls are ended
      await handleEndCall();
      
      // Start local video stream
      const stream = await startLocalStream(true);
      
      // Initialize WebRTC peer connection
      const pc = initializePeerConnection();
      
      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        try {
          pc.addTrack(track, stream);
        } catch (error) {
          console.error('Error adding track to peer connection:', error);
        }
      });

      // Create a unique call ID and reference
      const callId = `${auth.currentUser.uid}_${selectedChat.user.id}_${Date.now()}`;
      const callRef = doc(chatDb, 'calls', callId);

      // Create a call document in Firebase
      await setDoc(callRef, {
        id: callId,
        users: [auth.currentUser.uid, selectedChat.user.id],
        from: auth.currentUser.uid,
        to: selectedChat.user.id,
        type: 'video',
        status: 'ringing',
        timestamp: serverTimestamp(),
        offer: null,
        answer: null,
        candidates: []
      });

      // Create and set local description
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await pc.setLocalDescription(offer);
      
      // Store the offer in Firebase
      await updateDoc(callRef, {
        offer: {
          type: offer.type,
          sdp: offer.sdp
        }
      });

      setIsInCall(true);
      setCallStatus('ringing');
      
      // Listen for call status changes
      const unsubscribe = onSnapshot(callRef, async (snapshot) => {
        const data = snapshot.data();
        if (!data) return;

        console.log('Call status update:', data.status);

        switch (data.status) {
          case 'accepted':
            if (data.answer && !pc.currentRemoteDescription) {
              try {
                console.log('Setting remote description');
                const answerDescription = new RTCSessionDescription(data.answer);
                await pc.setRemoteDescription(answerDescription);
                
                if (data.candidates && data.candidates.length > 0) {
                  console.log('Adding ICE candidates');
                  for (const candidate of data.candidates) {
                    if (candidate && pc.remoteDescription) {
                      await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                  }
                }
                
                setCallStatus('ongoing');
              } catch (error) {
                console.error('Error in call acceptance:', error);
                handleEndCall(callId);
              }
            }
            break;

          case 'rejected':
            toast({
              title: "Call Rejected",
              description: "The other user rejected the call",
              status: "info",
              duration: 3000,
            });
            handleEndCall(callId);
            unsubscribe();
            break;

          case 'ended':
            handleEndCall(callId);
            unsubscribe();
            break;
        }
      });

      // Set a timeout for unanswered calls
      setTimeout(() => {
        if (callStatus === 'ringing') {
          toast({
            title: "No Answer",
            description: "Call was not answered",
            status: "info",
            duration: 3000,
          });
          handleEndCall(callId);
          unsubscribe();
        }
      }, 30000);

    } catch (error) {
      console.error('Error starting video call:', error);
      toast({
        title: "Call Failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleAudioCall = async () => {
    if (!selectedChat) return;
    
    try {
      // First, ensure any existing calls are ended
      await handleEndCall();
      
      // Start local audio stream
      const stream = await startLocalStream(false);
      
      // Initialize WebRTC peer connection
      const pc = initializePeerConnection();
      
      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        try {
          pc.addTrack(track, stream);
        } catch (error) {
          console.error('Error adding track to peer connection:', error);
        }
      });

      // Create a unique call ID and reference
      const callId = `${auth.currentUser.uid}_${selectedChat.user.id}_${Date.now()}`;
      const callRef = doc(chatDb, 'calls', callId);

      // Create a call document in Firebase
      await setDoc(callRef, {
        id: callId,
        users: [auth.currentUser.uid, selectedChat.user.id],
        from: auth.currentUser.uid,
        to: selectedChat.user.id,
        type: 'audio',
        status: 'ringing',
        timestamp: serverTimestamp(),
        offer: null,
        answer: null,
        candidates: []
      });

      // Create and set local description with specific constraints
      const offerOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
        voiceActivityDetection: true
      };

      const offer = await pc.createOffer(offerOptions);
      
      // Ensure proper SDP modifications for audio-only calls
      let modifiedSdp = offer.sdp;
      // Remove any video-related lines from SDP
      modifiedSdp = modifiedSdp.split('\r\n').filter(line => !line.startsWith('m=video')).join('\r\n');
      
      const modifiedOffer = new RTCSessionDescription({
        type: offer.type,
        sdp: modifiedSdp
      });

      await pc.setLocalDescription(modifiedOffer);
      
      // Store the offer in Firebase
      await updateDoc(callRef, {
        offer: {
          type: modifiedOffer.type,
          sdp: modifiedOffer.sdp
        }
      });

      setIsInCall(true);
      setCallStatus('ringing');
      
      // Listen for call status changes
      const unsubscribe = onSnapshot(callRef, async (snapshot) => {
        const data = snapshot.data();
        if (!data) return;

        console.log('Call status update:', data.status);

        switch (data.status) {
          case 'accepted':
            if (data.answer && !pc.currentRemoteDescription) {
              try {
                console.log('Setting remote description for audio call');
                const answerDescription = new RTCSessionDescription(data.answer);
                await pc.setRemoteDescription(answerDescription);
                
                if (data.candidates && data.candidates.length > 0) {
                  console.log('Adding ICE candidates for audio call');
                  for (const candidate of data.candidates) {
                    if (candidate && pc.remoteDescription) {
                      await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                  }
                }
                
                setCallStatus('ongoing');
                toast({
                  title: "Audio Call Connected",
                  description: "Audio call established successfully",
                  status: "success",
                  duration: 3000,
                });
              } catch (error) {
                console.error('Error in audio call acceptance:', error);
                handleEndCall(callId);
              }
            }
            break;

          case 'rejected':
            toast({
              title: "Call Rejected",
              description: "The other user rejected the call",
              status: "info",
              duration: 3000,
            });
            handleEndCall(callId);
            unsubscribe();
            break;

          case 'ended':
            handleEndCall(callId);
            unsubscribe();
            break;
        }
      });

      // Set a timeout for unanswered calls
      setTimeout(() => {
        if (callStatus === 'ringing') {
          toast({
            title: "No Answer",
            description: "Call was not answered",
            status: "info",
            duration: 3000,
          });
          handleEndCall(callId);
          unsubscribe();
        }
      }, 30000);

    } catch (error) {
      console.error('Error starting audio call:', error);
      toast({
        title: "Call Failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleEndCall = async (callId) => {
    try {
      // Clean up media streams
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
        setRemoteStream(null);
      }

      // Close peer connection
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }

      // Update call status in Firebase
      if (callId) {
        const callRef = doc(chatDb, 'calls', callId);
        await updateDoc(callRef, {
          status: 'ended',
          endedAt: serverTimestamp(),
          endedBy: auth.currentUser.uid
        });
      }

      // Reset all call-related states
      setIsInCall(false);
      setCallStatus('idle');
      setIncomingCall(null);
      setLocalVideoEnabled(true);
      setLocalAudioEnabled(true);

      // Clear any error states
      setCallError(null);

      console.log('Call ended successfully');
    } catch (error) {
      console.error('Error ending call:', error);
      // Still reset states even if there's an error
      setIsInCall(false);
      setCallStatus('idle');
      setIncomingCall(null);
      setLocalVideoEnabled(true);
      setLocalAudioEnabled(true);
    }
  };

  // Add this function to handle call cleanup
  const cleanupCall = () => {
    try {
      // Check if localStream exists before cleaning up
      if (localStream) {
        localStream.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (err) {
            console.error('Error stopping track:', err);
          }
        });
        setLocalStream(null);
      }

      // Check if remoteStream exists before cleaning up
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (err) {
            console.error('Error stopping track:', err);
          }
        });
        setRemoteStream(null);
      }

      // Check if peerConnection exists before closing
      if (peerConnection.current) {
        try {
          if (peerConnection.current.close && typeof peerConnection.current.close === 'function') {
            peerConnection.current.close();
          }
        } catch (error) {
          console.error('Error closing peer connection:', error);
        }
        peerConnection.current = null;
      }

      // Reset call-related states
      setIsInCall(false);
      setCallStatus('idle');
      setIncomingCall(null);
      setLocalVideoEnabled(true);
      setLocalAudioEnabled(true);
      setCallError(null);
    } catch (error) {
      console.error('Error in cleanupCall:', error);
    }
  };

  // Update useEffect to use cleanup
  useEffect(() => {
    return () => {
      cleanupCall();
    };
  }, []);

  // Update the call rejection handler
  const handleRejectCall = async (callId) => {
    try {
      const callRef = doc(chatDb, 'calls', callId);
      await updateDoc(callRef, {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectedBy: auth.currentUser.uid
      });
      setIncomingCall(null);
      cleanupCall();
    } catch (error) {
      console.error('Error rejecting call:', error);
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  // NOTE: Read/delivered flags are stored in Mongo but not updated from the client yet.
  useEffect(() => {
    if (!selectedChat || !auth.currentUser) return;

    // Calls and WebRTC signaling are disabled in the Mongo-only version.
    return () => {};
  }, [selectedChat]);

  const handleAcceptCall = async (call) => {
    try {
      if (!call || !call.offer) {
        throw new Error('Invalid call data');
      }

      // Start local stream
      const stream = await startLocalStream(call.type === 'video');
      
      // Initialize WebRTC peer connection
      const pc = initializePeerConnection();
      
      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        try {
          pc.addTrack(track, stream);
        } catch (error) {
          console.error('Error adding track to peer connection:', error);
        }
      });

      // Set remote description (offer)
      const remoteDesc = new RTCSessionDescription(call.offer);
      await pc.setRemoteDescription(remoteDesc);

      // Create and set local description (answer)
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Update call document
      const callRef = doc(chatDb, 'calls', call.id);
      await updateDoc(callRef, {
        status: 'accepted',
        answer: {
          type: answer.type,
          sdp: answer.sdp
        },
        acceptedAt: serverTimestamp()
      });

      setIncomingCall(null);
      setIsInCall(true);
      setCallStatus('ongoing');

    } catch (error) {
      console.error('Error accepting call:', error);
      toast({
        title: "Error",
        description: "Failed to accept call: " + error.message,
        status: "error",
        duration: 5000
      });
      if (call?.id) {
        handleEndCall(call.id);
      }
    }
  };

  const CallModal = () => (
    <Modal isOpen={!!incomingCall} onClose={() => handleRejectCall(incomingCall?.id)}>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={gradientBg} color="white">
        <ModalHeader>Incoming {incomingCall?.type} Call</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Avatar
              size="xl"
              name={selectedChat?.user.displayName}
              src={selectedChat?.user.photoURL}
            />
            <Text fontSize="lg" fontWeight="bold">
              {selectedChat?.user.displayName} is calling...
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={4}>
            <IconButton
              icon={<FaPhoneSlash />}
              onClick={() => handleRejectCall(incomingCall?.id)}
              colorScheme="red"
              borderRadius="full"
              size="lg"
            />
            <IconButton
              icon={incomingCall?.type === 'video' ? <FaVideo /> : <FaPhone />}
              onClick={() => handleAcceptCall(incomingCall)}
              colorScheme="green"
              borderRadius="full"
              size="lg"
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const CallOverlay = () => (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0,0,0,0.9)"
      zIndex={1000}
      display={isInCall ? "flex" : "none"}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <HStack spacing={4} position="relative" w="full" h="full" p={4}>
        {/* Remote Video */}
        <Box flex={1} position="relative" bg="gray.900" borderRadius="xl" overflow="hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>

        {/* Local Video (Picture-in-Picture) */}
        <Box
          position="absolute"
          bottom={4}
          right={4}
          width="300px"
          height="200px"
          bg="gray.900"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="xl"
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>

        {/* Call Controls */}
        <HStack
          position="absolute"
          bottom={4}
          left="50%"
          transform="translateX(-50%)"
          spacing={4}
          bg="whiteAlpha.200"
          backdropFilter="blur(10px)"
          p={4}
          borderRadius="full"
        >
          <IconButton
            icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            onClick={toggleMute}
            colorScheme={isMuted ? "red" : "whiteAlpha"}
            size="lg"
            borderRadius="full"
          />
          <IconButton
            icon={<FaPhoneSlash />}
            onClick={handleEndCall}
            colorScheme="red"
            size="lg"
            borderRadius="full"
          />
        </HStack>
      </HStack>
    </Box>
  );

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      // Cleanup function to ensure all media streams are properly stopped
      if (localStream) {
        localStream.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (error) {
            console.error('Error stopping local track:', error);
          }
        });
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (error) {
            console.error('Error stopping remote track:', error);
          }
        });
      }
      if (peerConnection.current) {
        try {
          peerConnection.current.close();
        } catch (error) {
          console.error('Error closing peer connection:', error);
        }
      }
    };
  }, []);

  // Add this function to update user's last seen
  const updateLastSeen = async (userId) => {
    try {
      const userRef = doc(chatDb, 'users', userId);
      await updateDoc(userRef, {
        lastSeen: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last seen:', error);
    }
  };

  // Add this function to format last seen time
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Offline';
    
    const now = new Date();
    const lastSeenDate = timestamp.toDate();
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Online';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    
    return lastSeenDate.toLocaleDateString();
  };

  // Modify the message component to include status indicators
  const MessageStatus = ({ message }) => {
    if (message.senderId === auth.currentUser?.uid) {
      return (
        <HStack spacing={1} fontSize="xs" color="whiteAlpha.600" mt={1}>
          {message.delivered ? (
            message.read ? (
              <FaCheckDouble color="#3182CE" /> // Blue double tick for read
            ) : (
              <FaCheckDouble /> // Grey double tick for delivered
            )
          ) : (
            <FaCheck /> // Single tick for sent
          )}
          <Text fontSize="xs">
            {message.timestamp?.toDate ? 
              new Date(message.timestamp.toDate()).toLocaleTimeString() : 
              new Date().toLocaleTimeString()
            }
          </Text>
        </HStack>
      );
    }
    return null;
  };

  // Update the chat header to show last seen
  const ChatHeader = () => (
    <HStack
      w="100%"
      p={4}
      bg="whiteAlpha.50"
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
      spacing={4}
    >
      <Avatar
        size="sm"
        name={selectedChat?.user.name}
        src={selectedChat?.user.photoURL}
      />
      <VStack align="start" spacing={0} flex={1}>
        <Text color="white" fontWeight="medium">
          {selectedChat?.user.name}
        </Text>
        <Text fontSize="xs" color="whiteAlpha.700">
          {lastSeen[selectedChat?.user.id] 
            ? formatLastSeen(lastSeen[selectedChat?.user.id])
            : 'Offline'}
        </Text>
      </VStack>
      <HStack spacing={2}>
      </HStack>
    </HStack>
  );

  // Update the message component to include status
  const Message = ({ message }) => (
    <MotionBox
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      alignSelf={message.senderId === auth.currentUser?.uid ? "flex-end" : "flex-start"}
      maxW="70%"
      mb={2}
    >
      <Box
        bg={message.senderId === auth.currentUser?.uid ? myMessageGradient : otherMessageGradient}
        p={3}
        borderRadius="lg"
        position="relative"
      >
        <Text color="white">{message.text}</Text>
        <MessageStatus message={message} />
      </Box>
    </MotionBox>
  );

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
      <Text color="white">Loading messages...</Text>
    </Box>
  );

  return (
    <>
      <CallModal />
      <CallOverlay />
      <Container maxW="container.xl" h="calc(100vh - 80px)" mt="80px" p={4}>
        <Box 
          h="full" 
          bg={gradientBg}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="2xl"
        >
          <HStack h="full" spacing={0} align="stretch">
            {/* Chat List Sidebar */}
            <Box 
              w="350px" 
              borderRight="1px solid" 
              borderColor="whiteAlpha.100" 
              bg={sidebarGradient}
            >
              <VStack h="full" spacing={0}>
                {/* Search Header */}
                <Box 
                  w="full" 
                  p={4} 
                  borderBottom="1px solid" 
                  borderColor="whiteAlpha.100"
                  bg="whiteAlpha.50"
                  backdropFilter="blur(10px)"
                >
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaSearch color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={handleSearch}
                      bg="whiteAlpha.100"
                      _focus={{ bg: "whiteAlpha.200" }}
                      borderRadius="full"
                      _hover={{ bg: "whiteAlpha.150" }}
                    />
                  </InputGroup>
                </Box>

                {/* Chat List */}
                <Box overflowY="auto" flex={1} w="full" p={2}>
                  <AnimatePresence>
                    {chats.map((chat) => (
                      <MotionBox
                        key={chat.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedChat(chat)}
                        cursor="pointer"
                        p={4}
                        bg={selectedChat?.id === chat.id ? selectedChatBg : "transparent"}
                        _hover={{ bg: hoverBg }}
                        borderRadius="xl"
                        mb={2}
                        transition="all 0.2s"
                      >
                        <HStack spacing={3}>
                          <Box position="relative">
                            <Avatar
                              size="md"
                              name={chat.user.displayName}
                              src={chat.user.photoURL}
                              borderWidth={2}
                              borderColor={onlineUsers.includes(chat.user.id) ? "green.400" : "transparent"}
                            />
                            {onlineUsers.includes(chat.user.id) && (
                              <Box
                                position="absolute"
                                bottom={0}
                                right={0}
                                w={3}
                                h={3}
                                bg="green.400"
                                borderRadius="full"
                                borderWidth={2}
                                borderColor="gray.900"
                              />
                            )}
                          </Box>
                          <VStack align="start" spacing={0} flex={1}>
                            <HStack justify="space-between" w="full">
                              <Text fontWeight="bold" color="white">
                                {chat.user.displayName}
                              </Text>
                              {chat.lastMessageTime?.toDate && (
                                <Text fontSize="xs" color="whiteAlpha.600">
                                  {new Date(chat.lastMessageTime.toDate()).toLocaleTimeString()}
                                </Text>
                              )}
                            </HStack>
                            <Text
                              fontSize="sm"
                              color="whiteAlpha.700"
                              noOfLines={1}
                            >
                              {chat.lastMessage || "No messages yet"}
                            </Text>
                          </VStack>
                        </HStack>
                      </MotionBox>
                    ))}
                  </AnimatePresence>
                </Box>
              </VStack>
            </Box>

            {/* Chat Area */}
            <Box flex={1} bg={messageAreaGradient}>
              {selectedChat ? (
                <VStack h="full" spacing={0}>
                  {/* Chat Header */}
                  <Box
                    w="full"
                    p={4}
                    bg="whiteAlpha.50"
                    borderBottom="1px solid"
                    borderColor="whiteAlpha.100"
                    backdropFilter="blur(10px)"
                  >
                    <HStack justify="space-between">
                      <HStack spacing={4}>
                        <Box position="relative">
                          <Avatar
                            size="sm"
                            name={selectedChat.user.displayName}
                            src={selectedChat.user.photoURL}
                          />
                          {onlineUsers.includes(selectedChat.user.id) && (
                            <Box
                              position="absolute"
                              bottom={0}
                              right={0}
                              w={2.5}
                              h={2.5}
                              bg="green.400"
                              borderRadius="full"
                              borderWidth={2}
                              borderColor="gray.900"
                            />
                          )}
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold" color="white">
                            {selectedChat.user.displayName}
                          </Text>
                          <Text fontSize="xs" color="whiteAlpha.600">
                            {onlineUsers.includes(selectedChat.user.id) ? "Online" : "Offline"}
                          </Text>
                        </VStack>
                      </HStack>

                      {/* Call controls removed */}
                    </HStack>
                  </Box>

                  {/* Messages Area */}
                  <Box
                    ref={messagesContainerRef}
                    flex={1}
                    w="full"
                    overflowY="auto"
                    p={6}
                    bgImage="radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
                    bgSize="100% 100%"
                    onScroll={handleScroll}
                    css={{
                      '&::-webkit-scrollbar': { width: '4px' },
                      '&::-webkit-scrollbar-track': { width: '6px', background: 'rgba(255,255,255,0.05)' },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '24px',
                      },
                      scrollBehavior: 'smooth',
                      overscrollBehavior: 'contain',
                    }}
                  >
                    <VStack spacing={6} align="stretch">
                      {messages.map((message, index) => {
                        const isMyMessage = message.senderId === auth.currentUser?.uid;
                        const showAvatar = index === 0 || 
                          messages[index - 1].senderId !== message.senderId;
                        const isLastInGroup = index === messages.length - 1 || 
                          messages[index + 1]?.senderId !== message.senderId;

                        return (
                          <MotionBox
                            key={message.id}
                            variants={messageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            alignSelf={isMyMessage ? "flex-end" : "flex-start"}
                            maxW={{ base: "85%", md: "70%" }}
                          >
                            <HStack
                              spacing={2}
                              align="flex-end"
                              flexDirection={isMyMessage ? 'row-reverse' : 'row'}
                            >
                              {!isMyMessage && showAvatar && (
                                <Avatar
                                  size="sm"
                                  name={selectedChat.user.displayName}
                                  src={selectedChat.user.photoURL}
                                  mb={2}
                                />
                              )}
                              <VStack
                                spacing={0}
                                align={isMyMessage ? "flex-end" : "flex-start"}
                                flex={1}
                              >
                                {showAvatar && !isMyMessage && (
                                  <Text
                                    fontSize="xs"
                                    color="whiteAlpha.700"
                                    ml={2}
                                    mb={1}
                                  >
                                    {selectedChat.user.displayName}
                                  </Text>
                                )}
                                <Box
                                  bg={isMyMessage ? myMessageGradient : otherMessageGradient}
                                  color={isMyMessage ? "white" : "whiteAlpha.900"}
                                  p={4}
                                  borderRadius={isMyMessage ? "2xl 2xl 0 2xl" : "2xl 2xl 2xl 0"}
                                  position="relative"
                                  boxShadow={`0 4px 12px ${isMyMessage ? 'rgba(71, 118, 230, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`}
                                  backdropFilter="blur(10px)"
                                  border="1px solid"
                                  borderColor={isMyMessage ? "whiteAlpha.200" : "whiteAlpha.100"}
                                  mb={isLastInGroup ? 2 : 1}
                                >
                                  <Text fontSize="sm" lineHeight="1.5">
                                    {message.text}
                                  </Text>
                                  <MessageStatus message={message} />
                                </Box>
                              </VStack>
                            </HStack>
                          </MotionBox>
                        );
                      })}
                      {otherUserTyping && (
                        <MotionBox
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          alignSelf="flex-start"
                          maxW="70%"
                          mb={2}
                        >
                          <Box
                            bg="whiteAlpha.100"
                            p={3}
                            borderRadius="lg"
                            border="1px solid"
                            borderColor="whiteAlpha.200"
                          >
                            <HStack spacing={2}>
                              <Spinner size="sm" color="blue.400" />
                              <Text color="whiteAlpha.700" fontSize="sm">
                                {selectedChat?.user?.displayName} is typing...
                              </Text>
                            </HStack>
                          </Box>
                        </MotionBox>
                      )}
                      <div ref={messagesEndRef} />
                    </VStack>
                  </Box>

                  {/* Message Input */}
                  <Box
                    w="full"
                    p={4}
                    bg="whiteAlpha.50"
                    borderTop="1px solid"
                    borderColor="whiteAlpha.100"
                    backdropFilter="blur(10px)"
                    position="relative"
                    _before={{
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
                    }}
                  >
                    <HStack 
                      as="form" 
                      onSubmit={(e) => handleSendMessage(e)} 
                      spacing={3}
                      bg="whiteAlpha.100"
                      p={2}
                      borderRadius="full"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                    >
                      <Input
                        flex={1}
                        placeholder="Type a message"
                        value={newMessage}
                        onChange={handleTyping}
                        onKeyDown={handleMessageKeyDown}
                        variant="unstyled"
                        px={3}
                        color="white"
                        _placeholder={{ color: "whiteAlpha.500" }}
                      />
                      <IconButton
                        type="submit"
                        icon={<FaPaperPlane />}
                        isDisabled={!newMessage.trim()}
                        borderRadius="full"
                        size="sm"
                        bg={myMessageGradient}
                        _hover={{
                          bg: "linear-gradient(135deg, #5485FF 0%, #9E6AFF 100%)"
                        }}
                        _active={{
                          bg: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)"
                        }}
                      />
                    </HStack>
                  </Box>
                </VStack>
              ) : (
                <Center h="full">
                  <VStack spacing={6}>
                    <Box
                      p={6}
                      bg="whiteAlpha.100"
                      borderRadius="2xl"
                      textAlign="center"
                    >
                      <Text color="whiteAlpha.800" fontSize="lg" mb={4}>
                        Select a chat or start a new conversation
                      </Text>
                      <Button
                        leftIcon={<FaSearch />}
                        bg="linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
                        color="gray.900"
                        _hover={{
                          bg: "linear-gradient(135deg, #FFE44D 0%, #FFB347 100%)"
                        }}
                        onClick={onOpen}
                        size="lg"
                        borderRadius="full"
                        px={8}
                      >
                        Search Users
                      </Button>
                    </Box>
                  </VStack>
                </Center>
              )}
            </Box>
          </HStack>
        </Box>

        {/* User Search Drawer - Updated styling */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay backdropFilter="blur(10px)" />
          <DrawerContent bg={sidebarGradient}>
            <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.100" color="white">
              <HStack justify="space-between">
                <Text>Search Users</Text>
                <DrawerCloseButton />
              </HStack>
            </DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="stretch">
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FaSearch color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleSearch}
                    bg="whiteAlpha.100"
                    _focus={{ bg: "whiteAlpha.200" }}
                    borderRadius="full"
                  />
                </InputGroup>
                
                {searchResults && (searchResults.exact?.length > 0 || searchResults.similar?.length > 0) ? (
                  <List spacing={3}>
                    {/* Exact Matches */}
                    {searchResults.exact?.map((user) => (
                      <ListItem
                        key={user.id}
                        onClick={() => createChatWithUser(user)}
                        cursor="pointer"
                        p={4}
                        borderRadius="xl"
                        bg="whiteAlpha.50"
                        _hover={{ bg: "whiteAlpha.100" }}
                        transition="all 0.2s"
                      >
                        <HStack spacing={3}>
                          <Avatar
                            size="sm"
                            name={user.displayName}
                            src={user.photoURL}
                          />
                          <VStack align="start" spacing={0}>
                            <Text color="white" fontWeight="bold">
                              {user.displayName}
                            </Text>
                            <Badge 
                              colorScheme="green" 
                              size="sm"
                              borderRadius="full"
                              px={2}
                            >
                              Exact Match
                            </Badge>
                            {user.email && (
                              <Text color="whiteAlpha.600" fontSize="sm">
                                {user.email}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                      </ListItem>
                    ))}

                    {/* Similar Matches */}
                    {searchResults.similar.map((user) => (
                      <ListItem
                        key={user.id}
                        onClick={() => createChatWithUser(user)}
                        cursor="pointer"
                        p={4}
                        borderRadius="xl"
                        bg="whiteAlpha.50"
                        _hover={{ bg: "whiteAlpha.100" }}
                        transition="all 0.2s"
                      >
                        <HStack spacing={3}>
                          <Avatar
                            size="sm"
                            name={user.displayName}
                            src={user.photoURL}
                          />
                          <VStack align="start" spacing={0}>
                            <Text color="white" fontWeight="bold">
                              {user.displayName}
                            </Text>
                            <Badge 
                              colorScheme="blue" 
                              size="sm"
                              borderRadius="full"
                              px={2}
                            >
                              Similar Match
                            </Badge>
                            {user.email && (
                              <Text color="whiteAlpha.600" fontSize="sm">
                                {user.email}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                ) : searchQuery ? (
                  <Text color="whiteAlpha.600" textAlign="center">
                    No users found
                  </Text>
                ) : null}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Container>
    </>
  );
};

export default ChatRoom;