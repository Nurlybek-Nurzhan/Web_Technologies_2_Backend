import express from 'express';
import {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} from '../controllers/programController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/programs
// @desc    Get all programs
// @access  Public
router.get('/', getPrograms);

// @route   GET /api/programs/:id
// @desc    Get single program by ID
// @access  Public
router.get('/:id', getProgramById);

// @route   POST /api/programs
// @desc    Create a new program
// @access  Private/Admin
router.post('/', protect, admin, createProgram);

// @route   PUT /api/programs/:id
// @desc    Update a program
// @access  Private/Admin
router.put('/:id', protect, admin, updateProgram);

// @route   DELETE /api/programs/:id
// @desc    Delete a program
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProgram);

export default router;
