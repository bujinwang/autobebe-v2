import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export const fetchClinicInfo = async (clinicId: string) => {
  try {
    const response = await apiClient.get(`/clinics/info`, {
      params: { id: clinicId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching clinic info:', error);
    throw error;
  }
};