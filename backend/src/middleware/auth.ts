import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'movie-review-secret-key-2024';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No Authorization header found' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token found in Authorization header' });
    }

    try {
      console.log('JWT_SECRET:', JWT_SECRET); // Debug log
      const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
      console.log('Decoded token:', decoded); // Debug log
      
      const user = await User.findOne({ _id: decoded._id });
      console.log('Found user:', user ? 'yes' : 'no'); // Debug log

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
}; 