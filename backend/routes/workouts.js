import express from 'express';
import Workout from '../models/Workout.js';

const router = express.Router();

// @route   GET /api/workouts
// @desc    Get all workouts
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ createdAt: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/workouts/:id
// @desc    Get single workout by ID
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/workouts
// @desc    Create a new workout
router.post('/', async (req, res) => {
  try {
    const { name, exercise, sets, reps, weight, duration, category, notes, userName } = req.body;

    // Validation
    if (!name || !exercise || !sets || !reps || !category) {
      return res.status(400).json({ message: 'Please provide all required fields: name, exercise, sets, reps, category' });
    }

    const workout = new Workout({
      name,
      exercise,
      sets,
      reps,
      weight: weight || 0,
      duration: duration || 0,
      category,
      notes: notes || '',
      userName: userName || 'Anonymous'
    });

    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update a workout
router.put('/:id', async (req, res) => {
  try {
    const { name, exercise, sets, reps, weight, duration, category, notes, userName } = req.body;

    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Update fields
    workout.name = name || workout.name;
    workout.exercise = exercise || workout.exercise;
    workout.sets = sets || workout.sets;
    workout.reps = reps || workout.reps;
    workout.weight = weight !== undefined ? weight : workout.weight;
    workout.duration = duration !== undefined ? duration : workout.duration;
    workout.category = category || workout.category;
    workout.notes = notes !== undefined ? notes : workout.notes;
    workout.userName = userName || workout.userName;

    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Workout not found' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout
router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
