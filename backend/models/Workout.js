import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  exercise: {
    type: String,
    required: [true, 'Exercise type is required'],
    trim: true,
    maxlength: [100, 'Exercise name cannot exceed 100 characters']
  },
  sets: {
    type: Number,
    required: [true, 'Number of sets is required'],
    min: [1, 'Must have at least 1 set'],
    max: [20, 'Cannot exceed 20 sets']
  },
  reps: {
    type: Number,
    required: [true, 'Number of reps is required'],
    min: [1, 'Must have at least 1 rep'],
    max: [100, 'Cannot exceed 100 reps']
  },
  weight: {
    type: Number,
    default: 0,
    min: [0, 'Weight cannot be negative'],
    max: [500, 'Weight cannot exceed 500 kg']
  },
  duration: {
    type: Number,
    default: 0,
    min: [0, 'Duration cannot be negative'],
    max: [300, 'Duration cannot exceed 300 minutes']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Strength Training', 'Cardio', 'Flexibility', 'HIIT', 'Sports', 'Other']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  userName: {
    type: String,
    default: 'Anonymous',
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Workout', workoutSchema);
