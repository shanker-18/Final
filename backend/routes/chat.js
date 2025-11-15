import express from 'express';
import aiChatService from '../services/aiChatService.js';

const router = express.Router();

/**
 * POST /api/chat
 * Chat with AI assistant about the platform and get project recommendations
 */
router.post('/', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be a string.',
      });
    }

    console.log(`Chat request from user ${userId || 'anonymous'}: ${message}`);

    // Get AI response
    const response = await aiChatService.chat(message, userId);

    res.json({
      success: true,
      response: response.text,
      projects: response.projects || [],
      intent: response.intent,
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: error.message,
    });
  }
});

/**
 * GET /api/chat/test
 * Test endpoint
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Chat API is working',
    timestamp: new Date().toISOString(),
  });
});

export default router;
