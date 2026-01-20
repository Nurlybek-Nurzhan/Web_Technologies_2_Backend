import express from 'express';
import Program from '../models/Program.js';

const router = express.Router();

// @route   GET /api/programs
// @desc    Get all programs
router.get('/', async (req, res) => {
  try {
    const programs = await Program.find().sort({ createdAt: -1 });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/programs/:id
// @desc    Get single program by ID
router.get('/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    res.json(program);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/programs
// @desc    Create a new program
router.post('/', async (req, res) => {
  try {
    const { name, description, category, duration, price, intensity, maxParticipants, trainer, features, icon } = req.body;

    // Validation
    if (!name || !description || !category || !duration || !price || !intensity || !maxParticipants || !trainer) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const program = new Program({
      name,
      description,
      category,
      duration,
      price,
      intensity,
      maxParticipants,
      trainer,
      features: features || [],
      icon: icon || 'ri-heart-pulse-fill'
    });

    const savedProgram = await program.save();
    res.status(201).json(savedProgram);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/programs/:id
// @desc    Update a program
router.put('/:id', async (req, res) => {
  try {
    const { name, description, category, duration, price, intensity, maxParticipants, trainer, features, icon } = req.body;

    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // Update fields
    program.name = name || program.name;
    program.description = description || program.description;
    program.category = category || program.category;
    program.duration = duration || program.duration;
    program.price = price || program.price;
    program.intensity = intensity || program.intensity;
    program.maxParticipants = maxParticipants || program.maxParticipants;
    program.trainer = trainer || program.trainer;
    program.features = features || program.features;
    program.icon = icon || program.icon;

    const updatedProgram = await program.save();
    res.json(updatedProgram);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Program not found' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/programs/:id
// @desc    Delete a program
router.delete('/:id', async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    await Program.findByIdAndDelete(req.params.id);
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
