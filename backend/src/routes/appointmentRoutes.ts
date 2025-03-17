import express from 'express';
import { appointmentController } from '../controllers/appointmentController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Define your appointment routes here
router.get('/', appointmentController.getAllAppointments);
router.post('/', appointmentController.createAppointment);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);
// Add the missing route for getting appointments by patient ID
router.get('/patient/:patientId', appointmentController.getAppointmentsByPatientId);

// Route for taking in an appointment (requires authentication)
router.put('/:id/take-in', authenticate, appointmentController.takeInAppointment);

export default router;