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

// Check if a patient already exists by phone number and name
export const checkPatientExists = async (phone: string, name?: string): Promise<Patient | null> => {
  try {
    // Remove any non-digit characters from phone
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Build query parameters
    let queryParams = `phone=${cleanPhone}`;
    if (name) {
      // Add name parameter if provided
      queryParams += `&name=${encodeURIComponent(name)}`;
    }
    
    // Send request to check if patient exists
    const response = await apiClient.get(`/public/patients/check?${queryParams}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking if patient exists:', error);
    // Just return null if there's an error checking
    return null;
  }
};

// Register a new patient
export const registerPatient = async (patientData: Patient): Promise<Patient> => {
  try {
    // Standardize the phone format - always use digits only for API requests
    const cleanPhone = patientData.phone.replace(/\D/g, '');
    const patientWithCleanPhone = {
      ...patientData,
      phone: cleanPhone
    };
    
    // First check if patient already exists by phone number AND name
    const existingPatient = await checkPatientExists(cleanPhone, patientData.name);
    
    // If patient already exists with same name and phone, return the existing patient
    if (existingPatient) {
      console.log('Patient already exists with same name and phone, returning existing patient:', existingPatient);
      return existingPatient;
    }
    
    // Send the registration request with clean phone number
    console.log('Registering new patient with clean phone:', patientWithCleanPhone);
    const response = await apiClient.post('/public/patients/register', patientWithCleanPhone);
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

    // Standardize the phone format - always use digits only for API requests
    const cleanPhone = patientData.phone.replace(/\D/g, '');
    const patientWithCleanPhone = {
      ...patientData,
      phone: cleanPhone
    };

    // Check if patient already exists by phone number AND name
    const existingPatient = await checkPatientExists(cleanPhone, patientData.name);
    
    // If patient already exists with same name and phone, return the existing patient
    if (existingPatient) {
      console.log('Patient already exists with same name and phone in savePatientData, returning existing patient:', existingPatient);
      return existingPatient;
    }

    // Log the data being sent
    console.log('Sending patient data with clean phone:', JSON.stringify(patientWithCleanPhone, null, 2));

    // Register the patient using the public endpoint
    const response = await apiClient.post('/public/patients/register', patientWithCleanPhone);
    
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