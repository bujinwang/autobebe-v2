import { Router } from 'express';
import { login, changePassword, adminChangePassword } from '../controllers/authController';
import { authenticate, authorizeClinicAdmin } from '../middleware/auth';

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
 */
router.post('/login', login);

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