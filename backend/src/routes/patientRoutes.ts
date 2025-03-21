import { Router } from 'express';
import { patientController } from '../controllers/patientController';
import { authenticate, authorizeClinicAdmin } from '../middleware/auth';

const router = Router();

// Protect all patient routes with authentication
router.use(authenticate);

// Get all patients for a clinic
router.get('/', authorizeClinicAdmin, patientController.getAllPatients);

// Get patient by ID
router.get('/:id', authorizeClinicAdmin, patientController.getPatientById);

// Create new patient
router.post('/', authorizeClinicAdmin, patientController.createPatient);

// Update patient
router.put('/:id', authorizeClinicAdmin, patientController.updatePatient);

// Delete patient
router.delete('/:id', authorizeClinicAdmin, patientController.deletePatient);

export default router;