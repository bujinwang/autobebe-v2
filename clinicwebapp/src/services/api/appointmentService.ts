import axios from 'axios';
import { Appointment } from '../../types';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configure axios with auth token
const getAuthHeader = () => {
  const token = authService.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const appointmentService = {
  getAppointmentsByDate: async (date: string): Promise<Appointment[]> => {
    try {
      const response = await axios.get(`${API_URL}/appointments`, {
        params: { date },
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentById: async (id: number): Promise<Appointment> => {
    try {
      const response = await axios.get(`${API_URL}/appointments/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAppointment: async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
    try {
      const response = await axios.patch(`${API_URL}/appointments/${id}`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAppointment: async (data: Partial<Appointment>): Promise<Appointment> => {
    try {
      const response = await axios.post(`${API_URL}/appointments`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default appointmentService;