import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Image,
  VStack,
  HStack,
  Tag,
  Divider,
  UnorderedList,
  ListItem,
  Icon,
  Link,
  useColorModeValue,
  List,
  Badge,
  Grid,
  IconButton
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { keyframes } from '@emotion/react';
import { FaClock, FaUser, FaArrowLeft, FaCheckCircle, FaRocket, FaLightbulb } from 'react-icons/fa';
import ArticleErrorBoundary from './ArticleErrorBoundary';

const blastWave = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 60px rgba(255, 215, 0, 0.3); }
  100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.2); }
`;

const MotionBox = motion.create(Box);
const MotionImage = motion.create(Image);

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5 }
};

const articles = {
  'future-remote-work': {
    id: 'future-remote-work',
    title: "The Future of Remote Work in Freelancing",
    description: "An in-depth exploration of how remote work is transforming the freelancing landscape and what it means for the future of work.",
    category: "Remote Work",
    readTime: 15,
    author: "Sarah Johnson",
    date: "March 2024",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3",
    content: [
      {
        heading: "Introduction",
        text: "The concept of freelancing has evolved dramatically over the last decade, largely driven by the rise of remote work. With technological advancements, companies are increasingly looking beyond traditional employment models, favoring independent contractors, gig workers, and remote freelancers for their flexibility and cost-effectiveness.\n\nAccording to a 2024 Upwork report, over 60% of companies now rely on remote freelancers to some degree, and this trend is expected to grow. From graphic designers and software developers to content creators and virtual assistants, freelancing is no longer just an alternative career path—it is becoming the new standard of work.\n\nThis article explores the future of freelancing, analyzing the latest trends, challenges, and opportunities that remote workers will face.",
        type: "text"
      },
      {
        heading: "1. The Evolution of Remote Freelancing",
        subheading: "1.1 The Shift from Traditional Workplaces to Remote Models",
        text: "Historically, freelancing was often considered a side hustle or an unstable career choice. However, the digital revolution, coupled with the COVID-19 pandemic, forced organizations to reconsider how work gets done. Businesses realized that remote freelancers could provide:",
        benefits: [
          "Cost-effective solutions (saving on office space, benefits, and training)",
          "Access to a global talent pool (hiring the best, regardless of location)",
          "Increased productivity (many studies show remote workers are more efficient)"
        ],
        additionalText: "\nCompanies such as Microsoft, Google, and Amazon now actively hire freelancers for specialized tasks, highlighting the shift towards a hybrid workforce.",
        type: "benefits"
      },
      {
        heading: "1.2 Rise of the Gig Economy",
        text: "The gig economy, driven by platforms like Fiverr, Upwork, Toptal, and Freelancer.com, has made freelancing more accessible than ever. Freelancers now make up 35% of the global workforce, according to a report by McKinsey & Company.",
        stats: [
          "78% of freelancers say they prefer gig work over traditional jobs",
          "The average freelancer earns 45% more per hour than traditional employees in the same field",
          "Over 50% of Gen Z and Millennials are now engaging in freelance work"
        ],
        type: "stats"
      },
      {
        heading: "2. Key Trends Shaping the Future of Remote Freelancing",
        text: "The freelancing landscape is constantly evolving. Here are some major trends that will define its future:",
        type: "section"
      },
      {
        heading: "2.1 AI and Automation in Freelancing",
        text: "Artificial Intelligence (AI) is transforming the way freelancers work. AI-powered platforms now:",
        bullets: [
          "Match freelancers with clients based on skill compatibility",
          "Automate administrative tasks like invoicing and contracts",
          "Enhance productivity with AI-driven writing, coding, and design tools"
        ],
        highlight: "Freelancers using AI-driven tools like ChatGPT for writing, Canva for design, or GitHub Copilot for coding are seeing a 30-50% increase in efficiency.",
        type: "bullets-highlight"
      },
      {
        heading: "2.2 Growth of Specialized Freelancing Niches",
        text: "Rather than general freelancing, businesses now prefer highly skilled specialists. The most in-demand freelancing fields include:",
        specialties: [
          { icon: "🛡️", text: "Cybersecurity experts (as digital threats increase)" },
          { icon: "🤖", text: "AI and Machine Learning specialists (due to automation needs)" },
          { icon: "🔗", text: "Blockchain developers (for Web3 and crypto projects)" },
          { icon: "☁️", text: "Cloud computing consultants (as businesses migrate to the cloud)" }
        ],
        conclusion: "Freelancers with technical expertise will have a competitive advantage in this evolving market.",
        type: "specialties"
      },
      {
        heading: "2.3 The Impact of Remote Collaboration Tools",
        text: "With the rise of remote work, collaboration tools like Slack, Zoom, Notion, and Asana have become essential for freelancers. The integration of Virtual Reality (VR) and Augmented Reality (AR) is set to further revolutionize how teams collaborate across distances.",
        innovations: [
          "Metaverse workspaces will allow freelancers to collaborate in virtual offices",
          "AI-powered scheduling will optimize meetings across different time zones",
          "Real-time language translation will enable seamless communication for global teams"
        ],
        type: "future-tech"
      },
      {
        heading: "3. Challenges in Remote Freelancing",
        type: "section"
      },
      {
        heading: "3.1 Job Stability & Income Fluctuations",
        text: "Unlike full-time employees, freelancers often struggle with:",
        challenges: [
          "Inconsistent workflow (some months are busier than others)",
          "Late payments from clients (leading to financial stress)",
          "Lack of benefits (healthcare, paid leave, retirement plans)"
        ],
        solution: "Freelancers are turning to retainer contracts and subscription-based services to ensure steady income.",
        type: "challenges"
      },
      {
        heading: "3.2 Work-Life Balance & Productivity Issues",
        text: "While freelancing offers flexibility, many remote workers face burnout due to:",
        issues: [
          "Overworking (not setting boundaries)",
          "Distractions at home (family, noise, social media)",
          "Lack of structured schedules"
        ],
        tip: "Using time-tracking tools like Toggl or RescueTime can help freelancers manage their workload efficiently.",
        type: "issues"
      },
      {
        heading: "3.3 Client Trust & Payment Security",
        text: "Many freelancers struggle with unpaid invoices and unreliable clients. To combat this, platforms now offer:",
        solutions: [
          "Escrow services (holding payments until work is completed)",
          "Smart contracts via blockchain (for automated payments)",
          "Freelance insurance (to protect against non-payment)"
        ],
        caseStudy: "A freelancer using Upwork's Payment Protection Plan successfully recovered $5,000 from a disputed project.",
        type: "solutions"
      },
      {
        heading: "4. Future-Proofing Your Freelance Career",
        text: "To stay ahead in the ever-changing freelancing landscape, adapting to new trends is crucial.",
        type: "section"
      },
      {
        heading: "4.1 Upskilling & Continuous Learning",
        text: "Freelancers must continuously upgrade their skills. Online platforms like Udemy, Coursera, and LinkedIn Learning offer courses in:",
        skills: [
          "AI & Data Science",
          "UI/UX Design",
          "SEO & Digital Marketing",
          "Blockchain Development"
        ],
        type: "skills"
      },
      {
        heading: "4.2 Building a Strong Online Presence",
        text: "A professional website, LinkedIn profile, and online portfolio can significantly boost a freelancer's credibility.",
        tip: "Optimizing a freelance portfolio with keywords like \"best UI/UX freelancer\" or \"expert JavaScript developer\" can increase client visibility.",
        type: "tip"
      },
      {
        heading: "4.3 Leveraging Community & Networking",
        text: "Freelancers who engage in networking are 3x more likely to land high-paying projects. Joining freelancing communities, attending virtual conferences, and participating in online forums (like Reddit's r/freelance) can open new opportunities.",
        type: "text"
      },
      {
        heading: "5. Conclusion: The Road Ahead for Remote Freelancers",
        text: "Freelancing and remote work are here to stay. The next decade will see:",
        points: [
          "More AI integration for automation",
          "Stronger global freelance markets",
          "Improved payment security & contracts",
          "Hybrid work models combining freelancing & part-time roles"
        ],
        conclusion: "For freelancers willing to adapt, upskill, and embrace new technologies, the future looks incredibly bright.",
        finalThought: "The freelance revolution is not just about working remotely—it's about owning your career, embracing flexibility, and shaping the future of work.",
        type: "conclusion"
      }
    ]
  },
  'competitive-rates': {
    id: 'competitive-rates',
    title: "Setting Competitive Rates as a Freelancer",
    description: "Learn effective pricing strategies, market analysis, and value-based pricing to optimize your freelance income while staying competitive.",
    category: "Business",
    readTime: 12,
    author: "Michael Chen",
    date: "March 2024",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3",
    content: [
      {
        heading: "Introduction",
        text: "One of the biggest challenges for freelancers is determining the right pricing for their services. Charging too little can lead to burnout and undervaluing skills, while charging too much might push potential clients away. A well-thought-out pricing strategy ensures fair compensation, client trust, and a sustainable freelancing career.",
        type: "text"
      },
      {
        heading: "In this guide, we'll explore:",
        bullets: [
          "How to calculate competitive and profitable rates",
          "Different pricing models and when to use them",
          "Factors influencing freelance rates",
          "Strategies to increase rates over time",
          "Tips for negotiating with clients effectively"
        ],
        text: "Let's dive into how you can set the right price and earn what you deserve as a freelancer!",
        type: "checklist"
      },
      {
        heading: "1. Understanding the Value of Your Work",
        type: "section"
      },
      {
        heading: "1.1 The Importance of Pricing Right",
        text: "Freelancers often make the mistake of guessing their rates rather than basing them on facts. Setting the right price helps you:",
        benefits: [
          "Earn fair compensation for your time and skills",
          "Attract the right clients who value quality work",
          "Prevent undercharging, which leads to burnout",
          "Build long-term financial stability"
        ],
        tip: "If a client immediately agrees to your price without hesitation, it may mean your rates are too low!",
        type: "benefits"
      },
      {
        heading: "1.2 Common Pricing Mistakes to Avoid",
        mistakes: [
          "Charging too low: Leads to overwork and low-quality clients",
          "Charging too high (without justification): May scare away potential clients",
          "Not considering expenses: Taxes, software, and business costs must be included",
          "Not adjusting rates over time: Rates should increase with experience and inflation"
        ],
        caseStudy: "A freelance designer charged $20/hour for years, only to realize industry rates were $50/hour. By raising rates and improving branding, they tripled earnings while working less.",
        type: "mistakes"
      },
      {
        heading: "2. How to Calculate Your Freelance Rate",
        type: "section"
      },
      {
        heading: "2.1 The Basic Formula for Setting Rates",
        text: "A simple way to calculate your minimum hourly rate:",
        formula: "(Annual Desired Income + Expenses + Taxes) ÷ Billable Hours Per Year = Hourly Rate",
        example: {
          title: "Example Calculation:",
          items: [
            "Annual income goal: $60,000",
            "Annual expenses: $5,000 (software, marketing, workspace)",
            "Taxes (25%): $15,000",
            "Total cost: $80,000",
            "Billable hours per year: 1,500 (assuming 30 hours/week of paid work)",
            "Minimum hourly rate: $80,000 ÷ 1,500 = $53/hour"
          ]
        },
        tip: "Freelancers should charge 1.5x–2x more than traditional employees to cover business costs.",
        type: "formula"
      },
      {
        heading: "2.2 Comparing Industry Rates",
        text: "Research the average market rate for your profession using:",
        resources: [
          "Upwork Rate Calculators",
          "Glassdoor & LinkedIn Salary Insights",
          "Freelancing communities (Reddit, Twitter, Facebook Groups)"
        ],
        rates: [
          { role: "Graphic Designers", range: "$40–$100/hour" },
          { role: "Web Developers", range: "$50–$150/hour" },
          { role: "SEO Specialists", range: "$60–$120/hour" },
          { role: "Video Editors", range: "$30–$80/hour" }
        ],
        tip: "If you have a niche skill (e.g., AI development, cybersecurity), you can charge premium rates.",
        type: "rates"
      },
      {
        heading: "3. Different Freelance Pricing Models",
        text: "Freelancers can choose different pricing structures depending on the project:",
        type: "section"
      },
      {
        heading: "3.1 Hourly Rate",
        pros: [
          "Best for ongoing work or undefined projects",
          "Clients pay only for the time spent"
        ],
        cons: [
          "Risk of earning less if highly efficient"
        ],
        whenToUse: "Consulting, support, maintenance work",
        type: "pricing-model"
      },
      {
        heading: "3.2 Project-Based Pricing",
        pros: [
          "Set price for entire project",
          "Earn based on value delivered, not hours worked"
        ],
        cons: [
          "Can result in scope creep (extra work without extra pay)"
        ],
        whenToUse: "Website design, branding, content creation",
        type: "pricing-model"
      },
      {
        heading: "3.3 Retainer Model",
        pros: [
          "Guaranteed income every month",
          "Long-term client relationship"
        ],
        cons: [
          "Clients may demand more work over time"
        ],
        whenToUse: "Monthly social media management, SEO services, coaching",
        type: "pricing-model"
      },
      {
        heading: "3.4 Value-Based Pricing",
        pros: [
          "Charge based on the client's ROI (return on investment)",
          "Can lead to high earnings"
        ],
        cons: [
          "Harder to justify for beginners"
        ],
        whenToUse: "High-impact work (e.g., ad campaigns, marketing strategy)",
        example: "A copywriter charging $500 per sales page that generates $50,000 in revenue is undervaluing their service!",
        type: "pricing-model"
      },
      {
        heading: "4. Factors That Influence Freelance Rates",
        text: "Several factors determine how much a freelancer can charge:",
        type: "section"
      },
      {
        heading: "4.1 Experience & Expertise",
        levels: [
          { level: "Beginners", rate: "$20–$50/hour" },
          { level: "Mid-level freelancers", rate: "$50–$100/hour" },
          { level: "Experts (10+ years experience)", rate: "$100–$300/hour" }
        ],
        tip: "Build a strong portfolio to justify higher rates!",
        type: "experience-levels"
      },
      {
        heading: "4.2 Location & Market Demand",
        text: "Freelance rates vary by region:",
        regions: [
          { region: "US, UK, Canada", rate: "Higher rates ($60+/hour)" },
          { region: "Asia, Eastern Europe", rate: "Competitive pricing ($20–$50/hour)" }
        ],
        tip: "Remote freelancers can charge US/European rates if they offer high-value services.",
        type: "location-rates"
      },
      {
        heading: "4.3 Client Type & Budget",
        clients: [
          { type: "Startup clients", description: "Lower budgets but long-term work" },
          { type: "Corporate clients", description: "Bigger budgets but higher expectations" }
        ],
        tip: "Position yourself for premium clients by showcasing high-quality work.",
        type: "client-types"
      },
      {
        heading: "5. How to Increase Your Freelance Rates",
        text: "If you're stuck at low rates, here's how to level up:",
        type: "section"
      },
      {
        heading: "5.1 Upskilling & Specialization",
        steps: [
          "Take online courses (Udemy, Coursera, LinkedIn Learning)",
          "Learn high-demand skills (AI, cybersecurity, automation)",
          "Get certifications (Google, HubSpot, AWS)"
        ],
        tip: "Specializing in niche industries (e.g., legal, medical, AI) allows you to charge higher rates.",
        type: "steps"
      },
      {
        heading: "5.2 Build a Strong Portfolio & Personal Brand",
        bullets: [
          "Showcase past projects & testimonials",
          "Use LinkedIn, Twitter, and a personal website",
          "Start a freelance blog or YouTube channel to establish authority"
        ],
        tip: "Position yourself as a trusted expert, not just another freelancer!",
        type: "bullets"
      },
      {
        heading: "5.3 Raising Rates for Existing Clients",
        text: "🚀 How to raise rates smoothly:",
        steps: [
          "Give advance notice (30–60 days)",
          "Justify increases (higher demand, new skills, inflation)",
          "Offer options (new packages, more value)"
        ],
        example: "\"Due to increasing demand and my growing expertise, my new rates will be $80/hour starting next month. I'd love to continue working together and ensure even better results.\"",
        type: "rate-increase"
      },
      {
        heading: "6. Negotiating Your Rates Like a Pro",
        text: "Many freelancers fear negotiation, but confident pricing leads to better clients and pay.",
        type: "section"
      },
      {
        heading: "6.1 Handling \"Your Rates Are Too High\"",
        wrong: "Okay, I can lower my rate.",
        better: [
          "Highlight value: \"My expertise ensures high-quality, error-free work.\"",
          "Compare industry rates: \"Similar professionals charge $100+ for this service.\"",
          "Offer flexible options: \"We can adjust the scope to fit your budget.\""
        ],
        tip: "NEVER start with your lowest rate—clients expect negotiations!",
        type: "negotiation"
      },
      {
        heading: "Conclusion: Charge What You're Worth",
        text: "Freelancers must balance competitive pricing with sustainable income. By understanding market trends, pricing models, and negotiation tactics, you can set rates that attract quality clients while growing your business.",
        finalThought: "Your skills are valuable—don't undersell yourself!",
        type: "conclusion"
      }
    ]
  },
  'client-communication': {
    id: 'client-communication',
    title: "Mastering Client Communication as a Freelancer",
    description: "Learn effective strategies for professional client communication, from setting expectations to handling difficult conversations, and build lasting client relationships.",
    category: "Skills",
    readTime: 15,
    author: "Emma Thompson",
    date: "March 2024",
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3",
    content: [
      {
        heading: "Introduction",
        text: "Effective client communication is the key to building long-term relationships, securing repeat business, and ensuring smooth project execution. Poor communication can lead to misunderstandings, missed deadlines, and lost opportunities.",
        type: "text"
      },
      {
        heading: "In this guide, we'll cover:",
        bullets: [
          "The importance of strong communication",
          "How to set clear expectations from the start",
          "Tips for handling difficult conversations",
          "Strategies for building trust and professionalism",
          "Best practices for email, messaging, and video calls"
        ],
        text: "By mastering client communication, you'll boost your reputation, reduce stress, and increase earnings as a freelancer!",
        type: "checklist"
      },
      {
        heading: "1. Understanding the Importance of Client Communication",
        type: "section"
      },
      {
        heading: "1.1 Why Communication Matters",
        text: "Clear and professional communication helps freelancers:",
        benefits: [
          "Avoid scope creep (extra unpaid work)",
          "Gain client trust and repeat business",
          "Maintain smooth workflows and timely payments",
          "Resolve issues quickly before they escalate"
        ],
        caseStudy: "A freelancer who failed to clarify deadlines ended up redoing an entire project for free. Lesson? Set expectations early!",
        type: "benefits"
      },
      {
        heading: "1.2 Common Communication Mistakes to Avoid",
        mistakes: [
          "Unclear project details: Leads to confusion and revisions",
          "Slow responses: Makes clients feel ignored",
          "Overpromising and underdelivering: Damages trust",
          "Lack of boundaries: Causes burnout"
        ],
        tip: "Always confirm details in writing (email, contract, or chat) to avoid misunderstandings.",
        type: "mistakes"
      },
      {
        heading: "2. Setting Clear Expectations from Day One",
        type: "section"
      },
      {
        heading: "2.1 How to Establish Expectations",
        text: "At the start of a project, discuss and document:",
        bullets: [
          "Scope of work (deliverables, features, revisions)",
          "Timelines (milestones, deadlines, delays)",
          "Pricing and payment terms (upfront fees, hourly vs. fixed rate)",
          "Communication channels (email, Slack, Zoom, WhatsApp)",
          "Working hours (availability, response time)"
        ],
        example: "Hi [Client], just to confirm: I'll deliver the first draft by [Date], with two revisions included. Communication will be via email, and I typically respond within 24 hours. Let me know if this works!",
        type: "bullets-highlight"
      },
      {
        heading: "2.2 Using Contracts to Avoid Confusion",
        text: "A contract protects both you and the client by defining:",
        bullets: [
          "Scope of work and deliverables",
          "Deadlines and payment terms",
          "Revisions and extra work charges",
          "Termination policy"
        ],
        tip: "Even a simple written agreement in an email is better than verbal promises!",
        type: "bullets"
      },
      {
        heading: "3. Communicating Effectively During the Project",
        type: "section"
      },
      {
        heading: "3.1 Best Practices for Emails & Messages",
        text: "Professional communication requires:",
        bullets: [
          "Be clear and concise (short sentences, bullet points)",
          "Use a professional tone (friendly yet business-like)",
          "Avoid jargon (unless client understands industry terms)",
          "Acknowledge messages promptly (even if you need time to respond)"
        ],
        example: {
          title: "Example Email Structure:",
          items: [
            "Subject: Update on [Project Name] – Next Steps",
            "Hi [Client],",
            "Here's a quick update on your project:",
            "✔️ Task 1: Completed ✅",
            "✔️ Task 2: In progress, expected by [Date]",
            "✔️ Task 3: Scheduled for next week",
            "Let me know if you have any feedback!",
            "Best,",
            "[Your Name]"
          ]
        },
        type: "formula"
      },
      {
        heading: "3.2 Managing Video Calls & Meetings",
        bullets: [
          "Prepare an agenda (avoid wasting time)",
          "Keep meetings short (15-30 minutes)",
          "Confirm key takeaways in writing"
        ],
        tip: "If a client is unclear on their needs, ask guided questions:\n\n\"What's the main goal of this project?\"\n\"Who is your target audience?\"\n\"What's your preferred style or format?\"",
        type: "bullets"
      },
      {
        heading: "4. Handling Difficult Client Conversations",
        type: "section"
      },
      {
        heading: "4.1 Dealing with Scope Creep",
        text: "Scope creep happens when a client requests extra work without additional payment.",
        example: "I'd love to help with this! Since it's outside our original agreement, I can provide a separate estimate for the additional work. Let me know how you'd like to proceed!",
        type: "tip"
      },
      {
        heading: "4.2 When a Client Delays Payment",
        text: "If a client hasn't paid on time:",
        steps: [
          "Send a friendly reminder: \"Just checking if the invoice has been processed.\"",
          "Follow up with a firm request: \"Payment was due on [Date]. Please confirm when it will be sent.\"",
          "Offer late fees or payment plans if needed"
        ],
        tip: "Always request an upfront deposit (30-50%) to reduce risks.",
        type: "rate-increase"
      },
      {
        heading: "4.3 Managing Client Criticism",
        wrong: "Getting defensive",
        better: [
          "Stay calm and listen actively",
          "Ask for specific examples",
          "Propose concrete solutions",
          "Document the conversation and next steps"
        ],
        example: "I appreciate your feedback! Could you clarify which parts need improvement? I'd be happy to adjust accordingly.",
        type: "negotiation"
      },
      {
        heading: "5. Building Strong Long-Term Client Relationships",
        type: "section"
      },
      {
        heading: "5.1 Providing Regular Updates",
        bullets: [
          "Send weekly progress reports",
          "Confirm project milestones in writing",
          "Ask for feedback before final delivery"
        ],
        tip: "Clients love freelancers who communicate proactively!",
        type: "bullets"
      },
      {
        heading: "5.2 Keeping a Positive & Professional Attitude",
        bullets: [
          "Always be respectful and patient",
          "Never complain about other clients or workload",
          "Say thank you and express appreciation"
        ],
        example: "Thanks for the great collaboration on this project! I appreciate your clear feedback and direction.",
        type: "bullets-highlight"
      },
      {
        heading: "5.3 Asking for Testimonials & Referrals",
        text: "Happy clients can bring more business through:",
        benefits: [
          "Positive reviews on LinkedIn, Upwork, or personal websites",
          "Referrals to friends and colleagues",
          "Repeat projects and long-term contracts"
        ],
        tip: "After completing a successful project, politely ask:\n\"Would you be open to leaving a testimonial? It would really help me grow my business!\"",
        type: "benefits"
      },
      {
        heading: "Conclusion: Communication is the Key to Freelance Success",
        text: "Mastering client communication ensures better projects, fewer misunderstandings, and more referrals. By setting clear expectations, responding professionally, and handling challenges gracefully, you'll establish yourself as a trusted expert in your field.",
        finalThought: "Strong communication skills are just as important as technical skills—practice them, and your freelancing career will thrive!",
        type: "conclusion"
      }
    ]
  },
  'freelance-tools': {
    id: 'freelance-tools',
    title: "Essential Tools for Modern Freelancers",
    description: "A comprehensive guide to the must-have tools and software that can streamline your freelance workflow and boost productivity.",
    category: "Technology",
    readTime: 15,
    author: "Alex Rodriguez",
    date: "March 2024",
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3",
    content: [
      {
        heading: "Introduction",
        text: "Freelancing requires more than just skill in your field—it demands organization, efficiency, and professionalism. The right tools can help you manage projects, communicate with clients, track finances, and boost productivity.",
        type: "text"
      },
      {
        heading: "In this guide, we'll cover:",
        bullets: [
          "Project Management Tools",
          "Time Tracking & Productivity Apps",
          "Communication & Collaboration Platforms",
          "Invoicing & Payment Solutions",
          "Marketing & Portfolio Tools"
        ],
        text: "Whether you're a designer, developer, writer, or consultant, these tools will help you work smarter, save time, and grow your business.",
        type: "checklist"
      },
      {
        heading: "1. Project Management Tools",
        text: "Handling multiple clients and deadlines can be overwhelming. Project management tools keep tasks organized, track progress, and ensure nothing falls through the cracks.",
        type: "section"
      },
      {
        heading: "Top Project Management Tools for Freelancers",
        tools: [
          { icon: "🔹", name: "Trello", description: "Simple, visual boards for task tracking" },
          { icon: "🔹", name: "Asana", description: "Advanced task management with timelines" },
          { icon: "🔹", name: "ClickUp", description: "All-in-one tool for tasks, docs, and collaboration" },
          { icon: "🔹", name: "Notion", description: "Combines note-taking, databases, and planning" },
          { icon: "🔹", name: "Monday.com", description: "Intuitive workflows for freelancers and teams" }
        ],
        bestFor: "Freelancers managing multiple projects with different clients.",
        tip: "Use Trello's Kanban boards to track project stages (To Do → In Progress → Completed).",
        type: "tool-list"
      },
      {
        heading: "2. Time Tracking & Productivity Apps",
        text: "Freelancers often juggle multiple projects, making time tracking essential for accurate invoicing and workload management.",
        type: "section"
      },
      {
        heading: "Best Time Tracking Apps",
        tools: [
          { icon: "⏳", name: "Toggl Track", description: "Simple and intuitive tracking for hourly billing" },
          { icon: "⏳", name: "Clockify", description: "Free time tracker with reporting features" },
          { icon: "⏳", name: "RescueTime", description: "Analyzes productivity and time spent on tasks" },
          { icon: "⏳", name: "Harvest", description: "Tracks time, expenses, and generates invoices" }
        ],
        bestFor: "Freelancers who bill clients by the hour or need to track project efficiency.",
        tip: "Use RescueTime to analyze your most productive hours and plan work accordingly.",
        type: "tool-list"
      },
      {
        heading: "3. Communication & Collaboration Platforms",
        text: "Clear and efficient communication helps freelancers avoid misunderstandings, maintain professionalism, and build strong client relationships.",
        type: "section"
      },
      {
        heading: "Best Communication Tools",
        tools: [
          { icon: "📩", name: "Slack", description: "Instant messaging and collaboration with clients" },
          { icon: "📩", name: "Zoom", description: "Video conferencing for virtual meetings" },
          { icon: "📩", name: "Google Meet", description: "Free, easy-to-use video calls" },
          { icon: "📩", name: "Microsoft Teams", description: "Great for corporate clients and group projects" },
          { icon: "📩", name: "Loom", description: "Screen recording for explaining projects visually" }
        ],
        bestFor: "Freelancers working remotely with international clients.",
        tip: "Use Loom to record quick video updates instead of long emails—it saves time and adds a personal touch.",
        type: "tool-list"
      },
      {
        heading: "4. Invoicing & Payment Solutions",
        text: "Getting paid on time is crucial for freelancers. Billing and payment tools help you send invoices, accept payments, and manage taxes.",
        type: "section"
      },
      {
        heading: "Top Invoicing & Payment Platforms",
        tools: [
          { icon: "💰", name: "PayPal", description: "Widely used for international payments" },
          { icon: "💰", name: "Wise", description: "Low-cost global money transfers" },
          { icon: "💰", name: "Payoneer", description: "Best for freelancers working with global marketplaces" },
          { icon: "💰", name: "QuickBooks", description: "Accounting and invoicing in one platform" },
          { icon: "💰", name: "Wave", description: "Free invoicing and expense tracking" }
        ],
        bestFor: "Freelancers needing easy, secure payment solutions.",
        tip: "Automate recurring invoices with QuickBooks to avoid payment delays.",
        type: "tool-list"
      },
      {
        heading: "5. Marketing & Portfolio Tools",
        text: "A strong online presence helps freelancers attract more clients and showcase their skills.",
        type: "section"
      },
      {
        heading: "Portfolio & Website Builders",
        tools: [
          { icon: "🌐", name: "Wix", description: "Drag-and-drop website builder" },
          { icon: "🌐", name: "WordPress", description: "Best for customizable websites" },
          { icon: "🌐", name: "Squarespace", description: "Stylish templates for creatives" },
          { icon: "🌐", name: "Behance", description: "Portfolio platform for designers" },
          { icon: "🌐", name: "Dribbble", description: "Showcase your creative work" }
        ],
        bestFor: "Freelancers who need a professional online portfolio.",
        tip: "Use LinkedIn and Behance to network and showcase work samples.",
        type: "tool-list"
      },
      {
        heading: "6. File Storage & Collaboration Tools",
        text: "Freelancers handle a lot of files—designs, contracts, project briefs—so having reliable storage is essential.",
        type: "section"
      },
      {
        heading: "Best File Storage & Collaboration Tools",
        tools: [
          { icon: "📂", name: "Google Drive", description: "Free cloud storage with real-time collaboration" },
          { icon: "📂", name: "Dropbox", description: "Secure file sharing with clients" },
          { icon: "📂", name: "OneDrive", description: "Microsoft's cloud storage for freelancers using Office" },
          { icon: "📂", name: "WeTransfer", description: "Simple way to send large files" }
        ],
        bestFor: "Freelancers needing secure and accessible file storage.",
        tip: "Use Google Drive folders to organize projects and share documents with clients.",
        type: "tool-list"
      },
      {
        heading: "7. Writing & Editing Tools",
        text: "Freelancers often need to write emails, reports, proposals, or content for clients. Editing tools help ensure clarity and professionalism.",
        type: "section"
      },
      {
        heading: "Best Writing & Editing Tools",
        tools: [
          { icon: "✍️", name: "Grammarly", description: "AI-powered grammar and spell check" },
          { icon: "✍️", name: "Hemingway Editor", description: "Helps simplify writing" },
          { icon: "✍️", name: "ProWritingAid", description: "Style and grammar improvements" },
          { icon: "✍️", name: "Google Docs", description: "Real-time editing and sharing" }
        ],
        bestFor: "Freelancers needing error-free communication and content creation.",
        tip: "Use Grammarly's tone detection to ensure your emails sound professional.",
        type: "tool-list"
      },
      {
        heading: "8. Contracts & Legal Tools",
        text: "Freelancers need to protect themselves with contracts that outline scope, payment terms, and ownership rights.",
        type: "section"
      },
      {
        heading: "Best Contract & Legal Tools",
        tools: [
          { icon: "📜", name: "Bonsai", description: "Contracts, invoicing, and proposals in one" },
          { icon: "📜", name: "HelloSign", description: "Simple e-signatures" },
          { icon: "📜", name: "Docracy", description: "Free legal contract templates" },
          { icon: "📜", name: "AND.CO", description: "All-in-one freelance management tool" }
        ],
        bestFor: "Freelancers who want legally binding contracts without hiring a lawyer.",
        tip: "Always send contracts before starting work to avoid disputes later.",
        type: "tool-list"
      },
      {
        heading: "Conclusion: The Right Tools Make Freelancing Easier",
        text: "Choosing the right tools helps freelancers stay organized, communicate effectively, manage finances, and grow their business.",
        summary: [
          { category: "Project Management", tools: "Trello, Asana" },
          { category: "Time Tracking", tools: "Toggl, Clockify" },
          { category: "Communication", tools: "Slack, Zoom" },
          { category: "Payments", tools: "PayPal, Wise" },
          { category: "Marketing", tools: "Wix, Behance" },
          { category: "File Storage", tools: "Google Drive, Dropbox" },
          { category: "Writing", tools: "Grammarly, Hemingway" },
          { category: "Contracts", tools: "Bonsai, HelloSign" }
        ],
        finalThought: "Invest in the right tools, and you'll spend less time on admin tasks and more time doing what you love—growing your freelance career!",
        type: "tool-summary"
      }
    ]
  }
};

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const textColor = "whiteAlpha.900";
  const bgColor = "dark.900";
  const cardBg = "whiteAlpha.100";
  const borderColor = "whiteAlpha.200";

  // Animation variants for the blast effect
  const blastVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      filter: "blur(10px)",
    },
    animate: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
        staggerChildren: 0.1
      }
    },
    exit: {
      scale: 1.2,
      opacity: 0,
      filter: "blur(10px)",
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [id]);

  if (!articles[id]) {
    return <Navigate to="/404" replace />;
  }

  const article = articles[id];

  const renderContent = (content) => {
    if (!content) return null;

    const cardStyle = {
      p: 6,
      bg: "whiteAlpha.100",
      borderRadius: "xl",
      borderLeft: "4px solid",
      backdropFilter: "blur(10px)",
      transition: "all 0.3s",
      _hover: {
        transform: "translateY(-2px)",
        bg: "whiteAlpha.200",
      },
    };

    const highlightStyle = {
      p: 4,
      bg: "whiteAlpha.100",
      borderRadius: "md",
      borderLeft: "4px solid",
      backdropFilter: "blur(8px)",
    };

    switch (content.type) {
      case "benefits":
  return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            {content.benefits && (
              <List spacing={3} mb={4}>
                {content.benefits.map((benefit, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Icon as={FaCheckCircle} color="green.400" mr={2} />
                    <Text color={textColor}>{benefit}</Text>
                  </ListItem>
                ))}
              </List>
            )}
            {content.additionalText && (
              <Text color={textColor} fontSize="lg">{content.additionalText}</Text>
            )}
          </Box>
        );

      case "stats":
        return (
          <Box {...cardStyle} borderColor="blue.400">
            {content.stats && (
              <List spacing={3}>
                {content.stats.map((stat, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Icon as={FaRocket} color="blue.400" mr={2} />
                    <Text color={textColor}>{stat}</Text>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        );

      case "bullets-highlight":
        return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            {content.bullets && (
              <List spacing={3} mb={4}>
                {content.bullets.map((bullet, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Icon as={FaCheckCircle} color="gold.400" mr={2} />
                    <Text color={textColor}>{bullet}</Text>
                  </ListItem>
                ))}
              </List>
            )}
            {content.highlight && (
              <Box {...highlightStyle} borderColor="gold.400">
                <HStack>
                  <Icon as={FaLightbulb} color="gold.400" />
                  <Text color="gold.100">{content.highlight}</Text>
                </HStack>
              </Box>
            )}
          </Box>
        );

      case "specialties":
        return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            {content.specialties && (
              <List spacing={3} mb={4}>
                {content.specialties.map((specialty, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Text mr={2}>{specialty.icon}</Text>
                    <Text color={textColor}>{specialty.text}</Text>
                  </ListItem>
                ))}
              </List>
            )}
            {content.conclusion && (
              <Text color={textColor} fontSize="lg" fontStyle="italic">
                {content.conclusion}
              </Text>
            )}
          </Box>
        );

      case "future-tech":
        return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            {content.innovations && (
              <Box
                p={4}
                bg="whiteAlpha.100"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="blue.400"
              >
                <Text color="blue.100" mb={2}>🌍 Future Tech Innovations:</Text>
                <List spacing={2}>
                  {content.innovations.map((innovation, index) => (
                    <ListItem key={index} display="flex" alignItems="center">
                      <Icon as={FaRocket} color="blue.400" mr={2} />
                      <Text color={textColor}>{innovation}</Text>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        );

      case "challenges":
      case "issues":
        return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            {(content.challenges || content.issues) && (
              <List spacing={3} mb={4}>
                {(content.challenges || content.issues).map((item, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Text mr={2}>❌</Text>
                    <Text color={textColor}>{item}</Text>
                  </ListItem>
                ))}
              </List>
            )}
            {(content.solution || content.tip) && (
              <Box
                p={4}
                bg="whiteAlpha.100"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="purple.400"
              >
                <HStack>
                  <Text mr={2}>💡</Text>
                  <Text color="purple.100">
                    {content.solution || content.tip}
                  </Text>
                </HStack>
              </Box>
            )}
          </Box>
        );

      case "solutions":
        return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            {content.solutions && (
              <List spacing={3} mb={4}>
                {content.solutions.map((solution, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Icon as={FaCheckCircle} color="green.400" mr={2} />
                    <Text color={textColor}>{solution}</Text>
                  </ListItem>
                ))}
              </List>
            )}
            {content.caseStudy && (
              <Box
                p={4}
                bg="whiteAlpha.100"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="blue.400"
              >
                <HStack>
                  <Text mr={2}>🔹</Text>
                  <Text color="blue.100">Case Study: {content.caseStudy}</Text>
                </HStack>
              </Box>
            )}
          </Box>
        );

      case "skills":
        return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            {content.skills && (
              <List spacing={3}>
                {content.skills.map((skill, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Text mr={2}>✅</Text>
                    <Text color={textColor}>{skill}</Text>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        );

      case "tip":
        return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            {content.tip && (
              <Box
                p={4}
                bg="whiteAlpha.100"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="yellow.400"
              >
                <HStack>
                  <Text mr={2}>💡</Text>
                  <Text color="yellow.100">SEO Tip: {content.tip}</Text>
                </HStack>
              </Box>
            )}
          </Box>
        );

      case "conclusion":
        return (
          <Box {...cardStyle} borderColor="purple.400">
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            {content.points && (
              <List spacing={3} mb={4}>
                {content.points.map((point, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Text mr={2}>✅</Text>
                    <Text color={textColor}>{point}</Text>
                  </ListItem>
                ))}
              </List>
            )}
            {content.conclusion && (
              <Text color={textColor} fontSize="lg" mb={4}>{content.conclusion}</Text>
            )}
            {content.finalThought && (
              <Box {...highlightStyle} borderColor="gold.400" mt={4}>
                <HStack>
                  <Icon as={FaLightbulb} color="gold.400" />
                  <Text color="gold.100">
                    <Text as="span" fontWeight="bold">Final Thought:</Text> {content.finalThought}
                  </Text>
                </HStack>
              </Box>
            )}
          </Box>
        );

      case "checklist":
        return (
          <Box {...cardStyle} borderColor="green.400">
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            {content.bullets && (
              <List spacing={3}>
                {content.bullets.map((bullet, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Icon as={FaCheckCircle} color="green.400" mr={2} />
                    <Text color={textColor}>{bullet}</Text>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        );

      case "mistakes":
        return (
          <Box>
            {content.mistakes && (
              <List spacing={3} mb={4}>
                {content.mistakes.map((mistake, index) => (
                  <ListItem key={index} display="flex" alignItems="center">
                    <Text mr={2}>🚫</Text>
                    <Text color={textColor}>{mistake}</Text>
                  </ListItem>
                ))}
              </List>
            )}
            {content.caseStudy && (
              <Box
                p={4}
                bg="whiteAlpha.100"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="orange.400"
              >
                <HStack>
                  <Text mr={2}>📌</Text>
                  <Text color="orange.100">Case Study: {content.caseStudy}</Text>
                </HStack>
              </Box>
            )}
          </Box>
        );

      case "formula":
        return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            {content.formula && (
              <Box
                p={6}
                bg="whiteAlpha.100"
              borderRadius="lg"
                textAlign="center"
                mb={4}
                borderLeft="4px solid"
                borderColor="gold.400"
              >
                <Text
                  fontSize="xl"
                  fontFamily="monospace"
                  color="gold.200"
                  fontWeight="bold"
                >
                  {content.formula}
                </Text>
              </Box>
            )}
            {content.example && (
              <Box {...highlightStyle} borderColor="gold.400">
                <Text color="gold.100" fontWeight="bold" mb={2}>
                  {content.example.title}
                </Text>
                <List spacing={2}>
                  {content.example.items.map((item, index) => (
                    <ListItem key={index} color={textColor}>
                      {item}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        );

      case "rates":
        return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            {content.rates && (
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} mb={4}>
                {content.rates.map((rate, index) => (
                  <Box
                key={index}
                    p={4}
                    bg="whiteAlpha.100"
                    borderRadius="lg"
                    borderLeft="4px solid"
                    borderColor="gold.400"
                  >
                    <Text color="gold.200" fontWeight="bold" mb={2}>
                      {rate.level}
                    </Text>
                    <Text color={textColor} fontSize="2xl" fontWeight="bold">
                      {rate.rate}
                    </Text>
                    {rate.experience && (
                      <Text color="whiteAlpha.700" fontSize="sm">
                        {rate.experience}
                      </Text>
                    )}
                  </Box>
                ))}
              </Grid>
            )}
          </Box>
        );

      case "pricing-model":
        return (
          <Box
            p={6}
            bg="whiteAlpha.50"
            borderRadius="lg"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <VStack spacing={4} align="stretch">
              {content.pros && (
                <Box>
                  <Text color="green.200" fontWeight="bold" mb={2}>
                    ✔️ Pros:
                  </Text>
                  <List spacing={2}>
                    {content.pros.map((pro, index) => (
                      <ListItem key={index} color={textColor}>
                        • {pro}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              {content.cons && (
                <Box>
                  <Text color="red.200" fontWeight="bold" mb={2}>
                    ❌ Cons:
                  </Text>
                  <List spacing={2}>
                    {content.cons.map((con, index) => (
                      <ListItem key={index} color={textColor}>
                        • {con}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              {content.whenToUse && (
                <Box>
                  <Text color="blue.200" fontWeight="bold" mb={2}>
                    💡 When to Use:
                  </Text>
                  <Text color={textColor}>{content.whenToUse}</Text>
                </Box>
              )}
              {content.example && (
                <Box
                  p={4}
                  bg="whiteAlpha.100"
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderColor="yellow.400"
                >
                  <HStack>
                    <Text mr={2}>📌</Text>
                    <Text color="yellow.100">{content.example}</Text>
                  </HStack>
                </Box>
              )}
            </VStack>
          </Box>
        );

      case "experience-levels":
        return (
          <Box>
            <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={4}>
              {content.levels.map((level, index) => (
                <Box
                  key={index}
                  p={4}
                  bg="whiteAlpha.100"
                  borderRadius="lg"
                  textAlign="center"
                >
                  <Text color="gold.200" fontWeight="bold" mb={2}>
                    {level.level}
                  </Text>
                  <Text color={textColor}>{level.rate}</Text>
                  </Box>
              ))}
            </Grid>
            <Box
              p={4}
              bg="whiteAlpha.100"
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="blue.400"
            >
              <HStack>
                <Text mr={2}>💡</Text>
                <Text color="blue.100">{content.tip}</Text>
              </HStack>
            </Box>
          </Box>
        );

      case "location-rates":
        return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>
              🌍 {content.text}
            </Text>
            <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
              {content.regions.map((region, index) => (
                <Box
                  key={index}
                  p={4}
                  bg="whiteAlpha.100"
                  borderRadius="lg"
                >
                  <Text color="gold.200" fontWeight="bold" mb={2}>
                    {region.region}
                  </Text>
                  <Text color={textColor}>{region.rate}</Text>
                </Box>
              ))}
            </Grid>
            <Box
              p={4}
              bg="whiteAlpha.100"
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="teal.400"
            >
              <HStack>
                <Text mr={2}>📌</Text>
                <Text color="teal.100">{content.tip}</Text>
                      </HStack>
            </Box>
          </Box>
        );

      case "client-types":
        return (
          <Box>
            <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
              {content.clients.map((client, index) => (
                <Box
                  key={index}
                  p={4}
                  bg="whiteAlpha.100"
                  borderRadius="lg"
                >
                  <Text color="gold.200" fontWeight="bold" mb={2}>
                    {client.type}
                  </Text>
                  <Text color={textColor}>{client.description}</Text>
                </Box>
              ))}
            </Grid>
            <Box
              p={4}
              bg="whiteAlpha.100"
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="cyan.400"
            >
              <HStack>
                <Text mr={2}>💡</Text>
                <Text color="cyan.100">{content.tip}</Text>
              </HStack>
            </Box>
          </Box>
        );

      case "steps":
      case "bullets":
        return (
          <Box>
            <List spacing={3} mb={4}>
              {(content.steps || content.bullets).map((item, index) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <Icon
                    as={FaCheckCircle}
                    color="green.400"
                    mr={2}
                  />
                  <Text color={textColor}>{item}</Text>
                </ListItem>
              ))}
            </List>
            <Box
              p={4}
              bg="whiteAlpha.100"
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="purple.400"
            >
              <HStack>
                <Text mr={2}>💡</Text>
                <Text color="purple.100">{content.tip}</Text>
              </HStack>
            </Box>
          </Box>
        );

      case "rate-increase":
        return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            <List spacing={3} mb={4}>
              {content.steps.map((step, index) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <Text mr={2}>{index + 1}️⃣</Text>
                  <Text color={textColor}>{step}</Text>
                </ListItem>
              ))}
            </List>
            <Box
              p={4}
              bg="whiteAlpha.100"
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="blue.400"
            >
                      <HStack>
                <Text mr={2}>📌</Text>
                <Text color="blue.100">Example: {content.example}</Text>
                      </HStack>
            </Box>
          </Box>
        );

      case "negotiation":
        return (
          <Box>
            <Box
              p={4}
              bg="red.900"
              borderRadius="md"
              mb={4}
              opacity={0.8}
            >
              <HStack>
                <Text mr={2}>🚫</Text>
                <Text color="red.100">Wrong response: "{content.wrong}"</Text>
              </HStack>
            </Box>
            <Box
              p={4}
              bg="green.900"
              borderRadius="md"
              mb={4}
              opacity={0.8}
            >
              <Text color="green.100" mb={2}>✅ Better responses:</Text>
              <List spacing={2}>
                {content.better.map((response, index) => (
                  <ListItem key={index} color="green.100">
                    • {response}
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box
              p={4}
              bg="whiteAlpha.100"
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="yellow.400"
            >
              <HStack>
                <Text mr={2}>📌</Text>
                <Text color="yellow.100">{content.tip}</Text>
              </HStack>
            </Box>
          </Box>
        );

      case "tool-list":
        return (
          <Box>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              {content.tools?.map((tool, index) => (
                    <Box
                      key={index}
                  p={4}
                  bg="whiteAlpha.100"
                      borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor="gold.400"
                      transition="all 0.3s"
                  _hover={{ transform: "translateY(-2px)", bg: "whiteAlpha.200" }}
                >
                  <HStack mb={2}>
                    <Text fontSize="xl">{tool.icon}</Text>
                    <Text color="gold.200" fontWeight="bold">{tool.name}</Text>
                  </HStack>
                  <Text color="whiteAlpha.800">{tool.description}</Text>
                </Box>
              ))}
            </Grid>
            {content.bestFor && (
              <Box {...highlightStyle} borderColor="purple.400" mt={4}>
                <Text color="purple.100">
                  <Text as="span" fontWeight="bold">Best For:</Text> {content.bestFor}
                        </Text>
              </Box>
            )}
            {content.tip && (
              <Box {...highlightStyle} borderColor="blue.400" mt={4}>
                <Text color="blue.100">
                  <Text as="span" fontWeight="bold">Pro Tip:</Text> {content.tip}
        </Text>
              </Box>
            )}
          </Box>
        );

      case "tool-summary":
        return (
          <Box>
            <Text color={textColor} fontSize="lg" mb={4}>{content.text}</Text>
            <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={6}>
              {content.summary && content.summary.map((item, index) => (
                <Box
                  key={index}
                  p={4}
                  bg="whiteAlpha.100"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                >
                  <Text color="gold.200" fontWeight="bold" mb={2}>
                    🔹 {item.category}
                  </Text>
                  <Text color={textColor}>{item.tools}</Text>
      </Box>
              ))}
            </Grid>
            {content.finalThought && (
              <Box {...highlightStyle} borderColor="gold.400" mt={4}>
                <HStack>
                  <Text mr={2}>🚀</Text>
                  <Text color="gold.100">Final Thought: {content.finalThought}</Text>
                </HStack>
              </Box>
            )}
          </Box>
        );

      default:
        return <Text color={textColor} fontSize="lg">{content.text}</Text>;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <MotionBox
        variants={blastVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        minH="100vh"
        bg={bgColor}
        py={20}
        position="relative"
        overflow="hidden"
      >
        {/* Background gradient effect */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="radial(circle at top right, rgba(255,215,0,0.1), transparent 70%)"
          opacity={0.3}
          pointerEvents="none"
        />

        <Container maxW="container.lg" position="relative" zIndex={1}>
          <VStack spacing={8} align="stretch">
            <Box position="fixed" top={20} left={4} zIndex={10}>
              <IconButton
                icon={<FaArrowLeft />}
                onClick={() => navigate(-1)}
                variant="ghost"
                color="white"
                size="lg"
                _hover={{ bg: "whiteAlpha.200" }}
                aria-label="Go back"
              />
            </Box>
            <HStack justify="flex-end">
              <Badge
                colorScheme="gold"
                px={3}
                py={1}
                borderRadius="full"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                {article.category}
              </Badge>
            </HStack>

            <MotionBox
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <VStack spacing={6} align="stretch">
                <Heading
                  size="2xl"
                  color={textColor}
                  bgGradient="linear(to-r, white, whiteAlpha.800)"
                  bgClip="text"
                  lineHeight="1.2"
                >
                  {article.title}
                </Heading>

                <HStack spacing={6} color="whiteAlpha.700">
                  <HStack>
                    <Icon as={FaUser} />
                    <Text>{article.author}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaClock} />
                    <Text>{article.readTime} min read</Text>
                  </HStack>
                  <Text>{article.date}</Text>
                </HStack>

                <Box
                  position="relative"
                  h="400px"
                  overflow="hidden"
                  borderRadius="xl"
                  boxShadow="2xl"
                >
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    w="full"
                    h="full"
                    objectFit="cover"
                    transition="transform 0.3s ease"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    h="50%"
                    bgGradient="linear(to-t, black, transparent)"
                    pointerEvents="none"
                  />
                </Box>

                <Text
                  fontSize="xl"
                  color="whiteAlpha.800"
                  lineHeight="tall"
                >
                  {article.description}
                </Text>

                <Divider borderColor={borderColor} />

                <VStack spacing={12} align="stretch">
                  {article.content.map((content, index) => (
                    <MotionBox
                      key={index}
                      variants={contentVariants}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      {content.heading && (
                        <Heading
                          size="lg"
                          color={textColor}
                          mb={4}
                          bgGradient="linear(to-r, gold.200, gold.400)"
                          bgClip="text"
                        >
                          {content.heading}
                        </Heading>
                      )}
                      {renderContent(content)}
                      {index < article.content.length - 1 && (
                        <Divider borderColor={borderColor} mt={8} />
                      )}
                    </MotionBox>
                  ))}
                </VStack>
                </VStack>
              </MotionBox>
          </VStack>
    </Container>
      </MotionBox>
    </AnimatePresence>
  );
};

const ArticleWithErrorBoundary = () => (
  <ArticleErrorBoundary>
    <Article />
  </ArticleErrorBoundary>
);

export default ArticleWithErrorBoundary;