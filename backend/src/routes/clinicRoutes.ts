import { Router } from "express";
import { clinicController } from "../controllers/clinicController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ClinicInfo:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - address
 *         - phone
 *         - company
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the clinic
 *         name:
 *           type: string
 *           description: The name of the clinic
 *         address:
 *           type: string
 *           description: The physical address of the clinic
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         company:
 *           type: string
 *           description: The company that owns the clinic
 *         hours:
 *           type: string
 *           description: Operating hours of the clinic
 *         welcomeMessage:
 *           type: string
 *           description: Welcome message for patients
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the clinic was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the clinic was last updated
 */

/**
 * @swagger
 * /clinics:
 *   get:
 *     summary: Get all clinics
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all clinics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClinicInfo'
 *       401:
 *         description: Unauthorized
 */
router.get('/', clinicController.getAllClinics);

/**
 * @swagger
 * /clinics/info:
 *   get:
 *     summary: Get clinic information by ID
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The clinic ID
 *     responses:
 *       200:
 *         description: Clinic information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClinicInfo'
 *       404:
 *         description: Clinic not found
 *       401:
 *         description: Unauthorized
 */
// Add debugging middleware for this specific route
router.get('/info', (req, res, next) => {
  console.log('Request to /info endpoint received:', req.query);
  next();
}, clinicController.getClinicById);

/**
 * @swagger
 * /clinics/selection:
 *   get:
 *     summary: Get clinics for selection dropdown
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clinics formatted for selection
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: string
 *                     description: The clinic ID
 *                   label:
 *                     type: string
 *                     description: The clinic name
 *       401:
 *         description: Unauthorized
 */
router.get('/selection', clinicController.getClinicsForSelection);

export default router;
