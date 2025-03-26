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

export interface TopQuestionsRequest {
  purposeOfVisit: string;
  symptoms: string;
}

export interface TopQuestionsResponse {
  success: boolean;
  errorMessage?: string;
  topQuestions: string[];
}

export interface WaitingInstructionsResponse {
  success: boolean;
  errorMessage?: string;
  instructions: string;
}

export async function getTopQuestions(request: TopQuestionsRequest): Promise<TopQuestionsResponse> {
  try {
    const response = await axiosInstance.post('/medicalai/topquestions', request);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get follow-up questions');
  }
}

export async function getRecommendations(request: MedicalAIRequest): Promise<AIRecommendation> {
  try {
    const response = await axiosInstance.post('/medicalai/recommendations', request);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get AI recommendations');
  }
}

export async function analyzeSymptoms(symptoms: string): Promise<string[]> {
  try {
    const response = await axiosInstance.post('/medicalai/topquestions', { symptoms });
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
    const response = await axiosInstance.post('/medicalai/topquestions', {
      symptoms,
      currentAnswers,
    });
    return response.data.questions;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get follow-up questions');
  }
}

export async function getWaitingInstructions(request: MedicalAIRequest): Promise<WaitingInstructionsResponse> {
  try {
    const response = await axiosInstance.post('/medicalai/waitinginstructions', request);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get waiting instructions');
  }
} 