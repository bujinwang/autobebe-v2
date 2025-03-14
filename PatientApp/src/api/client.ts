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
    const response = await apiClient.get('/clinics/selection');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch clinics:', error);
    // Return mock data for development if API fails
    return [
      { id: '4F420955', name: "Naomi's Clinic" },
      { id: '8A7B3C2D', name: 'Downtown Medical Center' },
      { id: '1E2F3G4H', name: 'Westside Family Practice' }
    ];
  }
};

// Save patient data
export const savePatientData = async (patientData) => {
  try {
    const response = await apiClient.post('/patients', patientData);
    return response.data;
  } catch (error) {
    console.error('Error in savePatientData:', error);
    throw error;
  }
};

export default apiClient;