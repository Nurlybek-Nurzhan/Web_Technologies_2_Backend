import Comment from '../models/Comment.js';
import Program from '../models/Program.js';

// @desc    Get comments for a program
// @route   GET /api/comments/program/:programId
export const getCommentsByProgram = async (req, res) => {
  try {
    const comments = await Comment.find({ program: req.params.programId })
      .populate('user', 'email role')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a comment on a program
// @route   POST /api/comments
export const createComment = async (req, res) => {
  try {
    const { text, rating, programId } = req.body;

    if (!text || !programId) {
      return res.status(400).json({ message: 'Please provide text and programId' });
    }

    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const comment = await Comment.create({
      text,
      rating: rating || 5,
      user: req.user._id,
      program: programId
    });

    const populated = await comment.populate('user', 'email role');
    res.status(201).json(populated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only the comment author or admin can update
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    if (req.body.text) comment.text = req.body.text;
    if (req.body.rating) comment.rating = req.body.rating;

    const updated = await comment.save();
    const populated = await updated.populate('user', 'email role');
    res.json(populated);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only the comment author or admin can delete
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
