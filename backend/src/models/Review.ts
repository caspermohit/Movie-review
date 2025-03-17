import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for better query performance
reviewSchema.index({ userId: 1, movieId: 1, contentType: 1 });
reviewSchema.index({ createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema); 