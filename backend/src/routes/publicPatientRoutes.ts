import { Router } from 'express';
import { patientController } from '../controllers/patientController';
import { validatePatientRegistration } from '../middleware/validation';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes for patient registration
// These routes don't require authentication but are protected by rate limiting and validation

/**
 * @swagger
 * /public/patients/register:
 *   post:
 *     summary: Register a new patient (public access)
 *     tags: [Public]
 *     description: Creates a new patient account without requiring authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - dateOfBirth
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient registered successfully
 *       400:
 *         description: Invalid input data
 *       429:
 *         description: Too many requests - rate limit exceeded
 */
router.post('/register',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 5 }), // 5 requests per 1 minutes
  validatePatientRegistration,
  patientController.registerPatient
);

export default router; 