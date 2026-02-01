import express from 'express';
import {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout
} from '../controllers/workoutController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/workouts
// @desc    Get all workouts
// @access  Public
router.get('/', getWorkouts);

// @route   GET /api/workouts/:id
// @desc    Get single workout by ID
// @access  Public
router.get('/:id', getWorkoutById);

// @route   POST /api/workouts
// @desc    Create a new workout
// @access  Private/Admin
router.post('/', protect, admin, createWorkout);

// @route   PUT /api/workouts/:id
// @desc    Update a workout
// @access  Private/Admin
router.put('/:id', protect, admin, updateWorkout);

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteWorkout);

export default router;
