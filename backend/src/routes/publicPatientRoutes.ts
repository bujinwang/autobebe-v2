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
 *     tags: [Public Patients]
 *     description: Creates a new patient account without requiring authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - clinicId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Patient's full name
 *               phone:
 *                 type: string
 *                 description: Patient's phone number
 *                 pattern: ^\+?[\d\s-()]+$
 *               email:
 *                 type: string
 *                 description: Patient's email address
 *               clinicId:
 *                 type: string
 *                 description: ID of the clinic
 *     responses:
 *       201:
 *         description: Patient registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     email:
 *                       type: string
 *                     clinicId:
 *                       type: string
 *       400:
 *         description: Invalid input data
 *       429:
 *         description: Too many requests - rate limit exceeded
 */
router.post('/register',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 50 }), // 5 requests per 1 minutes
  validatePatientRegistration,
  patientController.registerPatient
);

export default router; 