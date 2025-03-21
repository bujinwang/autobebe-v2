import axios, { AxiosError, AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

// Create an axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: config.API.BASE_URL,
  timeout: config.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Type': 'patient-app'  // Identify as patient app
  }
});

// Add request interceptor for patient app specific headers
apiClient.interceptors.request.use(
  async config => {
    // Check if this is a patient appointment endpoint
    const isPatientAppointment = config.url?.includes('/appointments/patient');
    
    if (isPatientAppointment) {
      // For patient appointments, use device ID as identifier
      const deviceId = await AsyncStorage.getItem('deviceId');
      if (!deviceId) {
        const newDeviceId = `DEVICE_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        await AsyncStorage.setItem('deviceId', newDeviceId);
        config.headers['X-Device-ID'] = newDeviceId;
      } else {
        config.headers['X-Device-ID'] = deviceId;
      }
    } else {
      // For other endpoints, try to use auth token if available
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling common errors
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., clear token and redirect to login)
      await AsyncStorage.removeItem(config.AUTH.STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(config.AUTH.STORAGE_KEYS.TOKEN_EXPIRY);
    }
    return Promise.reject(error);
  }
);

// Test API connectivity
export const testApiConnectivity = async () => {
  try {
    console.log('Testing API connectivity...');
    const response = await apiClient.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API connectivity test failed:', error);
    return { success: false, error };
  }
};

// Helper function to check if an error is an AxiosError
export const isAxiosError = axios.isAxiosError;

// Fetch clinics for selection
export const fetchClinicsForSelection = async () => {
  try {
    console.log('Fetching clinics from backend service...');
    const response = await apiClient.get('/public/clinics/list');
    console.log('Clinics fetched successfully:', response.data);
    
    // The response should be an array directly
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // If it's wrapped in a success property
    if (response.data?.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    console.warn('Unexpected response structure:', response.data);
    return [];
  } catch (error) {
    console.error('Failed to fetch clinics:', error);
    // Fallback to mock data if API call fails
    console.log('Falling back to mock clinic data');
    return [
      {
        id: '4F420955',
        name: "Naomi's Clinic",
        company: "Naomi's Healthcare",
        address: '123 Healthcare St',
        phone: '555-0123',
        hours: '9:00 AM - 5:00 PM',
        welcomeMessage: 'Welcome to our clinic!'
      }
    ];
  }
};

interface PatientData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone?: string;
  email?: string;
  address?: string;
  healthCareNumber?: string;
  [key: string]: any; // For any additional fields
}

// Save patient data
export const savePatientData = async (patientData: PatientData) => {
  // Remove healthCareNumber from patientData if it exists
  const { healthCareNumber, ...updatedPatientData } = patientData;

  try {
    const response = await apiClient.post('/patients', updatedPatientData);
    return response.data;
  } catch (error) {
    console.error('Error in savePatientData:', error);
    // Return mock success response for development
    return {
      id: 'MOCK-ID-123',
      ...updatedPatientData,
      createdAt: new Date().toISOString()
    };
  }
};

// Update patient data
export const updatePatient = async (patientId: string, patientData: any) => {
  try {
    // No need to handle healthcare number removal anymore
    const response = await apiClient.put(`/patients/${patientId}`, patientData);
    return response.data;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

// Export the configured client as default
export default apiClient;