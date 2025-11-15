import express from 'express';
import aiRecommendationService from '../services/aiRecommendationService.js';

const router = express.Router();

/**
 * POST /api/survey/recommendations
 * Submit survey and get AI-powered project recommendations
 */
router.post('/recommendations', async (req, res) => {
  try {
    const { userId, survey } = req.body;

    // Validate survey data
    if (!survey || !survey.projectType || !survey.techStack || !survey.budgetRange || !survey.domain || !survey.requirements) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete survey data. All fields are required.',
      });
    }

    // Validate tech stack
    if (!Array.isArray(survey.techStack) || survey.techStack.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one technology must be selected.',
      });
    }

    // Validate requirements length
    if (survey.requirements.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Requirements must be at least 20 characters long.',
      });
    }

    console.log('Processing survey for user:', userId);
    console.log('Survey data:', JSON.stringify(survey, null, 2));

    // Get AI recommendations
    const recommendations = await aiRecommendationService.getRecommendations(survey, 5);

    // Generate insights
    const insights = aiRecommendationService.generateInsights(survey, recommendations);

    // Log recommendations
    console.log(`Generated ${recommendations.length} recommendations for user ${userId}`);

    // Return recommendations
    res.json({
      success: true,
      userId,
      survey,
      recommendations,
      insights,
      message: 'Survey processed successfully',
    });
  } catch (error) {
    console.error('Error processing survey:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process survey and generate recommendations',
      error: error.message,
    });
  }
});

/**
 * GET /api/survey/test
 * Test endpoint to verify service is working
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Survey API is working',
    timestamp: new Date().toISOString(),
  });
});

export default router;
