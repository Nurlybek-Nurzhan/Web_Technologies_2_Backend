import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import programRoutes from './routes/programs.js';
import workoutRoutes from './routes/workouts.js';
import authRoutes from './routes/auth.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/workouts', workoutRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FitClub API',
    endpoints: {
      auth: '/api/auth',
      programs: '/api/programs',
      workouts: '/api/workouts'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
