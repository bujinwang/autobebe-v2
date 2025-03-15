import { Router } from 'express';
import { login } from '../controllers/authController';

const router = Router();

// Authentication routes
router.post('/login', login);

// Export the router as the default export
export default router;