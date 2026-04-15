import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import client from 'prom-client';
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

// Prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Custom HTTP metrics counters
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 1, 2, 5],
});

// Middleware
app.use(cors());
app.use(express.json());

// HTTP metrics middleware — must be before routes
app.use((req, res, next) => {
  const end = httpRequestDurationSeconds.startTimer();
  res.on('finish', () => {
    const route = req.route?.path ?? req.path;
    httpRequestsTotal.inc({ method: req.method, route, status: res.statusCode });
    end({ method: req.method, route, status: res.statusCode });
  });
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/comments', commentRoutes);

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

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
