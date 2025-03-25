import apiClient, { isAxiosError } from '../api/client';
import { AxiosError } from 'axios';

// Define the Patient interface
export interface Patient {
  id?: string;
  name: string;
  dateOfBirth?: string;
  phone: string;
  email?: string;
  clinicId?: string;
}

// Define error types for better error handling
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  success: boolean;
  error: string;
  errors?: ValidationError[];
}

// Register a new patient
export const registerPatient = async (patientData: Patient): Promise<Patient> => {
  try {
    // Send the registration request
    const response = await apiClient.post('/public/patients/register', patientData);
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      // Handle validation errors
      if (error.response?.status === 400) {
        const apiError = error.response.data as ApiError;
        if (apiError.errors) {
          const errorMessages = apiError.errors
            .map(err => `${err.field}: ${err.message}`)
            .join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
      }
      // Handle rate limiting
      if (error.response?.status === 429) {
        throw new Error('Too many registration attempts. Please try again later.');
      }
    }
    // Re-throw the error with a friendly message
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to register patient. Please try again.'
    );
  }
};

// Save patient data with connectivity check
export const savePatientData = async (patientData: Patient): Promise<Patient> => {
  try {
    // First, test the API connectivity
    console.log('Testing API connectivity...');
    try {
      const testResponse = await apiClient.get('/health');
      console.log('API health check successful');
    } catch (error) {
      console.error('API connectivity test failed:', error);
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }

    // Log the data being sent
    console.log('Sending patient data:', JSON.stringify(patientData, null, 2));

    // Register the patient using the public endpoint
    const response = await apiClient.post('/public/patients/register', patientData);
    
    // Log the response
    console.log('Server response:', response.data);
    
    return response.data.data;
  } catch (error) {
    console.error('Error in savePatientData:', error);
    if (error instanceof Error && isAxiosError(error) && error.response) {
      console.error('Server response data:', error.response.data);
      console.error('Server response status:', error.response.status);
      
      // Handle validation errors
      if (error.response.status === 400) {
        const apiError = error.response.data as ApiError;
        if (apiError.errors) {
          const errorMessages = apiError.errors
            .map(err => `${err.field}: ${err.message}`)
            .join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
      }
    }
    throw error;
  }
}; 