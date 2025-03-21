import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController';
import { authenticate, authorizeStaff } from '../middleware/auth';
import { createAppointmentValidation } from '../middleware/appointmentValidation';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - patientId
 *         - clinicId
 *         - appointmentDate
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the appointment
 *         patientId:
 *           type: integer
 *           description: ID of the patient
 *         clinicId:
 *           type: string
 *           description: ID of the clinic
 *         doctorId:
 *           type: integer
 *           description: ID of the assigned doctor
 *         appointmentDate:
 *           type: string
 *           format: date-time
 *           description: Date and time of the appointment
 *         status:
 *           type: string
 *           description: Status of the appointment (e.g., 'Pending', 'Confirmed', 'in-progress')
 *         purposeOfVisit:
 *           type: string
 *           description: Purpose or reason for the visit
 *         symptoms:
 *           type: string
 *           description: Description of patient symptoms
 *         followUpQuestions:
 *           type: string
 *           description: Additional questions from healthcare provider
 *         followUpAnswers:
 *           type: string
 *           description: Answers to follow-up questions
 *         possibleTreatments:
 *           type: string
 *           description: Suggested treatments
 *         suggestedPrescriptions:
 *           type: string
 *           description: Suggested medications
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clinicId
 *         schema:
 *           type: string
 *         description: Filter by clinic ID
 *     responses:
 *       200:
 *         description: A list of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, appointmentController.getAllAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The appointment ID
 *     responses:
 *       200:
 *         description: Appointment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', authenticate, appointmentController.getAppointmentById);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, createAppointmentValidation, appointmentController.createAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', authenticate, appointmentController.updateAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The appointment ID
 *     responses:
 *       204:
 *         description: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, appointmentController.deleteAppointment);

/**
 * @swagger
 * /appointments/{id}/take:
 *   put:
 *     summary: Doctor takes the appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The appointment ID
 *     responses:
 *       200:
 *         description: Appointment assigned to doctor successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id/take', authenticate, appointmentController.takeInAppointment);

// Get appointments by date
router.get('/date/:date', authorizeStaff, appointmentController.getAppointmentsByDate);

// Add the missing route for getting appointments by patient ID
router.get('/patient/:patientId', authorizeStaff, appointmentController.getAppointmentsByPatientId);

export default router;