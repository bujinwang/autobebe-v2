import { Router } from 'express';
import { login, changePassword, adminChangePassword } from '../controllers/authController';
import { authenticate, authorizeClinicAdmin } from '../middleware/auth';

const router = Router();

// Authentication routes
router.post('/login', login);

// Protected routes
router.post('/change-password', authenticate, changePassword);
router.post('/admin-change-password', authenticate, authorizeClinicAdmin, adminChangePassword);

// Export the router as the default export
export default router;