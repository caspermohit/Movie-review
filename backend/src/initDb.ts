import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Review } from './models/Review';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-review';

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the database instance
    const db = mongoose.connection.db;

    // Create reviews collection if it doesn't exist
    const collections = await db.listCollections().toArray();
    if (!collections.some(c => c.name === 'reviews')) {
      await db.createCollection('reviews', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['movieId', 'contentType', 'rating', 'comment', 'createdAt'],
            properties: {
              movieId: {
                bsonType: 'number',
                description: 'must be a number and is required'
              },
              contentType: {
                enum: ['movie', 'tv', 'anime'],
                description: 'must be one of: movie, tv, anime and is required'
              },
              rating: {
                bsonType: 'number',
                minimum: 1,
                maximum: 5,
                description: 'must be a number between 1 and 5 and is required'
              },
              comment: {
                bsonType: 'string',
                description: 'must be a string and is required'
              },
              createdAt: {
                bsonType: 'date',
                description: 'must be a date and is required'
              }
            }
          }
        }
      });
      console.log('Reviews collection created');
    }

    // Create indexes
    await Promise.all([
      Review.collection.createIndex({ movieId: 1, contentType: 1 }),
      Review.collection.createIndex({ createdAt: -1 })
    ]);
    console.log('Indexes created');

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the initialization
initializeDatabase(); 