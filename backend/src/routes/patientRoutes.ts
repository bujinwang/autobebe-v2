import express from 'express';
import { patientController } from '../controllers/patientController';

const router = express.Router();

// Define the route without the /api prefix since that's likely added when mounting the router
router.post('/', patientController.createPatient);

// Also add a GET endpoint for testing connectivity
router.get('/', patientController.getAllPatients);

export default router;