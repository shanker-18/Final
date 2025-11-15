import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import projectsRouter from './routes/projects.js';
import surveyRouter from './routes/survey.js';
import chatRouter from './routes/chat.js';
import userChatRouter from './routes/userChat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Freelance backend is running' });
});

// API Routes
app.use('/api/projects', projectsRouter);
app.use('/api/survey', surveyRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user-chat', userChatRouter);

// Start server after connecting to DB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});
