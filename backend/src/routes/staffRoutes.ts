import { Router } from 'express';
import staffController from '../controllers/staffController';
import { authenticate, authorizeClinicAdmin } from '../middleware/auth';

const router = Router();

// Protect all staff routes with authentication
router.use(authenticate);

// Get all staff members for a clinic
router.get('/', authorizeClinicAdmin, staffController.getStaffMembers);

// Create a new staff member
router.post('/', authorizeClinicAdmin, staffController.createStaffMember);

// Update a staff member
router.patch('/', authorizeClinicAdmin, staffController.updateStaffMember);

// Delete a staff member
router.delete('/:id', authorizeClinicAdmin, staffController.deleteStaffMember);

export default router; 