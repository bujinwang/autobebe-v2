import { Router } from 'express';
import { patientController } from '../controllers/patientController';
import { validatePatientRegistration } from '../middleware/validation';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes for patient registration
// These routes don't require authentication but are protected by rate limiting and validation

// Register new patient
router.post('/register',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 5 }), // 5 requests per 1 minutes
  validatePatientRegistration,
  patientController.registerPatient
);

export default router; 