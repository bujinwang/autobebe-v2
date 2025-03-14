import axios from 'axios';
import { Clinic } from '../../types';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configure axios with auth token
const getAuthHeader = () => {
  const token = authService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const clinicService = {
  getAllClinics: async (): Promise<Clinic[]> => {
    try {
      const response = await axios.get(`${API_URL}/clinics`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getClinicById: async (id: number): Promise<Clinic> => {
    try {
      const response = await axios.get(`${API_URL}/clinics/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default clinicService;