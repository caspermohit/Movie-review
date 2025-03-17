import mongoose from 'mongoose';

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/movie-review';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}; 