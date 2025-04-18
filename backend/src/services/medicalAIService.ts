import axios from 'axios';
import { 
  MedicalAIRequest, 
  MedicalAIResponse, 
  TopQuestionsRequest, 
  TopQuestionsResponse,
  WaitingInstructionsRequest,
  WaitingInstructionsResponse
} from '../models/medicalAI';

interface MedicalAIConfig {
  aiProvider: string;
  aiModel: string;
  aiApiUrl: string;
  apiKey: string;
}

class MedicalAIService {
  private readonly aiProvider: string;
  private readonly aiModel: string;
  private readonly aiApiUrl: string;
  private readonly apiKey: string;

  constructor(config: MedicalAIConfig) {
    this.aiProvider = config.aiProvider;
    this.aiModel = config.aiModel;
    this.aiApiUrl = config.aiApiUrl;
    this.apiKey = config.apiKey;
    
    // Add logging to debug API key issues
    console.log('MedicalAIService initialized with:');
    console.log('- Provider:', this.aiProvider);
    console.log('- Model:', this.aiModel);
    console.log('- API URL:', this.aiApiUrl);
    console.log('- API Key:', this.apiKey ? `${this.apiKey.substring(0, 4)}...${this.apiKey.substring(this.apiKey.length - 4)}` : 'MISSING');
    console.log('- config:', config.apiKey);
  }

  private async callAIApi(prompt: string, systemPrompt: string): Promise<string> {
    try {
      const payload = {
        model: this.aiModel,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      };
      console.log('Authorization...', {'Authorization': `Bearer ${this.apiKey}`});

      const response = await axios.post(this.aiApiUrl, payload, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      if (response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      }

      throw new Error('No response from AI service');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`AI API error: ${error.message}`);
      }
      throw error;
    }
  }
  async getRecommendations(request: MedicalAIRequest): Promise<MedicalAIResponse> {
    try {
      const systemPrompt = 'You are a medical decision support system. Return ONLY a JSON object with possibleTreatments' +
          ' and suggestedPrescriptions arrays. Do not include any markdown formatting or additional text.';
      
      let prompt = `Based on:\nPurpose of Visit: ${request.purposeOfVisit}\nSymptoms: ${request.symptoms}\n`;
      if (request.followUpQAPairs.length > 0) {
        prompt += '\nFollow-up Questions and Answers:\n';
        request.followUpQAPairs.forEach(qa => {
          prompt += `Q: ${qa.question}\nA: ${qa.answer}\n`;
        });
      }
      prompt += '\nProvide recommendations in this exact format:\n{"possibleTreatments": ["treatment1", "treatment2"], ' +
          '"suggestedPrescriptions": ["prescription1, dosage", "prescription2, dosage"]}';

      const aiResponse = await this.callAIApi(prompt, systemPrompt);
      
      const matches = aiResponse.match(/\{[\s\S]*\}/);
      if (!matches) throw new Error('No JSON content found in AI response');

      const parsedResponse = JSON.parse(matches[0]);

      if (!Array.isArray(parsedResponse.possibleTreatments) || !Array.isArray(parsedResponse.suggestedPrescriptions)) {
        throw new Error('Invalid response format: treatments or prescriptions is not an array');
      }

      return {
        success: true,
        possibleTreatments: parsedResponse.possibleTreatments,
        suggestedPrescriptions: parsedResponse.suggestedPrescriptions
      };
    } catch (error) {
      console.error('Error in getTreatmentRecommendations:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'An unexpected error occurred',
        possibleTreatments: [],
        suggestedPrescriptions: []
      };
    }
  }

  async getTopQuestions(request: TopQuestionsRequest): Promise<TopQuestionsResponse> {
    try {
      const systemPrompt = 'You are a medical assistant AI. Generate exactly 5 relevant follow-up questions based on ' +
          'the patient\'s purpose of visit and symptoms. Return ONLY a JSON object with a topQuestions array containing ' +
          'the 5 questions. Do not include any markdown formatting or additional text.';
      const prompt = `Based on:\nPurpose of Visit: ${request.purposeOfVisit}\nSymptoms: ${request.symptoms}\n\nGenerate 
      5 follow-up questions and return them in this exact format:\n{"topQuestions": ["question1", "question2", 
      "question3", "question4", "question5"]}`;
      
      const aiResponse = await this.callAIApi(prompt, systemPrompt);
      
      const matches = aiResponse.match(/\{[\s\S]*\}/);
      if (!matches) {
        throw new Error('No JSON content found in AI response');
      }

      const parsedResponse = JSON.parse(matches[0]);

      if (!Array.isArray(parsedResponse.topQuestions)) {
        throw new Error('Invalid response format: topQuestions is not an array');
      }

      return {
        success: true,
        topQuestions: parsedResponse.topQuestions
      };
    } catch (error) {
      console.error('Error in getTopQuestions:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'An unexpected error occurred',
        topQuestions: []
      };
    }
  }

  async getWaitingInstructions(request: WaitingInstructionsRequest): Promise<WaitingInstructionsResponse> {
    try {
      const systemPrompt = 'You are a medical assistant AI providing waiting instructions for patients in a clinic. Return ONLY a JSON object with an instructions field containing the waiting instructions. Do not include any markdown formatting or additional text.';
      
      let prompt = `Based on:\nPurpose of Visit: ${request.purposeOfVisit}\nSymptoms: ${request.symptoms}\n`;
      if (request.followUpQAPairs.length > 0) {
        prompt += '\nFollow-up Questions and Answers:\n';
        request.followUpQAPairs.forEach(qa => {
          prompt += `Q: ${qa.question}\nA: ${qa.answer}\n`;
        });
      }
      prompt += '\nProvide waiting instructions in this exact format:\n{"instructions": "your instructions here"}';

      const aiResponse = await this.callAIApi(prompt, systemPrompt);
      
      const matches = aiResponse.match(/\{[\s\S]*\}/);
      if (!matches) {
        throw new Error('No JSON content found in AI response');
      }

      const parsedResponse = JSON.parse(matches[0]);

      if (typeof parsedResponse.instructions !== 'string') {
        throw new Error('Invalid response format: instructions is not a string');
      }

      return {
        success: true,
        instructions: parsedResponse.instructions
      };
    } catch (error) {
      console.error('Error in getWaitingInstructions:', error);
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'An unexpected error occurred',
        instructions: 'Please wait in the designated area. A staff member will assist you shortly.'
      };
    }
  }
}

// Replace direct export with lazy initialization
let instance: MedicalAIService | null = null;

export function getMedicalAIService(config: MedicalAIConfig): MedicalAIService {
  if (!instance) {
    instance = new MedicalAIService(config);
  }
  return instance;
}

export type { MedicalAIConfig };