import { Router } from "express";
import { clinicController } from "../controllers/clinicController";

const router = Router();

// Route to get all clinics
router.get('/', clinicController.getAllClinics);

// Add debugging middleware for this specific route
router.get('/info', (req, res, next) => {
  console.log('Request to /info endpoint received:', req.query);
  next();
}, clinicController.getClinicById);

// Route to get clinics for selection
router.get('/selection', clinicController.getClinicsForSelection);

export default router;
