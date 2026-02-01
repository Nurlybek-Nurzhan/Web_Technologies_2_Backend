import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Program from './models/Program.js';
import Workout from './models/Workout.js';
import User from './models/User.js';

dotenv.config();

// Sample Users Data
const usersData = [
  {
    email: 'admin@fitclub.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    email: 'user@fitclub.com',
    password: 'user123',
    role: 'user'
  }
];

// Sample Programs Data
const programsData = [
  {
    name: 'PowerLift Pro',
    description: 'Advanced powerlifting program focusing on deadlifts, squats, and bench press. Perfect for building maximum strength.',
    category: 'strength',
    duration: 60,
    price: 80,
    intensity: 'High',
    maxParticipants: 8,
    trainer: 'Mike R.',
    icon: 'ri-boxing-fill',
    features: ['Personal form coaching', 'Progressive overload system', 'Competition preparation']
  },
  {
    name: 'Muscle Builder',
    description: 'Hypertrophy-focused program designed to build lean muscle mass through targeted resistance training.',
    category: 'strength',
    duration: 45,
    price: 65,
    intensity: 'Moderate',
    maxParticipants: 12,
    trainer: 'Tom K.',
    icon: 'ri-sword-line',
    features: ['Muscle-specific workouts', 'Nutrition guidance included', 'Progress tracking system']
  },
  {
    name: 'HIIT Blast',
    description: 'High-intensity interval training designed to maximize fat burn and improve cardiovascular fitness in minimal time.',
    category: 'cardio',
    duration: 30,
    price: 55,
    intensity: 'Very High',
    maxParticipants: 15,
    trainer: 'Sarah M.',
    icon: 'ri-heart-pulse-fill',
    features: ['Fat burning optimization', 'Time-efficient workouts', 'Variety of exercises']
  },
  {
    name: 'Cardio Endurance',
    description: 'Build cardiovascular endurance through varied cardio exercises including running, cycling, and rowing.',
    category: 'cardio',
    duration: 45,
    price: 50,
    intensity: 'Moderate',
    maxParticipants: 20,
    trainer: 'Amy S.',
    icon: 'ri-run-line',
    features: ['Heart rate monitoring', 'Endurance building', 'Multiple cardio options']
  },
  {
    name: 'Yoga Flow',
    description: 'Mindful yoga practice focusing on flexibility, balance, and inner peace through flowing movements.',
    category: 'flexibility',
    duration: 60,
    price: 45,
    intensity: 'Low',
    maxParticipants: 25,
    trainer: 'Emma L.',
    icon: 'ri-leaf-line',
    features: ['Stress reduction', 'Flexibility improvement', 'Mindfulness training']
  },
  {
    name: 'Mobility Masters',
    description: 'Dedicated mobility work to improve range of motion, reduce injury risk, and enhance overall movement quality.',
    category: 'flexibility',
    duration: 45,
    price: 40,
    intensity: 'Low',
    maxParticipants: 15,
    trainer: 'Alex D.',
    icon: 'ri-stretch-line',
    features: ['Joint mobility', 'Injury prevention', 'Movement assessment']
  },
  {
    name: 'Dance Fitness',
    description: 'Fun, energetic dance-based fitness class that combines cardio with popular music and choreography.',
    category: 'group',
    duration: 50,
    price: 35,
    intensity: 'Moderate',
    maxParticipants: 30,
    trainer: 'Lisa P.',
    icon: 'ri-music-line',
    features: ['Fun & engaging', 'Full body workout', 'Social environment']
  },
  {
    name: 'Bootcamp Challenge',
    description: 'Military-inspired group training combining strength, cardio, and team-building exercises.',
    category: 'group',
    duration: 45,
    price: 60,
    intensity: 'High',
    maxParticipants: 20,
    trainer: 'Jake W.',
    icon: 'ri-team-line',
    features: ['Team motivation', 'Full body conditioning', 'Mental toughness']
  }
];

// Sample Workouts Data
const workoutsData = [
  {
    name: 'Morning Push Day',
    exercise: 'Bench Press',
    sets: 4,
    reps: 10,
    weight: 80,
    duration: 45,
    category: 'Strength Training',
    notes: 'Felt strong today, increased weight by 5kg',
    userName: 'Mike Rodriguez'
  },
  {
    name: 'Leg Day Blast',
    exercise: 'Squats',
    sets: 5,
    reps: 8,
    weight: 100,
    duration: 60,
    category: 'Strength Training',
    notes: 'Heavy session, good form throughout',
    userName: 'Sarah Mitchell'
  },
  {
    name: 'Quick HIIT Session',
    exercise: 'Burpees',
    sets: 5,
    reps: 15,
    weight: 0,
    duration: 25,
    category: 'HIIT',
    notes: 'Great cardio workout',
    userName: 'James Davis'
  },
  {
    name: 'Evening Yoga',
    exercise: 'Sun Salutation Flow',
    sets: 3,
    reps: 10,
    weight: 0,
    duration: 45,
    category: 'Flexibility',
    notes: 'Relaxing end to the day',
    userName: 'Anna Martinez'
  },
  {
    name: 'Back & Biceps',
    exercise: 'Deadlift',
    sets: 4,
    reps: 6,
    weight: 120,
    duration: 50,
    category: 'Strength Training',
    notes: 'Personal record!',
    userName: 'Sophie Chen'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Program.deleteMany({});
    await Workout.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Insert users (password hashing handled by User model pre-save hook)
    for (const userData of usersData) {
      await User.create({
        email: userData.email,
        password: userData.password,
        role: userData.role
      });
    }
    console.log(`Inserted ${usersData.length} users`);
    console.log('  Admin: admin@fitclub.com / admin123');
    console.log('  User:  user@fitclub.com / user123');

    // Insert programs
    const programs = await Program.insertMany(programsData);
    console.log(`Inserted ${programs.length} programs`);

    // Insert workouts
    const workouts = await Workout.insertMany(workoutsData);
    console.log(`Inserted ${workouts.length} workouts`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
