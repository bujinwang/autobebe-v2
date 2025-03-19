import express from 'express';
import staffController from '../controllers/staffController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Protected routes - require authentication
router.use(authenticate);

// Get all staff members for a clinic
router.get('/', staffController.getStaffMembers);

// Create a new staff member
router.post('/', staffController.createStaffMember);

// Update a staff member
router.patch('/', staffController.updateStaffMember);

// Delete a staff member
router.delete('/:id', staffController.deleteStaffMember);

export default router; 