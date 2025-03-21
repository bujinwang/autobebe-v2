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
  getRecommendations = async (req: Request, res: Response) => {
    console.log('[MedicalAIController] getRecommendations request:', JSON.stringify(req.body));
    
    try {
      const request = req.body as MedicalAIRequest;
      
      if (!request.purposeOfVisit || !request.symptoms) {
        console.log('[MedicalAIController] getRecommendations validation error: Missing required fields');
        return res.status(400).json({
          success: false,
          errorMessage: 'Purpose of visit and symptoms are required'
        });
      }

      const response = await this.medicalAIService.getRecommendations(request);
      console.log('[MedicalAIController] getRecommendations response:', JSON.stringify(response));
      return res.json(response);
    } catch (error) {
      console.error('[MedicalAIController] getRecommendations error:', error);
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
    console.log('[MedicalAIController] getTopQuestions request:', JSON.stringify(req.body));
    
    try {
      const request = req.body as TopQuestionsRequest;
      
      if (!request.purposeOfVisit || !request.symptoms) {
        console.log('[MedicalAIController] getTopQuestions validation error: Missing required fields');
        return res.status(400).json({
          success: false,
          errorMessage: 'Purpose of visit and symptoms are required'
        });
      }

      const response = await this.medicalAIService.getTopQuestions(request);
      console.log('[MedicalAIController] getTopQuestions response:', JSON.stringify(response));
      return res.json(response);
    } catch (error) {
      console.error('[MedicalAIController] getTopQuestions error:', error);
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
    console.log('[MedicalAIController] getWaitingInstructions request:', JSON.stringify(req.body));
    
    try {
      const request = req.body as WaitingInstructionsRequest;
      
      if (!request.purposeOfVisit || !request.symptoms) {
        console.log('[MedicalAIController] getWaitingInstructions validation error: Missing required fields');
        return res.status(400).json({
          success: false,
          errorMessage: 'Purpose of visit and symptoms are required'
        });
      }

      const response = await this.medicalAIService.getWaitingInstructions(request);
      console.log('[MedicalAIController] getWaitingInstructions response:', JSON.stringify(response));
      return res.json(response);
    } catch (error) {
      console.error('[MedicalAIController] getWaitingInstructions error:', error);
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
  console.log('[MedicalAIController] generateMedicalResponse request:', JSON.stringify(req.body));
  
  try {
    // Use config instead of process.env
    const apiKey = config.medicalAI.apiKey;
    const apiUrl = config.medicalAI.url;
    const model = config.medicalAI.model;
    
    console.log('[MedicalAIController] generateMedicalResponse using API config:', { 
      url: apiUrl, 
      model, 
      apiKeyPresent: !!apiKey 
    });
    
    // Your API call logic here
    // For example:
    // const response = await axios.post(apiUrl, { ... });
    
    // Define the result variable before using it
    const result = "Medical response generated successfully"; // Replace with actual result
    
    console.log('[MedicalAIController] generateMedicalResponse result:', result);
    
    // Return response
    res.status(200).json({ result });
  } catch (error) {
    console.error('[MedicalAIController] generateMedicalResponse error:', error);
    res.status(500).json({ error: 'Failed to generate medical response' });
  }
};