import { Router } from 'express';
import staffController from '../controllers/staffController';
import { authenticate, authorizeClinicAdmin, authorizeStaffSelfUpdate } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       required:
 *         - email
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the staff member
 *         email:
 *           type: string
 *           description: Email address of the staff member
 *         name:
 *           type: string
 *           description: Full name of the staff member
 *         clinicId:
 *           type: string
 *           description: ID of the clinic where the staff member works
 *         role:
 *           type: string
 *           enum: [SUPER_ADMIN, CLINIC_ADMIN, STAFF]
 *           description: Role of the staff member
 *         position:
 *           type: string
 *           description: Job title/position
 *         specialty:
 *           type: string
 *           description: Medical specialty
 *         isActive:
 *           type: boolean
 *           description: Whether the staff member is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the staff member was created
 */

// Protect all staff routes with authentication
router.use(authenticate);

/**
 * @swagger
 * /staff:
 *   get:
 *     summary: Get all staff members for a clinic
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of staff members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Staff'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires clinic admin privileges
 */
router.get('/', authorizeClinicAdmin, staffController.getStaffMembers);

/**
 * @swagger
 * /staff:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               clinicId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [CLINIC_ADMIN, STAFF]
 *               position:
 *                 type: string
 *               specialty:
 *                 type: string
 *     responses:
 *       201:
 *         description: Staff member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires clinic admin privileges
 */
router.post('/', authorizeClinicAdmin, staffController.createStaffMember);

/**
 * @swagger
 * /staff:
 *   patch:
 *     summary: Update a staff member
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               clinicId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [CLINIC_ADMIN, STAFF]
 *               position:
 *                 type: string
 *               specialty:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Staff member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Staff member not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires clinic admin privileges
 */
router.patch('/', authorizeStaffSelfUpdate, staffController.updateStaffMember);

/**
 * @swagger
 * /staff/{id}:
 *   delete:
 *     summary: Delete a staff member
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The staff member ID
 *     responses:
 *       200:
 *         description: Staff member deleted successfully
 *       404:
 *         description: Staff member not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requires clinic admin privileges
 */
router.delete('/:id', authorizeClinicAdmin, staffController.deleteStaffMember);

/**
 * @swagger
 * /staff/doctors:
 *   get:
 *     summary: Get all doctors for a clinic
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clinicId
 *         schema:
 *           type: string
 *         required: true
 *         description: The clinic ID
 *     responses:
 *       200:
 *         description: A list of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Staff'
 *       401:
 *         description: Unauthorized
 */
router.get('/doctors', staffController.getDoctors);

export default router; 