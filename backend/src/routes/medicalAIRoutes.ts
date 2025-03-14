import { Router } from 'express';
import MedicalAIController from '../controllers/medicalAIController';
import { authenticate, authorizeStaff } from '../middlewares/auth';

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

// Get treatment recommendations and suggested prescriptions (Public)
router.post('/recommendations', medicalAIController.getTreatmentRecommendations);

// Get top 3 follow-up questions (Public)
router.post('/topquestions', medicalAIController.getTopQuestions);

// Get personalized waiting instructions (Public)
router.post('/waitinginstructions', medicalAIController.getWaitingInstructions);

export default router;