import { Router } from 'express';
import { login, changePassword, adminChangePassword, forgotPassword, resetPassword } from '../controllers/authController';
import { authenticate, authorizeClinicAdmin } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User email address
 *         password:
 *           type: string
 *           description: User password
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: User ID
 *             name:
 *               type: string
 *               description: User name
 *             email:
 *               type: string
 *               description: User email
 *             role:
 *               type: string
 *               description: User role
 *             clinicId:
 *               type: string
 *               description: ID of the clinic user belongs to
 *         token:
 *           type: string
 *           description: JWT authentication token
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: Current password
 *         newPassword:
 *           type: string
 *           description: New password
 *     AdminChangePasswordRequest:
 *       type: object
 *       required:
 *         - userId
 *         - newPassword
 *       properties:
 *         userId:
 *           type: integer
 *           description: ID of the user whose password is being changed
 *         newPassword:
 *           type: string
 *           description: New password
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           description: Reset password token received via email
 *         newPassword:
 *           type: string
 *           description: New password to set
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Missing required fields
 *       429:
 *         description: Too many login attempts - please try again later
 */
router.post('/login', 
  rateLimiter({ 
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50 // 50 attempts per IP address per window
  }), 
  login
);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Invalid email
 *       404:
 *         description: User not found
 *       429:
 *         description: Too many requests - please try again later
 */
router.post('/forgot-password',
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50 // 50 attempts per IP address per window
  }),
  forgotPassword
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 *       429:
 *         description: Too many attempts - please try again later
 */
router.post('/reset-password',
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // 5 attempts per IP address per window
  }),
  resetPassword
);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user's own password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized or incorrect current password
 *       400:
 *         description: Invalid input
 */
router.post('/change-password', authenticate, changePassword);

/**
 * @swagger
 * /auth/admin-change-password:
 *   post:
 *     summary: Admin changes another user's password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires admin privileges
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.post('/admin-change-password', authenticate, authorizeClinicAdmin, adminChangePassword);

// Export the router as the default export
export default router;