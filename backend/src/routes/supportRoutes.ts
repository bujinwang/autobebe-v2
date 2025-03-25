import { Router } from 'express';
import { supportController } from '../controllers/supportController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @swagger
 * /support/message:
 *   post:
 *     summary: Send a support message
 *     tags: [Support]
 *     description: Sends a support message to the AutoBebe support team
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 description: Sender's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Sender's email address
 *               subject:
 *                 type: string
 *                 description: Message subject
 *               message:
 *                 type: string
 *                 description: Message content
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input data
 *       429:
 *         description: Too many requests - rate limit exceeded
 *       500:
 *         description: Server error
 */
router.post('/message',
  rateLimiter({ windowMs: 5 * 60 * 1000, max: 10 }), // 10 requests per 5 minutes
  supportController.sendSupportMessage
);

export = router; 