import { Router } from 'express';
import MedicalAIController from '../controllers/medicalAIController';
import { authenticate } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';

const medicalAIConfig = {
  aiProvider: process.env.MEDICAL_AI_PROVIDER || 'DeepSeek',
  aiModel: process.env.MEDICAL_AI_MODEL || 'deepseek-chat',
  aiApiUrl: process.env.MEDICAL_AI_URL || 'https://api.deepseek.com/chat/completions',
  apiKey: process.env.MEDICAL_AI_API_KEY || ''
};

console.log('Medical AI Config in routes:', {
  aiProvider: medicalAIConfig.aiProvider,
  aiModel: medicalAIConfig.aiModel,
  aiApiUrl: medicalAIConfig.aiApiUrl,
  apiKey: medicalAIConfig.apiKey ? 'PRESENT' : 'MISSING'
});

const medicalAIController = new MedicalAIController(medicalAIConfig);

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MedicalAIRequest:
 *       type: object
 *       required:
 *         - symptoms
 *       properties:
 *         symptoms:
 *           type: string
 *           description: Patient symptoms
 *         purposeOfVisit:
 *           type: string
 *           description: Purpose or reason for the visit
 *         patientName:
 *           type: string
 *           description: Patient name
 *         patientAge:
 *           type: integer
 *           description: Patient age
 *         medicalHistory:
 *           type: string
 *           description: Patient medical history
 *     MedicalRecommendationResponse:
 *       type: object
 *       properties:
 *         treatments:
 *           type: string
 *           description: Suggested treatment options
 *         prescriptions:
 *           type: string
 *           description: Suggested prescriptions
 *     TopQuestionsResponse:
 *       type: object
 *       properties:
 *         questions:
 *           type: array
 *           items:
 *             type: string
 *           description: List of top follow-up questions
 *     WaitingInstructionsResponse:
 *       type: object
 *       properties:
 *         instructions:
 *           type: string
 *           description: Personalized waiting instructions
 */

/**
 * @swagger
 * /medicalai/recommendations:
 *   post:
 *     summary: Get AI treatment recommendations and prescriptions (authenticated)
 *     tags: [Medical AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicalAIRequest'
 *     responses:
 *       200:
 *         description: Treatment recommendations and prescriptions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MedicalRecommendationResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: AI service error
 */
router.post('/recommendations', authenticate, medicalAIController.getRecommendations);

/**
 * @swagger
 * /medicalai/topquestions:
 *   post:
 *     summary: Get top follow-up questions based on symptoms (public, rate limited)
 *     tags: [Medical AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicalAIRequest'
 *     responses:
 *       200:
 *         description: List of follow-up questions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopQuestionsResponse'
 *       400:
 *         description: Invalid input
 *       429:
 *         description: Too many requests
 *       500:
 *         description: AI service error
 */
router.post('/topquestions', 
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 100 }), // 100 requests per minute
  medicalAIController.getTopQuestions
);

/**
 * @swagger
 * /medicalai/waitinginstructions:
 *   post:
 *     summary: Get personalized waiting instructions (public, rate limited)
 *     tags: [Medical AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicalAIRequest'
 *     responses:
 *       200:
 *         description: Personalized waiting instructions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaitingInstructionsResponse'
 *       400:
 *         description: Invalid input
 *       429:
 *         description: Too many requests
 *       500:
 *         description: AI service error
 */
router.post('/waitinginstructions',
  rateLimiter({ windowMs: 1 * 60 * 1000, max: 100 }), // 100 requests per minute
  medicalAIController.getWaitingInstructions
);

export default router;