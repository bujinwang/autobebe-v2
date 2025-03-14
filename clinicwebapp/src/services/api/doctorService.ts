import axios from 'axios';
import { Doctor } from '../../types';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configure axios with auth token
const getAuthHeader = () => {
  const token = authService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const doctorService = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    try {
      const response = await axios.get(`${API_URL}/doctors`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDoctorById: async (id: number): Promise<Doctor> => {
    try {
      const response = await axios.get(`${API_URL}/doctors/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createDoctor: async (data: Partial<Doctor>): Promise<Doctor> => {
    try {
      const response = await axios.post(`${API_URL}/doctors`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDoctor: async (id: number, data: Partial<Doctor>): Promise<Doctor> => {
    try {
      const response = await axios.patch(`${API_URL}/doctors/${id}`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDoctor: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/doctors/${id}`, {
        headers: getAuthHeader()
      });
    } catch (error) {
      throw error;
    }
  }
};

export default doctorService;