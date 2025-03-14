import axios from 'axios';

// Define the base URL for the API
const API_URL = 'http://localhost:3000/api';

// Define the Patient interface
export interface Patient {
  id?: number;
  name: string;
  healthcareNumber: string;
  phone: string;
  clinicId?: string;
}

// Create a patient
export const createPatient = async (patient: Patient): Promise<Patient> => {
  try {
    const response = await axios.post(`${API_URL}/Patients`, patient);
    return response.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

// Save patient data with connectivity check
export const savePatientData = async (patientData: Patient): Promise<any> => {
  try {
    // First, test the API connectivity
    console.log('Testing API connectivity...');
    try {
      const testResponse = await axios.get(`${API_URL}/patients`);
      if (testResponse.status < 200 || testResponse.status >= 300) {
        console.error('API health check failed:', {
          status: testResponse.status,
          statusText: testResponse.statusText
        });
        throw new Error('API server is not responding correctly');
      }
      console.log('API health check successful');
    } catch (testError: any) {
      console.error('API connectivity test failed:', {
        message: testError.message,
        name: testError.name
      });
      if (testError.name === 'TypeError' && testError.message.includes('Network request failed')) {
        throw new Error(
          'Cannot connect to the API server. Please ensure:\n\n' +
          '1. The backend API is running\n' +
          '2. It\'s running on port 5000\n' +
          '3. You\'re using the correct URL (http://localhost:5000)'
        );
      }
      throw testError;
    }

    // If we get here, the API is responsive, so try to save the data
    console.log('API is responsive, attempting to save patient data');
    console.log('Patient data being sent:', JSON.stringify(patientData, null, 2));
    
    const response = await axios.post(`${API_URL}/patients`, patientData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (response.status < 200 || response.status >= 300) {
      let errorMessage = `Server returned ${response.status}: ${response.statusText}`;
      try {
        const errorData = response.data;
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        console.warn('Could not parse error response:', parseError);
      }
      console.error('Server response not OK:', {
        status: response.status,
        statusText: response.statusText,
        body: response.data
      });
      throw new Error(errorMessage);
    }

    console.log('Successfully saved patient data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error in savePatientData:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
};

// Get patient by healthcare number
export const getPatientByHealthcareNumber = async (healthcareNumber: string): Promise<Patient | null> => {
  try {
    const response = await axios.get(`${API_URL}/Patients/healthcare-number/${healthcareNumber}`);
    return response.data;
  } catch (error) {
    // If patient not found, return null instead of throwing an error
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error('Error fetching patient:', error);
    throw error;
  }
}; 