import { Request, Response } from 'express';
import { medicalAIService } from '../services/medicalAIService';
import { 
  MedicalAIRequest, 
  TopQuestionsRequest, 
  WaitingInstructionsRequest 
} from '../models/medicalAI';

export const medicalAIController = {
  // Get treatment recommendations and suggested prescriptions
  getTreatmentRecommendations: async (req: Request, res: Response) => {
    try {
      const request = req.body as MedicalAIRequest;
      
      if (!request.purposeOfVisit || !request.symptoms) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Purpose of visit and symptoms are required'
        });
      }

      const response = await medicalAIService.getTreatmentRecommendations(request);
      return res.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          errorMessage: error.message
        });
      }
      return res.status(500).json({
        success: false,
        errorMessage: 'An unexpected error occurred'
      });
    }
  },

  // Get top 3 follow-up questions
  getTopQuestions: async (req: Request, res: Response) => {
    try {
      const request = req.body as TopQuestionsRequest;
      
      if (!request.purposeOfVisit || !request.symptoms) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Purpose of visit and symptoms are required'
        });
      }

      const response = await medicalAIService.getTopQuestions(request);
      return res.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          errorMessage: error.message
        });
      }
      return res.status(500).json({
        success: false,
        errorMessage: 'An unexpected error occurred'
      });
    }
  },

  // Get personalized waiting instructions
  getWaitingInstructions: async (req: Request, res: Response) => {
    try {
      const request = req.body as WaitingInstructionsRequest;
      
      if (!request.purposeOfVisit || !request.symptoms) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Purpose of visit and symptoms are required'
        });
      }

      const response = await medicalAIService.getWaitingInstructions(request);
      return res.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          errorMessage: error.message
        });
      }
      return res.status(500).json({
        success: false,
        errorMessage: 'An unexpected error occurred'
      });
    }
  }
}; 