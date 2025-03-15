import axios from 'axios';
import { Patient } from '../../types';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const patientService = {
  getPatients: async (): Promise<Patient[]> => {
    try {
      const token = authService.getToken();
      const response = await axios.get(`${API_URL}/patients`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  },

  getPatientById: async (id: number): Promise<Patient | null> => {
    try {
      const token = authService.getToken();
      const response = await axios.get(`${API_URL}/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient with id ${id}:`, error);
      return null;
    }
  },

  createPatient: async (patientData: Partial<Patient>): Promise<Patient | null> => {
    try {
      const token = authService.getToken();
      const response = await axios.post(`${API_URL}/patients`, patientData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  updatePatient: async (id: number, patientData: Partial<Patient>): Promise<Patient | null> => {
    try {
      const token = authService.getToken();
      const response = await axios.put(`${API_URL}/patients/${id}`, patientData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating patient with id ${id}:`, error);
      throw error;
    }
  }
};

export default patientService;