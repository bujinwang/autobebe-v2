import config from '../config';
import { Request, Response } from 'express';
import { getMedicalAIService, MedicalAIConfig } from '../services/medicalAIService';
import { 
  MedicalAIRequest, 
  TopQuestionsRequest, 
  WaitingInstructionsRequest 
} from '../models/medicalAI';

class MedicalAIController {
  private medicalAIService: ReturnType<typeof getMedicalAIService>;

  constructor(config: MedicalAIConfig) {
    this.medicalAIService = getMedicalAIService(config);
  }

  // Convert to arrow functions to preserve 'this' context
  getTreatmentRecommendations = async (req: Request, res: Response) => {
    try {
      const request = req.body as MedicalAIRequest;
      
      if (!request.purposeOfVisit || !request.symptoms) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Purpose of visit and symptoms are required'
        });
      }

      const response = await this.medicalAIService.getTreatmentRecommendations(request);
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

  getTopQuestions = async (req: Request, res: Response) => {
    try {
      const request = req.body as TopQuestionsRequest;
      
      if (!request.purposeOfVisit || !request.symptoms) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Purpose of visit and symptoms are required'
        });
      }

      const response = await this.medicalAIService.getTopQuestions(request);
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

  getWaitingInstructions = async (req: Request, res: Response) => {
    try {
      const request = req.body as WaitingInstructionsRequest;
      
      if (!request.purposeOfVisit || !request.symptoms) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Purpose of visit and symptoms are required'
        });
      }

      const response = await this.medicalAIService.getWaitingInstructions(request);
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
}

export default MedicalAIController;


export const generateMedicalResponse = async (req: Request, res: Response) => {
  try {
    // Use config instead of process.env
    const apiKey = config.medicalAI.apiKey;
    const apiUrl = config.medicalAI.url;
    const model = config.medicalAI.model;
    
    // Your API call logic here
    // For example:
    // const response = await axios.post(apiUrl, { ... });
    
    // Define the result variable before using it
    const result = "Medical response generated successfully"; // Replace with actual result
    
    // Return response
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate medical response' });
  }
};