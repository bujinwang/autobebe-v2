import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController';
import { rateLimiter } from '../middleware/rateLimiter';
import { validatePatientAppointment } from '../middleware/validation';

const router = Router();

// Public routes for patient appointments
// These routes don't require authentication but are protected by rate limiting and validation

/**
 * @swagger
 * /public/appointments/patient:
 *   post:
 *     summary: Create a new appointment for unauthenticated patients
 *     tags: [Public Appointments]
 *     description: Creates a new appointment without requiring authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientInfo
 *               - appointmentInfo
 *             properties:
 *               patientInfo:
 *                 type: object
 *                 required:
 *                   - name
 *                   - phone
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Patient's full name
 *                   phone:
 *                     type: string
 *                     description: Patient's phone number
 *                   email:
 *                     type: string
 *                     description: Patient's email address
 *               appointmentInfo:
 *                 type: object
 *                 required:
 *                   - clinicId
 *                   - purposeOfVisit
 *                   - symptoms
 *                 properties:
 *                   clinicId:
 *                     type: string
 *                     description: ID of the clinic
 *                   purposeOfVisit:
 *                     type: string
 *                     description: Reason for the appointment
 *                   symptoms:
 *                     type: string
 *                     description: Description of symptoms
 *                   followUpQuestions:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of follow-up questions
 *                   followUpAnswers:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of answers to follow-up questions
 *     responses:
 *       201:
 *         description: Appointment created successfully
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
 *                       type: integer
 *                     patientName:
 *                       type: string
 *                     patientPhone:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Invalid input data
 *       429:
 *         description: Too many requests - rate limit exceeded
 *       500:
 *         description: Server error
 */
router.post('/patient',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 50 }), // 5 requests per 1 minutes
  validatePatientAppointment,
  appointmentController.createPatientAppointment
);

export default router; 