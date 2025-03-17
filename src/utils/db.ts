import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = import.meta.env.VITE_MONGODB_URI;
    
    if (!mongoURI) {
      console.error('MongoDB URI is not defined in environment variables');
      throw new Error('MongoDB URI is required');
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    // Instead of using process.exit, throw an error that can be handled by the caller
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectDB; 