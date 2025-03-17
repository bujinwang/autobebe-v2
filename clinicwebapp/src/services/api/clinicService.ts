import axios from 'axios';
import { Clinic } from '../../types';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
      console.error('Error fetching clinics:', error);
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
      console.error(`Error fetching clinic with ID ${id}:`, error);
      throw error;
    }
  },

  createClinic: async (data: Partial<Clinic>): Promise<Clinic> => {
    try {
      const response = await axios.post(`${API_URL}/clinics`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating clinic:', error);
      throw error;
    }
  },

  updateClinic: async (id: number, data: Partial<Clinic>): Promise<Clinic> => {
    try {
      const response = await axios.put(`${API_URL}/clinics/${id}`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating clinic with ID ${id}:`, error);
      throw error;
    }
  },

  deleteClinic: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/clinics/${id}`, {
        headers: getAuthHeader()
      });
    } catch (error) {
      console.error(`Error deleting clinic with ID ${id}:`, error);
      throw error;
    }
  }
};

export default clinicService;
