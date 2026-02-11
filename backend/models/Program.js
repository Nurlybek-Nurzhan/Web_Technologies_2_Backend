import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Program name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['strength', 'cardio', 'flexibility', 'group'],
    lowercase: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [180, 'Duration cannot exceed 180 minutes']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  intensity: {
    type: String,
    required: [true, 'Intensity level is required'],
    enum: ['Low', 'Moderate', 'High', 'Very High']
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Maximum participants is required'],
    min: [1, 'Must have at least 1 participant'],
    max: [100, 'Cannot exceed 100 participants']
  },
  trainer: {
    type: String,
    required: [true, 'Trainer name is required'],
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  icon: {
    type: String,
    default: 'ri-heart-pulse-fill'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Program', programSchema);
