import Workout from '../models/Workout.js';

// @desc    Get all workouts
// @route   GET /api/workouts
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().populate('createdBy', 'email role').sort({ createdAt: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single workout by ID
// @route   GET /api/workouts/:id
export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate('createdBy', 'email role');

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
};

// @desc    Create a new workout
// @route   POST /api/workouts
export const createWorkout = async (req, res) => {
  try {
    const { name, exercise, sets, reps, weight, duration, category, notes, userName } = req.body;

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
      userName: userName || 'Anonymous',
      createdBy: req.user._id
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
};

// @desc    Update a workout
// @route   PUT /api/workouts/:id
export const updateWorkout = async (req, res) => {
  try {
    const { name, exercise, sets, reps, weight, duration, category, notes, userName } = req.body;

    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

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
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
export const deleteWorkout = async (req, res) => {
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
};
