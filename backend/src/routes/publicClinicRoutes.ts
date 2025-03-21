import { Router } from 'express';
import { clinicController } from '../controllers/clinicController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes for clinic information
// These routes don't require authentication but are protected by rate limiting

// Get clinic info by ID
router.get('/info',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 100 }), // 100 requests per 15 minutes
  clinicController.getClinicInfo
);

// Get list of available clinics
router.get('/list',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 100 }), // 100 requests per 15 minutes
  clinicController.listClinics
);

export default router; 