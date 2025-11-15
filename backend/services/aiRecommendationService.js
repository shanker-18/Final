import { Project } from '../models/Project.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * AI-Powered Project Recommendation Service
 * Uses Google Gemini AI for intelligent matching and explanations
 */

class AIRecommendationService {
  constructor() {
    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      this.aiEnabled = true;
      console.log('✓ Gemini AI enabled for recommendations');
    } else {
      this.aiEnabled = false;
      console.log('⚠ Gemini AI key not configured, using fallback algorithm');
    }
  }
  /**
   * Calculate semantic similarity between two texts using word overlap
   * Returns a score between 0 and 1
   */
  calculateTextSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;

    // Normalize and tokenize
    const normalize = (text) =>
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2);

    const words1 = new Set(normalize(text1));
    const words2 = new Set(normalize(text2));

    if (words1.size === 0 || words2.size === 0) return 0;

    // Calculate Jaccard similarity
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  /**
   * Calculate tech stack match score
   */
  calculateTechStackMatch(surveyTech, projectTech) {
    if (!surveyTech || !projectTech || surveyTech.length === 0) return 0;

    const normalizedSurvey = surveyTech.map(t => t.toLowerCase());
    const normalizedProject = projectTech.map(t => t.toLowerCase());

    let matches = 0;
    normalizedSurvey.forEach(tech => {
      if (normalizedProject.some(pt => pt.includes(tech) || tech.includes(pt))) {
        matches++;
      }
    });

    return matches / normalizedSurvey.length;
  }

  /**
   * Calculate budget compatibility score
   */
  calculateBudgetMatch(surveyBudget, projectBudget) {
    if (!surveyBudget || !projectBudget) return 0;

    // Parse survey budget range
    const [minBudget, maxBudget] = surveyBudget.split('-').map(b => {
      const num = b.replace('+', '');
      return parseInt(num);
    });

    // Check if project budget falls within range
    if (maxBudget) {
      if (projectBudget >= minBudget && projectBudget <= maxBudget) {
        return 1.0; // Perfect match
      }
      
      // Partial match if close
      const midpoint = (minBudget + maxBudget) / 2;
      const range = maxBudget - minBudget;
      const distance = Math.abs(projectBudget - midpoint);
      
      if (distance < range) {
        return 1 - (distance / range) * 0.5; // 0.5 to 1.0 score
      }
    } else {
      // Handle "100000+" case
      if (projectBudget >= minBudget) {
        return 1.0;
      }
      
      const distance = minBudget - projectBudget;
      if (distance < minBudget * 0.3) {
        return 0.7; // Close enough
      }
    }

    return 0.3; // Minimum score for any valid budget
  }

  /**
   * Map project type to category
   */
  matchProjectType(surveyType, projectCategory) {
    if (!surveyType || !projectCategory) return 0.5;

    const typeMapping = {
      'website': ['web', 'website', 'frontend', 'fullstack', 'landing'],
      'mobile-app': ['mobile', 'app', 'android', 'ios', 'flutter', 'react native'],
      'saas': ['saas', 'platform', 'cloud', 'service', 'subscription'],
      'automation': ['automation', 'tool', 'script', 'bot', 'workflow'],
      'ai-app': ['ai', 'ml', 'machine learning', 'artificial intelligence', 'nlp', 'computer vision'],
    };

    const categoryLower = projectCategory.toLowerCase();
    const relevantKeywords = typeMapping[surveyType] || [];

    const isMatch = relevantKeywords.some(keyword => 
      categoryLower.includes(keyword)
    );

    return isMatch ? 1.0 : 0.5;
  }

  /**
   * Map domain similarity
   */
  matchDomain(surveyDomain, projectCategory, projectDescription) {
    if (!surveyDomain) return 0.5;

    const domainKeywords = {
      'ecommerce': ['ecommerce', 'e-commerce', 'shop', 'store', 'retail', 'cart', 'product', 'marketplace', 'buy', 'sell'],
      'education': ['education', 'learning', 'course', 'student', 'teacher', 'school', 'university', 'training'],
      'finance': ['finance', 'banking', 'payment', 'wallet', 'transaction', 'investment', 'trading', 'crypto'],
      'ai-ml': ['ai', 'ml', 'machine learning', 'deep learning', 'neural', 'nlp', 'computer vision', 'data science'],
      'productivity': ['productivity', 'task', 'project management', 'collaboration', 'workflow', 'efficiency'],
      'marketplace': ['marketplace', 'platform', 'listing', 'vendor', 'buyer', 'seller', 'auction'],
      'healthcare': ['health', 'medical', 'hospital', 'patient', 'doctor', 'clinic', 'wellness', 'fitness'],
      'social': ['social', 'community', 'chat', 'messaging', 'feed', 'network', 'connect'],
    };

    const keywords = domainKeywords[surveyDomain] || [];
    const searchText = `${projectCategory} ${projectDescription}`.toLowerCase();

    let matchCount = 0;
    keywords.forEach(keyword => {
      if (searchText.includes(keyword)) matchCount++;
    });

    return Math.min(matchCount / 3, 1.0); // Cap at 1.0
  }

  /**
   * Generate AI-powered explanation using Gemini
   */
  async generateAIExplanation(project, surveyData, scores) {
    if (!this.aiEnabled) {
      return this.generateFallbackExplanation(project, surveyData, scores);
    }

    try {
      const prompt = `You are an AI project matching expert. Analyze why this project matches the user's requirements and provide a concise explanation (2-3 sentences maximum).

User Requirements:
- Project Type: ${surveyData.projectType}
- Tech Stack: ${surveyData.techStack.join(', ')}
- Budget Range: ${surveyData.budgetRange}
- Domain: ${surveyData.domain}
- Requirements: ${surveyData.requirements}

Project Details:
- Title: ${project.title}
- Description: ${project.description}
- Technologies: ${project.technologies.join(', ')}
- Budget: ₹${project.budget}
- Category: ${project.category}

Match Scores:
- Tech Stack Match: ${(scores.techStack * 100).toFixed(0)}%
- Budget Match: ${(scores.budget * 100).toFixed(0)}%
- Domain Match: ${(scores.domain * 100).toFixed(0)}%
- Project Type Match: ${(scores.projectType * 100).toFixed(0)}%

Provide a natural, conversational explanation of why this project is a good match. Focus on the strongest matching points.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const explanation = response.text().trim();
      
      return explanation;
    } catch (error) {
      console.error('Gemini AI error:', error.message);
      return this.generateFallbackExplanation(project, surveyData, scores);
    }
  }

  /**
   * Fallback explanation when AI is not available
   */
  generateFallbackExplanation(project, surveyData, scores) {
    const explanations = [];

    // Tech stack explanation
    if (scores.techStack > 0.7) {
      const matchingTechs = surveyData.techStack.filter(st =>
        project.technologies.some(pt => 
          pt.toLowerCase().includes(st.toLowerCase()) || 
          st.toLowerCase().includes(pt.toLowerCase())
        )
      );
      explanations.push(
        `Strong tech stack alignment with ${matchingTechs.join(', ')}`
      );
    } else if (scores.techStack > 0.4) {
      explanations.push('Partial tech stack match with your preferences');
    }

    // Budget explanation
    if (scores.budget > 0.8) {
      explanations.push(`Budget (₹${project.budget}) fits perfectly within your range`);
    } else if (scores.budget > 0.5) {
      explanations.push(`Budget (₹${project.budget}) is close to your target range`);
    }

    // Domain explanation
    if (scores.domain > 0.7) {
      explanations.push('Excellent domain alignment with your requirements');
    }

    // Project type explanation
    if (scores.projectType === 1.0) {
      explanations.push('Matches your desired project type exactly');
    }

    // Semantic explanation
    if (scores.semantic > 0.5) {
      explanations.push('Project description closely matches your stated requirements');
    }

    // Default explanation
    if (explanations.length === 0) {
      explanations.push('This project aligns with your general preferences and requirements');
    }

    return explanations.join('. ') + '.';
  }

  /**
   * Main recommendation algorithm
   * Returns top N projects with AI-powered match scores and explanations
   */
  async getRecommendations(surveyData, topN = 5) {
    try {
      // Fetch all active projects from database
      const allProjects = await Project.find({ status: 'active' }).lean();

      if (!allProjects || allProjects.length === 0) {
        return [];
      }

      // Calculate scores for each project
      const scoredProjects = allProjects.map(project => {
        // Individual scoring components
        const techStackScore = this.calculateTechStackMatch(
          surveyData.techStack,
          project.technologies
        );

        const budgetScore = this.calculateBudgetMatch(
          surveyData.budgetRange,
          project.budget
        );

        const projectTypeScore = this.matchProjectType(
          surveyData.projectType,
          project.category
        );

        const domainScore = this.matchDomain(
          surveyData.domain,
          project.category,
          project.description
        );

        const semanticScore = this.calculateTextSimilarity(
          surveyData.requirements,
          `${project.title} ${project.description} ${project.requirements}`
        );

        // Weighted final score calculation
        const weights = {
          techStack: 0.30,    // 30% weight
          budget: 0.20,       // 20% weight
          projectType: 0.20,  // 20% weight
          domain: 0.20,       // 20% weight
          semantic: 0.10,     // 10% weight
        };

        const finalScore =
          techStackScore * weights.techStack +
          budgetScore * weights.budget +
          projectTypeScore * weights.projectType +
          domainScore * weights.domain +
          semanticScore * weights.semantic;

        const matchScore = Math.round(finalScore * 100); // Convert to percentage

        // Store individual scores for explanation generation
        const scores = {
          techStack: techStackScore,
          budget: budgetScore,
          projectType: projectTypeScore,
          domain: domainScore,
          semantic: semanticScore,
        };

        return {
          project,
          matchScore,
          scores,
        };
      });

      // Sort by match score (descending)
      scoredProjects.sort((a, b) => b.matchScore - a.matchScore);

      // Get top N projects
      const topProjects = scoredProjects.slice(0, topN);

      // Generate AI explanations for top projects
      console.log(`Generating AI explanations for top ${topProjects.length} projects...`);
      const topRecommendations = await Promise.all(
        topProjects.map(async (sp) => {
          const explanation = await this.generateAIExplanation(
            sp.project,
            surveyData,
            sp.scores
          );

          return {
            id: sp.project._id,
            title: sp.project.title,
            description: sp.project.description,
            technologies: sp.project.technologies,
            budget: sp.project.budget,
            category: sp.project.category,
            matchScore: sp.matchScore,
            explanation,
            seller: sp.project.seller,
          };
        })
      );

      console.log(`✓ Successfully generated ${topRecommendations.length} AI-powered recommendations`);
      return topRecommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Get personalized insights based on survey
   */
  generateInsights(surveyData, recommendations) {
    const insights = {
      totalMatches: recommendations.length,
      averageMatchScore: 0,
      topTechnologies: [],
      budgetInsight: '',
      domainInsight: '',
    };

    if (recommendations.length > 0) {
      // Calculate average match score
      const totalScore = recommendations.reduce((sum, rec) => sum + rec.matchScore, 0);
      insights.averageMatchScore = Math.round(totalScore / recommendations.length);

      // Extract top technologies from recommendations
      const techCount = {};
      recommendations.forEach(rec => {
        rec.technologies.forEach(tech => {
          techCount[tech] = (techCount[tech] || 0) + 1;
        });
      });

      insights.topTechnologies = Object.entries(techCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tech]) => tech);

      // Budget insight
      const avgBudget = recommendations.reduce((sum, rec) => sum + rec.budget, 0) / recommendations.length;
      insights.budgetInsight = `Average project budget in your range: ₹${Math.round(avgBudget).toLocaleString('en-IN')}`;

      // Domain insight
      insights.domainInsight = `Found ${recommendations.length} projects matching your ${surveyData.domain} domain preference`;
    }

    return insights;
  }
}

export default new AIRecommendationService();
