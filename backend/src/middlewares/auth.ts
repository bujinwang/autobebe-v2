import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    const decoded = authService.verifyToken(token) as { userId: number; role: string };
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorizeStaff = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'STAFF') {
    return res.status(403).json({ message: 'Access denied. Staff only.' });
  }
  next();
};

export const authorizePatient = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'PATIENT') {
    return res.status(403).json({ message: 'Access denied. Patients only.' });
  }
  next();
}; 