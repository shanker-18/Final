import express from 'express';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';

const router = express.Router();

// Get all conversations for a user
router.get('/conversations', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId required' });
    }

    const convos = await Conversation.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ success: true, conversations: convos });
  } catch (err) {
    console.error('Get conversations error', err);
    res.status(500).json({ success: false, message: 'Failed to load conversations' });
  }
});

// Create or get a conversation between two users
router.post('/conversations', async (req, res) => {
  try {
    const { currentUserId, otherUser } = req.body;

    if (!currentUserId || !otherUser || !otherUser.id) {
      return res.status(400).json({ success: false, message: 'Invalid user data' });
    }

    if (currentUserId === otherUser.id) {
      return res.status(400).json({ success: false, message: 'Cannot chat with yourself' });
    }

    const participants = [currentUserId, otherUser.id].filter(Boolean).sort();
    if (participants.length !== 2) {
      return res.status(400).json({ success: false, message: 'Exactly two participants are required' });
    }

    const participantInfo = {
      [otherUser.id]: {
        displayName: otherUser.displayName || otherUser.name || 'Unknown User',
        photoURL: otherUser.photoURL || '',
        email: otherUser.email || '',
      },
    };

    const convo = await Conversation.findOneAndUpdate(
      { participants },
      { $setOnInsert: { participants, participantInfo } },
      { new: true, upsert: true }
    );

    if (!convo) {
      throw new Error('Conversation upsert returned null');
    }

    res.json({ success: true, conversation: convo });
  } catch (err) {
    console.error('Create conversation error:', err.message, err.stack);
    res.status(500).json({ success: false, message: err.message || 'Failed to create conversation' });
  }
});

// Get messages for a conversation
router.get('/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await Message.find({ conversationId: id })
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, messages });
  } catch (err) {
    console.error('Get messages error', err);
    res.status(500).json({ success: false, message: 'Failed to load messages' });
  }
});

// Send a message
router.post('/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { senderId, senderName, text } = req.body;

    if (!senderId || !text) {
      return res.status(400).json({ success: false, message: 'senderId and text are required' });
    }

    const convo = await Conversation.findById(id);
    if (!convo) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (!convo.participants.includes(senderId)) {
      return res.status(403).json({ success: false, message: 'Not a participant in this conversation' });
    }

    const message = await Message.create({
      conversationId: id,
      senderId,
      senderName,
      text,
    });

    convo.lastMessage = text;
    convo.lastMessageTime = new Date();
    await convo.save();

    res.status(201).json({ success: true, message });
  } catch (err) {
    console.error('Send message error', err);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

export default router;
