import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
  },
  contentType: {
    type: String,
    enum: ['movie', 'tv', 'anime'],
    required: true,
  },
  userName: {
    type: String,
    required: true,
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
reviewSchema.index({ movieId: 1, contentType: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review; 