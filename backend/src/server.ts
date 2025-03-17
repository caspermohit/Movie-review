import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Review } from './models/Review';
import { Wishlist } from './models/Wishlist';
import { User } from './models/User';
import { auth } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-review';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    res.status(201).json({ user: { id: user._id, username, email }, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    res.json({ user: { id: user._id, username: user.username, email }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Protected Routes
app.get('/api/reviews/:type/:movieId', async (req, res) => {
  try {
    const { type, movieId } = req.params;
    console.log('Fetching reviews for:', { type, movieId });
    
    if (!movieId || !type) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    if (!['movie', 'tv', 'anime'].includes(type)) {
      return res.status(400).json({ message: 'Invalid content type' });
    }

    const reviews = await Review.find({ 
      movieId: parseInt(movieId), 
      contentType: type 
    })
    .populate('userId', 'username')
    .sort({ createdAt: -1 })
    .lean();
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

app.post('/api/reviews', auth, async (req, res) => {
  try {
    const { movieId, contentType, rating, comment, movieDetails } = req.body;

    if (!movieId || !contentType || !rating || !comment || !movieDetails) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!movieDetails.title || !movieDetails.overview || !movieDetails.posterPath) {
      return res.status(400).json({ message: 'Missing required movie details' });
    }

    const review = new Review({
      userId: req.user._id,
      movieId,
      contentType,
      movieDetails,
      rating,
      comment,
    });

    await review.save();
    await review.populate('userId', 'username');
    res.status(201).json(review);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review' });
  }
});

app.get('/api/wishlist', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user._id })
      .sort({ addedAt: -1 })
      .lean();
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
});

app.post('/api/wishlist', auth, async (req, res) => {
  try {
    const { movieId, contentType, movieDetails } = req.body;

    if (!movieId || !contentType || !movieDetails) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!movieDetails.title || !movieDetails.overview || !movieDetails.posterPath) {
      return res.status(400).json({ message: 'Missing required movie details' });
    }

    const existingItem = await Wishlist.findOne({ 
      userId: req.user._id,
      movieId, 
      contentType 
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Movie already in wishlist' });
    }

    const wishlistItem = new Wishlist({
      userId: req.user._id,
      movieId,
      contentType,
      movieDetails,
    });

    await wishlistItem.save();
    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
});

app.delete('/api/wishlist/:movieId/:contentType', auth, async (req, res) => {
  try {
    const { movieId, contentType } = req.params;

    const result = await Wishlist.findOneAndDelete({ 
      userId: req.user._id,
      movieId: parseInt(movieId), 
      contentType 
    });

    if (!result) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.json({ message: 'Removed from wishlist successfully' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Drop existing indexes to avoid conflicts
    await Promise.all([
      Review.collection.dropIndexes(),
      Wishlist.collection.dropIndexes(),
      User.collection.dropIndexes()
    ]).catch(err => console.warn('Error dropping indexes:', err));

    // Create new indexes
    await Promise.all([
      Review.collection.createIndex({ userId: 1, movieId: 1, contentType: 1 }),
      Review.collection.createIndex({ createdAt: -1 }),
      Wishlist.collection.createIndex({ userId: 1, movieId: 1, contentType: 1 }, { unique: true }),
      Wishlist.collection.createIndex({ addedAt: -1 }),
      User.collection.createIndex({ email: 1 }, { unique: true }),
      User.collection.createIndex({ username: 1 }, { unique: true })
    ]);

    console.log('Indexes created successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 