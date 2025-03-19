import axiosInstance from './axiosConfig';

export interface AIRecommendation {
  success: boolean;
  errorMessage?: string;
  possibleTreatments: string[];
  suggestedPrescriptions: string[];
}

export interface MedicalAIRequest {
  purposeOfVisit: string;
  symptoms: string;
  followUpQAPairs: { question: string; answer: string }[];
}

export async function getRecommendations(request: MedicalAIRequest): Promise<AIRecommendation> {
  try {
    const response = await axiosInstance.post('/ai/recommendations', request);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get AI recommendations');
  }
}

export async function analyzeSymptoms(symptoms: string): Promise<string[]> {
  try {
    const response = await axiosInstance.post('/ai/analyze-symptoms', { symptoms });
    return response.data.possibleConditions;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to analyze symptoms');
  }
}

export async function suggestFollowUpQuestions(
  symptoms: string,
  currentAnswers: Record<string, string>
): Promise<string[]> {
  try {
    const response = await axiosInstance.post('/ai/follow-up-questions', {
      symptoms,
      currentAnswers,
    });
    return response.data.questions;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get follow-up questions');
  }
} 