import { Router } from 'express';
import { medicalAIController } from '../controllers/medicalAIController';
import { authenticate, authorizeStaff } from '../middlewares/auth';

const router = Router();

// Get treatment recommendations and suggested prescriptions (Public)
router.post('/recommendations', medicalAIController.getTreatmentRecommendations);

// Get top 3 follow-up questions (Public)
router.post('/topquestions', medicalAIController.getTopQuestions);

// Get personalized waiting instructions (Public)
router.post('/waitinginstructions', medicalAIController.getWaitingInstructions);

export default router; 