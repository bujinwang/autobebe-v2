import axiosInstance from './axiosConfig';

export interface MedicalAIRequest {
  purposeOfVisit: string;
  symptoms: string;
  followUpQAPairs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface MedicalAIResponse {
  success: boolean;
  errorMessage?: string;
  possibleTreatments: string[];
  suggestedPrescriptions: string[];
}

export const getRecommendations = async (request: MedicalAIRequest): Promise<MedicalAIResponse> => {
  try {
    const response = await axiosInstance.post('/medicalai/recommendations', request);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return {
      success: false,
      errorMessage: 'Failed to fetch recommendations. Please try again.',
      possibleTreatments: [],
      suggestedPrescriptions: []
    };
  }
}; 