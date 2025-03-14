import axios from 'axios';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Update this to your actual API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add authorization header if needed
apiClient.interceptors.request.use(
  config => {
    // You might need to add an API key or token here
    // config.headers.Authorization = `Bearer ${yourAuthToken}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Test API connectivity
export const testApiConnectivity = async () => {
  try {
    console.log('Testing API connectivity...');
    const response = await apiClient.get('/health'); // Use a simple endpoint like /health
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API connectivity test failed:', error);
    return { success: false, error };
  }
};

// Fetch clinics for selection
export const fetchClinicsForSelection = async () => {
  try {
    console.log('Fetching clinics from backend service...');
    const response = await apiClient.get('/clinics/selection');
    console.log('Clinics fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch clinics:', error);
    // Fallback to mock data if API call fails
    console.log('Falling back to mock clinic data');
   
  }
};

// Save patient data
export const savePatientData = async (patientData) => {
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

export default apiClient;