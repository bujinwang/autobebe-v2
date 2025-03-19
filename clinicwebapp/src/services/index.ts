// Core service instances
export { default as axiosInstance } from './axiosConfig';
export { default as authService } from './authService';
export { default as appointmentService } from './appointmentService';
export { default as clinicService } from './clinicService';
export { default as patientService } from './patientService';
export { default as staffService } from './staffService';

// Medical AI service functions
export { 
  getRecommendations,
  analyzeSymptoms,
  suggestFollowUpQuestions
} from './medicalAIService';

// Domain Types
export type { 
  Doctor,
  Patient,
  Clinic,
  Appointment
} from '../types';

// Staff Types
export type { 
  StaffMember, 
  CreateStaffData, 
  UpdateStaffData 
} from './staffService';

// Medical AI Types
export type { AIRecommendation } from './medicalAIService';

