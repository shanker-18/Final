import { GoogleGenerativeAI } from '@google/generative-ai';
import { Project } from '../models/Project.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * AI Chat Service using Google Gemini
 * Handles platform queries and project recommendations
 */
class AIChatService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      this.aiEnabled = true;
      console.log('✓ Gemini AI Chat enabled');
    } else {
      this.aiEnabled = false;
      console.log('⚠ Gemini AI key not configured for chat');
    }

    // Platform knowledge base
    this.platformInfo = {
      name: 'FreelanceHub',
      description: 'A comprehensive freelancing platform connecting developers with project seekers',
      features: [
        'Project listing and discovery',
        'AI-powered project recommendations',
        'Video project showcases',
        'Developer portfolios',
        'Real-time chat support',
        'Project categorization and filtering',
        'Budget-based project matching',
        'Technology stack matching'
      ],
      userTypes: {
        developer: 'Can create and showcase projects, upload videos, manage portfolio',
        seeker: 'Can browse projects, get AI recommendations, connect with developers'
      },
      techStack: ['React', 'Node.js', 'MongoDB', 'Firebase', 'Cloudinary', 'Google Gemini AI'],
      categories: ['Web Development', 'Mobile Development', 'AI/ML', 'Blockchain', 'Design', 'Other']
    };
  }

  /**
   * Detect user intent from message
   */
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();

    // Project search intents
    if (
      lowerMessage.includes('project') ||
      lowerMessage.includes('find') ||
      lowerMessage.includes('show') ||
      lowerMessage.includes('recommend') ||
      lowerMessage.includes('suggest') ||
      lowerMessage.includes('looking for')
    ) {
      return 'project_search';
    }

    // Platform info intents
    if (
      lowerMessage.includes('how') ||
      lowerMessage.includes('what is') ||
      lowerMessage.includes('what are') ||
      lowerMessage.includes('tell me about') ||
      lowerMessage.includes('explain') ||
      lowerMessage.includes('feature') ||
      lowerMessage.includes('help')
    ) {
      return 'platform_info';
    }

    // Greeting intents
    if (
      lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/i)
    ) {
      return 'greeting';
    }

    return 'general';
  }

  /**
   * Extract project search criteria from message
   */
  extractSearchCriteria(message) {
    const lowerMessage = message.toLowerCase();
    const criteria = {
      technologies: [],
      category: null,
      budget: null,
      keywords: []
    };

    // Extract technologies
    const techKeywords = ['react', 'node', 'nodejs', 'python', 'java', 'flutter', 'angular', 'vue', 'mongodb', 'postgresql', 'django', 'javascript', 'typescript'];
    techKeywords.forEach(tech => {
      if (lowerMessage.includes(tech)) {
        criteria.technologies.push(tech);
      }
    });

    // Extract category
    const categories = {
      'web': ['web', 'website', 'webapp'],
      'mobile': ['mobile', 'app', 'android', 'ios'],
      'ai': ['ai', 'ml', 'machine learning', 'artificial intelligence'],
      'blockchain': ['blockchain', 'crypto', 'web3'],
      'design': ['design', 'ui', 'ux']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        criteria.category = category;
        break;
      }
    }

    // Extract budget info
    const budgetMatch = lowerMessage.match(/(\d+)k?/i);
    if (budgetMatch) {
      criteria.budget = parseInt(budgetMatch[1]) * (lowerMessage.includes('k') ? 1000 : 1);
    }

    // Extract general keywords (remove common words)
    const words = message.split(/\s+/).filter(word => 
      word.length > 3 && 
      !['what', 'where', 'when', 'which', 'find', 'show', 'tell', 'about', 'help', 'need', 'want'].includes(word.toLowerCase())
    );
    criteria.keywords = words;

    return criteria;
  }

  /**
   * Search for projects based on criteria
   */
  async searchProjects(criteria) {
    try {
      const query = { status: 'active' };
      const projects = await Project.find(query).limit(5).lean();

      if (!projects || projects.length === 0) {
        return [];
      }

      // Score and filter projects
      const scoredProjects = projects.map(project => {
        let score = 0;

        // Technology match
        if (criteria.technologies.length > 0) {
          const projectTechs = project.technologies.map(t => t.toLowerCase());
          criteria.technologies.forEach(tech => {
            if (projectTechs.some(pt => pt.includes(tech) || tech.includes(pt))) {
              score += 10;
            }
          });
        }

        // Category match
        if (criteria.category) {
          if (project.category.toLowerCase().includes(criteria.category)) {
            score += 5;
          }
        }

        // Budget match
        if (criteria.budget) {
          const budgetDiff = Math.abs(project.budget - criteria.budget);
          if (budgetDiff < criteria.budget * 0.3) {
            score += 8;
          }
        }

        // Keyword match
        criteria.keywords.forEach(keyword => {
          const searchText = `${project.title} ${project.description}`.toLowerCase();
          if (searchText.includes(keyword.toLowerCase())) {
            score += 3;
          }
        });

        return { ...project, score };
      });

      // Sort by score and return top 3
      return scoredProjects
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(p => ({
          id: p._id,
          title: p.title,
          description: p.description,
          technologies: p.technologies,
          budget: p.budget,
          category: p.category,
          seller: p.seller
        }));
    } catch (error) {
      console.error('Error searching projects:', error);
      return [];
    }
  }

  /**
   * Generate AI response using Gemini
   */
  async generateAIResponse(message, intent, projects = []) {
    if (!this.aiEnabled) {
      return this.generateFallbackResponse(message, intent, projects);
    }

    try {
      let prompt = '';

      if (intent === 'project_search' && projects.length > 0) {
        prompt = `You are a helpful AI assistant for FreelanceHub, a freelancing platform. A user asked: "${message}"

I found ${projects.length} matching projects:
${projects.map((p, i) => `${i + 1}. ${p.title} - ${p.description.substring(0, 100)}... (Technologies: ${p.technologies.join(', ')}, Budget: ₹${p.budget})`).join('\n')}

Provide a friendly response (2-3 sentences) mentioning these projects and encouraging the user to check them out. Be conversational and helpful.`;
      } else if (intent === 'platform_info') {
        prompt = `You are a helpful AI assistant for FreelanceHub. Answer this question about the platform: "${message}"

Platform Information:
- Name: ${this.platformInfo.name}
- Description: ${this.platformInfo.description}
- Key Features: ${this.platformInfo.features.join(', ')}
- User Types: Developers (can create projects) and Seekers (can browse projects)
- Technology Stack: ${this.platformInfo.techStack.join(', ')}

Provide a helpful, concise answer (2-4 sentences). Be friendly and informative.`;
      } else if (intent === 'greeting') {
        prompt = `You are a friendly AI assistant for FreelanceHub. Respond to this greeting: "${message}"

Provide a warm, welcoming response and briefly mention that you can help with:
- Finding projects
- Answering questions about the platform
- Providing recommendations

Keep it brief (1-2 sentences).`;
      } else {
        prompt = `You are a helpful AI assistant for FreelanceHub, a freelancing platform connecting developers and project seekers. 

User message: "${message}"

Provide a helpful, friendly response (2-3 sentences). If relevant, mention that you can help find projects or answer questions about the platform.`;
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Gemini AI error:', error.message);
      return this.generateFallbackResponse(message, intent, projects);
    }
  }

  /**
   * Fallback response when AI is unavailable
   */
  generateFallbackResponse(message, intent, projects = []) {
    if (intent === 'greeting') {
      return "Hi there! 👋 I'm your FreelanceHub assistant. I can help you find projects, answer questions about the platform, and provide recommendations. What can I help you with?";
    }

    if (intent === 'project_search') {
      if (projects.length > 0) {
        return `Great! I found ${projects.length} project${projects.length > 1 ? 's' : ''} that match your requirements. Check them out below and click to view more details!`;
      } else {
        return "I couldn't find any projects matching your criteria right now. Try browsing all available projects or adjust your search terms!";
      }
    }

    if (intent === 'platform_info') {
      return `FreelanceHub is a comprehensive freelancing platform that connects talented developers with project seekers. Our key features include AI-powered recommendations, video project showcases, real-time chat, and smart project matching based on skills and budget. Is there anything specific you'd like to know?`;
    }

    return "I'm here to help! You can ask me about projects, platform features, or request recommendations based on your needs. What would you like to know?";
  }

  /**
   * Main chat method
   */
  async chat(message, userId = null) {
    try {
      // Detect intent
      const intent = this.detectIntent(message);
      console.log(`Detected intent: ${intent}`);

      let projects = [];
      let responseText = '';

      // Handle project search
      if (intent === 'project_search') {
        const criteria = this.extractSearchCriteria(message);
        console.log('Search criteria:', criteria);
        projects = await this.searchProjects(criteria);
        console.log(`Found ${projects.length} projects`);
      }

      // Generate response
      responseText = await this.generateAIResponse(message, intent, projects);

      return {
        text: responseText,
        projects: projects,
        intent: intent
      };
    } catch (error) {
      console.error('Error in chat:', error);
      return {
        text: "I apologize, but I'm having trouble processing your request. Please try again or contact support if the issue persists.",
        projects: [],
        intent: 'error'
      };
    }
  }
}

export default new AIChatService();
