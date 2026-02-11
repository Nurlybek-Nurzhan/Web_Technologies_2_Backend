import express from 'express';
import {
  getCommentsByProgram,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/comments/program/:programId
// @desc    Get all comments for a program
// @access  Public
router.get('/program/:programId', getCommentsByProgram);

// @route   POST /api/comments
// @desc    Create a comment
// @access  Private (any logged-in user)
router.post('/', protect, createComment);

// @route   PUT /api/comments/:id
// @desc    Update a comment
// @access  Private (comment author or admin)
router.put('/:id', protect, updateComment);

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private (comment author or admin)
router.delete('/:id', protect, deleteComment);

export default router;
