import Program from '../models/Program.js';

// @desc    Get all programs
// @route   GET /api/programs
export const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ createdAt: -1 });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single program by ID
// @route   GET /api/programs/:id
export const getProgramById = async (req, res) => {
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
};

// @desc    Create a new program
// @route   POST /api/programs
export const createProgram = async (req, res) => {
  try {
    const { name, description, category, duration, price, intensity, maxParticipants, trainer, features, icon } = req.body;

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
};

// @desc    Update a program
// @route   PUT /api/programs/:id
export const updateProgram = async (req, res) => {
  try {
    const { name, description, category, duration, price, intensity, maxParticipants, trainer, features, icon } = req.body;

    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

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
};

// @desc    Delete a program
// @route   DELETE /api/programs/:id
export const deleteProgram = async (req, res) => {
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
};
