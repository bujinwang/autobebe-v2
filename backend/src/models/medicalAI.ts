export interface FollowUpQA {
  question: string;
  answer: string;
}

export interface MedicalAIRequest {
  purposeOfVisit: string;
  symptoms: string;
  followUpQAPairs: FollowUpQA[];
}

export interface MedicalAIResponse {
  success: boolean;
  errorMessage?: string;
  possibleTreatments: string[];
  suggestedPrescriptions: string[];
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