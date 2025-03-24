import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
    clinicId?: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    const decoded = authService.verifyToken(token) as { userId: number; email: string; role: string; clinicId?: string };
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorizeStaff = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  // Allow SUPER_ADMINs to access everything
  if (req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  // Get the requested clinic ID from various possible sources
  const requestedClinicId = req.params.clinicId || req.query.clinicId || req.body.clinicId;

  // Allow CLINIC_ADMINs to access their clinic
  if (req.user.role === 'CLINIC_ADMIN') {
    if (!req.user.clinicId) {
      return res.status(403).json({ message: 'Clinic administrator is not associated with any clinic.' });
    }
    if (requestedClinicId && requestedClinicId !== req.user.clinicId) {
      return res.status(403).json({ message: 'Access denied. You can only access data from your own clinic.' });
    }
    return next();
  }

  // Check if user is staff
  if (req.user.role !== 'STAFF') {
    return res.status(403).json({ message: 'Access denied. Staff only.' });
  }

  // For staff, ensure they can only access their own clinic's data
  if (!req.user.clinicId) {
    return res.status(403).json({ message: 'Staff member is not associated with any clinic.' });
  }

  if (requestedClinicId && requestedClinicId !== req.user.clinicId) {
    return res.status(403).json({ message: 'Access denied. You can only access data from your own clinic.' });
  }

  next();
};

export const authorizePatient = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'PATIENT') {
    return res.status(403).json({ message: 'Access denied. Patients only.' });
  }
  next();
};

export const authorizeClinicAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  // Allow SUPER_ADMINs to access everything
  if (req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  if (req.user.role !== 'CLINIC_ADMIN') {
    return res.status(403).json({ message: 'Access denied. Clinic administrators only.' });
  }

  // For clinic admins, ensure they can only access their own clinic's data
  const requestedClinicId = req.params.clinicId || req.query.clinicId || req.body.clinicId;
  
  if (!req.user.clinicId) {
    return res.status(403).json({ message: 'Clinic administrator is not associated with any clinic.' });
  }

  if (requestedClinicId && requestedClinicId !== req.user.clinicId) {
    return res.status(403).json({ message: 'Access denied. You can only access data from your own clinic.' });
  }

  next();
};

export const authorizeStaffSelfUpdate = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  // Allow SUPER_ADMINs to access everything
  if (req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  // Allow CLINIC_ADMINs to update any staff in their clinic
  if (req.user.role === 'CLINIC_ADMIN') {
    if (!req.user.clinicId) {
      return res.status(403).json({ message: 'Clinic administrator is not associated with any clinic.' });
    }
    return next();
  }

  // For staff members, ensure they can only update their own profile
  const staffId = parseInt(req.query.id as string) || req.body.id;
  if (!staffId || staffId !== req.user.userId) {
    return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
  }

  next();
}; 