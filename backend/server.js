import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import programRoutes from './routes/programs.js';
import workoutRoutes from './routes/workouts.js';
import authRoutes from './routes/auth.js';
import commentRoutes from './routes/comments.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/comments', commentRoutes);

// Root route - serve frontend index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Catch-all for frontend page routes
app.get('/pages/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', req.path));
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to FitClub API',
    endpoints: {
      auth: '/api/auth',
      programs: '/api/programs',
      workouts: '/api/workouts',
      comments: '/api/comments'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
