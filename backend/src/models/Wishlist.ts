import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  contentType: {
    type: String,
    enum: ['movie', 'tv', 'anime'],
    required: true,
  },
  movieDetails: {
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    posterPath: {
      type: String,
      required: true,
    }
  },
  addedAt: {
    type: Date,
    default: Date.now,
  }
});

// Create indexes for better query performance
wishlistSchema.index({ userId: 1, movieId: 1, contentType: 1 }, { unique: true });
wishlistSchema.index({ addedAt: -1 });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema); 