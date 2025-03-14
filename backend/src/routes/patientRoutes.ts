import express from 'express';
import { patientController } from '../controllers/patientController';

const router = express.Router();

// Ensure this line exists to handle POST requests
router.post('/patients', patientController.createPatient);

export default router;