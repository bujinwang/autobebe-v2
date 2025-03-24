import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController';
import { rateLimiter } from '../middleware/rateLimiter';
import { validatePatientAppointment } from '../middleware/validation';

const router = Router();

// Public routes for patient appointments
// These routes don't require authentication but are protected by rate limiting and validation

// Create a new appointment for unauthenticated patients
router.post('/patient',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 50 }), // 5 requests per 1 minutes
  validatePatientAppointment,
  appointmentController.createPatientAppointment
);

export default router; 