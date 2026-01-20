import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import programRoutes from './routes/programs.js';
import workoutRoutes from './routes/workouts.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/programs', programRoutes);
app.use('/api/workouts', workoutRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FitClub API',
    endpoints: {
      programs: '/api/programs',
      workouts: '/api/workouts'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
