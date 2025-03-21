import apiClient from '../api/client';
import axios from 'axios';
import config from '../config/env/config.template';

// Create a specific instance for AI requests with longer timeout
const aiClient = axios.create({
  baseURL: config.API.BASE_URL,
  timeout: 30000, // 30 seconds timeout for AI requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Copy the interceptors from the main apiClient
aiClient.interceptors.request = apiClient.interceptors.request;
aiClient.interceptors.response = apiClient.interceptors.response;

// Define the base URL for the API

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
    const response = await aiClient.post('/MedicalAI/topquestions', {
      purposeOfVisit: request.purposeOfVisit,
      symptoms: request.symptoms
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top questions:', error);
    // Return a default error response
    return {
      success: false,
      errorMessage: 'Failed to fetch top questions. Please try again.',
      topQuestions: []
    };
  }
};

// Get waiting instructions based on all collected information
export const getWaitingInstructions = async (request: WaitingInstructionsRequest): Promise<WaitingInstructionsResponse> => {
  try {
    const response = await aiClient.post('/MedicalAI/waitinginstructions', request);
    return response.data;
  } catch (error) {
    console.error('Error getting waiting instructions:', error);
    return {
      success: false,
      errorMessage: 'Failed to get waiting instructions. Please try again.',
      instructions: ''
    };
  }
};