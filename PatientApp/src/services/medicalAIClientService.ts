import apiClient from '../api/client';

// Type definitions
export interface TopQuestionsRequest {
  purposeOfVisit: string;
  symptoms: string;
}

export interface TopQuestionsResponse {
  success: boolean;
  errorMessage?: string;
  topQuestions: string[];
}

export interface FollowUpQA {
  question: string;
  answer: string;
}

export interface WaitingInstructionsRequest {
  purposeOfVisit: string;
  symptoms: string;
  followUpQAPairs: FollowUpQA[];
}

export interface WaitingInstructionsResponse {
  success: boolean;
  errorMessage?: string;
  instructions: string;
}

// AI operations timeout (longer than standard API calls)
const AI_REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Get top follow-up questions based on purpose of visit and symptoms
 */
export const getTopQuestions = async (request: TopQuestionsRequest): Promise<TopQuestionsResponse> => {
  console.log('getTopQuestions called with request:', JSON.stringify(request));
  try {
    console.log('Making API call to /medicalai/topquestions endpoint');
    const response = await apiClient.post('/medicalai/topquestions', 
      {
        purposeOfVisit: request.purposeOfVisit,
        symptoms: request.symptoms
      },
      { timeout: AI_REQUEST_TIMEOUT }
    );
    console.log('getTopQuestions API response status:', response.status);
    console.log('getTopQuestions API response data:', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error fetching top questions:', error);
    // Check if it's an axios error with response data
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error('API Error status:', axiosError.response?.status);
      console.error('API Error data:', JSON.stringify(axiosError.response?.data));
    }
    return {
      success: false,
      errorMessage: 'Failed to fetch top questions. Please try again.',
      topQuestions: []
    };
  }
};

/**
 * Get waiting instructions based on all collected information
 */
export const getWaitingInstructions = async (request: WaitingInstructionsRequest): Promise<WaitingInstructionsResponse> => {
  console.log('getWaitingInstructions called with request:', JSON.stringify(request));
  try {
    console.log('Making API call to /medicalai/waitinginstructions endpoint');
    const response = await apiClient.post('/medicalai/waitinginstructions', 
      request, 
      { timeout: AI_REQUEST_TIMEOUT }
    );
    console.log('getWaitingInstructions API response status:', response.status);
    console.log('getWaitingInstructions API response data:', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error getting waiting instructions:', error);
    // Check if it's an axios error with response data
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error('API Error status:', axiosError.response?.status);
      console.error('API Error data:', JSON.stringify(axiosError.response?.data));
    }
    return {
      success: false,
      errorMessage: 'Failed to get waiting instructions. Please try again.',
      instructions: ''
    };
  }
};