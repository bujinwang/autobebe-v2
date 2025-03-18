import axiosInstance from './axiosConfig';
import { Patient } from '../../types';

const patientService = {
  getAllPatients: async (): Promise<Patient[]> => {
    try {
      const response = await axiosInstance.get('/patients');
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  getPatientById: async (id: number): Promise<Patient> => {
    try {
      const response = await axiosInstance.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient with ID ${id}:`, error);
      throw error;
    }
  },

  createPatient: async (data: Partial<Patient>): Promise<Patient> => {
    try {
      const response = await axiosInstance.post('/patients', data);
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  updatePatient: async (id: number, data: Partial<Patient>): Promise<Patient> => {
    try {
      const response = await axiosInstance.put(`/patients/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating patient with ID ${id}:`, error);
      throw error;
    }
  },

  deletePatient: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/patients/${id}`);
    } catch (error) {
      console.error(`Error deleting patient with ID ${id}:`, error);
      throw error;
    }
  }
};

export default patientService;
