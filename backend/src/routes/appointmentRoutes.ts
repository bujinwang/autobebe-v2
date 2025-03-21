import { Router } from 'express';
import { appointmentController } from '../controllers/appointmentController';
import { authenticate, authorizeStaff } from '../middleware/auth';
import { createAppointmentValidation } from '../middleware/appointmentValidation';

const router = Router();

// Protect all appointment routes with authentication
router.use(authenticate);

// Get all appointments for a clinic
router.get('/', authorizeStaff, appointmentController.getAllAppointments);

// Get appointment by ID
router.get('/:id', authorizeStaff, appointmentController.getAppointmentById);

// Create new appointment
router.post('/', authorizeStaff, createAppointmentValidation, appointmentController.createAppointment);

// Update appointment
router.put('/:id', authorizeStaff, appointmentController.updateAppointment);

// Delete appointment
router.delete('/:id', authorizeStaff, appointmentController.deleteAppointment);

// Get appointments by date
router.get('/date/:date', authorizeStaff, appointmentController.getAppointmentsByDate);

// Add the missing route for getting appointments by patient ID
router.get('/patient/:patientId', authorizeStaff, appointmentController.getAppointmentsByPatientId);

// Route for taking in an appointment
router.put('/:id/take-in', authorizeStaff, appointmentController.takeInAppointment);

export default router;