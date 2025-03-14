import axios from 'axios';

// Define the base URL for the API
const API_URL = 'http://localhost:3000/api';

// Define the TopQuestionsRequest interface
export interface TopQuestionsRequest {
  purposeOfVisit: string;
  symptoms: string;
}

// Define the TopQuestionsResponse interface
export interface TopQuestionsResponse {
  success: boolean;
  errorMessage?: string;
  topQuestions: string[];
}

// Define the FollowUpQA interface
export interface FollowUpQA {
  question: string;
  answer: string;
}

// Define the WaitingInstructionsRequest interface
export interface WaitingInstructionsRequest {
  purposeOfVisit: string;
  symptoms: string;
  followUpQAPairs: FollowUpQA[];
}

// Define the WaitingInstructionsResponse interface
export interface WaitingInstructionsResponse {
  success: boolean;
  errorMessage?: string;
  instructions: string;
}

// Get top 3 follow-up questions based on purpose of visit and symptoms
export const getTopQuestions = async (request: TopQuestionsRequest): Promise<TopQuestionsResponse> => {
  try {
    const response = await axios.post(`${API_URL}/MedicalAI/topquestions`, {
      purposeOfVisit: request.purposeOfVisit,
      symptoms: request.symptoms
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top questions:', error);
    // Return a default error response
    return {
      success: false,
      errorMessage: 'Failed to fetch follow-up questions. Please try again.',
      topQuestions: []
    };
  }
};

// Get personalized waiting instructions based on patient information
export const getWaitingInstructions = async (request: WaitingInstructionsRequest): Promise<WaitingInstructionsResponse> => {
  try {
    // Ensure followUpQAPairs is an array before mapping
    const followUpQAPairs = Array.isArray(request.followUpQAPairs) 
      ? request.followUpQAPairs.map(qa => ({
          question: qa.question,
          answer: qa.answer
        }))
      : [];
      
    const response = await axios.post(`${API_URL}/MedicalAI/waitinginstructions`, {
      purposeOfVisit: request.purposeOfVisit,
      symptoms: request.symptoms,
      followUpQAPairs: followUpQAPairs
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching waiting instructions:', error);
    // Return a default error response
    return {
      success: false,
      errorMessage: 'Failed to fetch waiting instructions. Please try again.',
      instructions: 'Please stay in the clinic. A clerk will find you when it\'s your turn. If your symptoms worsen, please alert the clinic staff immediately.'
    };
  }
};