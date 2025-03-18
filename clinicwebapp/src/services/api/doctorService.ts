import axiosInstance from './axiosConfig';
import { Doctor } from '../../types';

const doctorService = {
  getAllDoctors: async (): Promise<Doctor[]> => {
    try {
      const response = await axiosInstance.get('/doctors');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  getDoctorById: async (id: number): Promise<Doctor> => {
    try {
      const response = await axiosInstance.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching doctor with ID ${id}:`, error);
      throw error;
    }
  },

  createDoctor: async (data: Partial<Doctor>): Promise<Doctor> => {
    try {
      const response = await axiosInstance.post('/doctors', data);
      return response.data;
    } catch (error) {
      console.error('Error creating doctor:', error);
      throw error;
    }
  },

  updateDoctor: async (id: number, data: Partial<Doctor>): Promise<Doctor> => {
    try {
      const response = await axiosInstance.put(`/doctors/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating doctor with ID ${id}:`, error);
      throw error;
    }
  },

  deleteDoctor: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/doctors/${id}`);
    } catch (error) {
      console.error(`Error deleting doctor with ID ${id}:`, error);
      throw error;
    }
  }
};

export default doctorService;