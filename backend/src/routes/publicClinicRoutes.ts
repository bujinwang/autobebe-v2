import { Router } from 'express';
import { clinicController } from '../controllers/clinicController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes for clinic information
// These routes don't require authentication but are protected by rate limiting

/**
 * @swagger
 * /public/clinics/info:
 *   get:
 *     summary: Get clinic information by ID (public access)
 *     tags: [Public Clinics]
 *     description: Retrieves clinic information without requiring authentication
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The clinic ID
 *     responses:
 *       200:
 *         description: Clinic information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 hours:
 *                   type: string
 *                 welcomeMessage:
 *                   type: string
 *       404:
 *         description: Clinic not found
 *       429:
 *         description: Too many requests - rate limit exceeded
 */
router.get('/info',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 100 }), // 100 requests per 15 minutes
  clinicController.getClinicInfo
);

/**
 * @swagger
 * /public/clinics/list:
 *   get:
 *     summary: Get list of available clinics (public access)
 *     tags: [Public Clinics]
 *     description: Retrieves a list of all available clinics without requiring authentication
 *     responses:
 *       200:
 *         description: List of clinics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *       429:
 *         description: Too many requests - rate limit exceeded
 */
router.get('/list',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 100 }), // 100 requests per 15 minutes
  clinicController.listClinics
);

export default router; 