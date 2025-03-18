import axiosInstance from './axiosConfig';
import { Clinic } from '../../types';

const clinicService = {
  getAllClinics: async (): Promise<Clinic[]> => {
    try {
      const response = await axiosInstance.get('/clinics');
      return response.data;
    } catch (error) {
      console.error('Error fetching clinics:', error);
      throw error;
    }
  },

  getClinicById: async (id: number): Promise<Clinic> => {
    try {
      const response = await axiosInstance.get(`/clinics/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching clinic with ID ${id}:`, error);
      throw error;
    }
  },

  createClinic: async (data: Partial<Clinic>): Promise<Clinic> => {
    try {
      const response = await axiosInstance.post('/clinics', data);
      return response.data;
    } catch (error) {
      console.error('Error creating clinic:', error);
      throw error;
    }
  },

  updateClinic: async (id: number, data: Partial<Clinic>): Promise<Clinic> => {
    try {
      const response = await axiosInstance.put(`/clinics/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating clinic with ID ${id}:`, error);
      throw error;
    }
  },

  deleteClinic: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/clinics/${id}`);
    } catch (error) {
      console.error(`Error deleting clinic with ID ${id}:`, error);
      throw error;
    }
  }
};

export default clinicService;
