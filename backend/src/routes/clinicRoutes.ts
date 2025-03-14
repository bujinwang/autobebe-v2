import { Router } from "express";
import { clinicController } from "../controllers/clinicController";

const router = Router();

router.get('/', clinicController.getAllClinics);
router.get('/info', clinicController.getClinicById);
router.get('/selection', clinicController.getClinicsForSelection);

// Add other routes as needed
// router.post('/', clinicController.createClinic);
// router.put('/:id', clinicController.updateClinic);
// router.delete('/:id', clinicController.deleteClinic);

export default router;
