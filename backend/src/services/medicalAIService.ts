import axios from 'axios';
import { 
  MedicalAIRequest, 
  MedicalAIResponse, 
  TopQuestionsRequest, 
  TopQuestionsResponse,
  WaitingInstructionsRequest,
  WaitingInstructionsResponse
} from '../models/medicalAI';

class MedicalAIService {
  private readonly aiProvider: string;
  private readonly aiModel: string;
  private readonly aiApiUrl: string;
  private readonly apiKey: string;

  constructor() {
    // Get AI configuration from environment variables
    this.aiProvider = process.env.MEDICAL_AI_PROVIDER || 'DeepSeek';
    this.aiModel = process.env.MEDICAL_AI_MODEL || 'deepseek-chat';
    this.aiApiUrl = process.env.MEDICAL_AI_URL || 'https://api.deepseek.com/chat/completions';
    this.apiKey = process.env.MEDICAL_AI_API_KEY || '';
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

  private buildMCPPrompt(request: MedicalAIRequest): string {
    const { purposeOfVisit, symptoms, followUpQAPairs } = request;
    let prompt = `Purpose of Visit: ${purposeOfVisit}\nSymptoms: ${symptoms}\n`;
    
    if (followUpQAPairs.length > 0) {
      prompt += '\nFollow-up Questions and Answers:\n';
      followUpQAPairs.forEach(qa => {
        prompt += `Q: ${qa.question}\nA: ${qa.answer}\n`;
      });
    }

    prompt += '\nPlease provide treatment recommendations and prescription suggestions in the following MCP format:\n';
    prompt += '<mcp:output>\n{\n  "possibleTreatments": ["treatment1", "treatment2", ...],\n  "suggestedPrescriptions": ["prescription1", "prescription2", ...]\n}\n</mcp:output>';

    return prompt;
  }

  private parseMCPResponse(aiResponse: string): MedicalAIResponse {
    try {
      // Extract content between MCP tags
      const startTag = '<mcp:output>';
      const endTag = '</mcp:output>';
      const startIndex = aiResponse.indexOf(startTag);
      const endIndex = aiResponse.indexOf(endTag);

      if (startIndex === -1 || endIndex === -1) {
        throw new Error('Invalid MCP format in response');
      }

      const jsonContent = aiResponse.substring(
        startIndex + startTag.length,
        endIndex
      ).trim();

      const parsedContent = JSON.parse(jsonContent);

      return {
        success: true,
        possibleTreatments: parsedContent.possibleTreatments || [],
        suggestedPrescriptions: parsedContent.suggestedPrescriptions || []
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          errorMessage: `Failed to parse AI response: ${error.message}`,
          possibleTreatments: [],
          suggestedPrescriptions: []
        };
      }
      return {
        success: false,
        errorMessage: 'Failed to parse AI response',
        possibleTreatments: [],
        suggestedPrescriptions: []
      };
    }
  }

  async getTreatmentRecommendations(request: MedicalAIRequest): Promise<MedicalAIResponse> {
    try {
      const systemPrompt = 'You are a medical decision support system that provides evidence-based treatment recommendations and prescription suggestions. Analyze patient information carefully and provide structured medical advice in Model Communication Protocol(MCP) format. Always include appropriate disclaimers about consulting licensed medical professionals.';
      const prompt = this.buildMCPPrompt(request);
      const aiResponse = await this.callAIApi(prompt, systemPrompt);
      return this.parseMCPResponse(aiResponse);
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          errorMessage: error.message,
          possibleTreatments: [],
          suggestedPrescriptions: []
        };
      }
      return {
        success: false,
        errorMessage: 'An unexpected error occurred',
        possibleTreatments: [],
        suggestedPrescriptions: []
      };
    }
  }

  async getTopQuestions(request: TopQuestionsRequest): Promise<TopQuestionsResponse> {
    try {
      const systemPrompt = 'You are a medical assistant AI. Generate the top 3 most relevant follow-up questions based on the patient\'s purpose of visit and symptoms.';
      const prompt = `Purpose of Visit: ${request.purposeOfVisit}\nSymptoms: ${request.symptoms}\n\nPlease provide 3 relevant follow-up questions in JSON format:\n{"topQuestions": ["question1", "question2", "question3"]}`;
      
      const aiResponse = await this.callAIApi(prompt, systemPrompt);
      const parsedResponse = JSON.parse(aiResponse);

      return {
        success: true,
        topQuestions: parsedResponse.topQuestions || []
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          errorMessage: error.message,
          topQuestions: []
        };
      }
      return {
        success: false,
        errorMessage: 'An unexpected error occurred',
        topQuestions: []
      };
    }
  }

  async getWaitingInstructions(request: WaitingInstructionsRequest): Promise<WaitingInstructionsResponse> {
    try {
      const systemPrompt = 'You are a medical assistant AI providing waiting instructions for patients in a clinic. Generate clear, compassionate instructions that are specific to the patient\'s condition. Include safety precautions and when to alert clinic staff if symptoms worsen.';
      
      let prompt = `Purpose of Visit: ${request.purposeOfVisit}\nSymptoms: ${request.symptoms}\n`;
      if (request.followUpQAPairs.length > 0) {
        prompt += '\nFollow-up Questions and Answers:\n';
        request.followUpQAPairs.forEach(qa => {
          prompt += `Q: ${qa.question}\nA: ${qa.answer}\n`;
        });
      }
      prompt += '\nPlease provide personalized waiting instructions in JSON format:\n{"instructions": "your instructions here"}';

      const aiResponse = await this.callAIApi(prompt, systemPrompt);
      const parsedResponse = JSON.parse(aiResponse);

      return {
        success: true,
        instructions: parsedResponse.instructions || 'Please wait in the designated area. A staff member will assist you shortly.'
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          errorMessage: error.message,
          instructions: 'Please wait in the designated area. A staff member will assist you shortly.'
        };
      }
      return {
        success: false,
        errorMessage: 'An unexpected error occurred',
        instructions: 'Please wait in the designated area. A staff member will assist you shortly.'
      };
    }
  }
}

export const medicalAIService = new MedicalAIService(); 