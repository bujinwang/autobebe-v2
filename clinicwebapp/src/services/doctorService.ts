import axiosInstance from './axiosConfig';
import { Doctor } from '../types';

class DoctorService {
  private baseUrl = '/doctors';

  async getAllDoctors(): Promise<Doctor[]> {
    try {
      const response = await axiosInstance.get(this.baseUrl);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doctors');
    }
  }

  async getDoctorById(id: string): Promise<Doctor> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doctor');
    }
  }

  async createDoctor(doctorData: Partial<Doctor>): Promise<Doctor> {
    try {
      const response = await axiosInstance.post(this.baseUrl, doctorData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create doctor');
    }
  }

  async updateDoctor(id: string, doctorData: Partial<Doctor>): Promise<Doctor> {
    try {
      const response = await axiosInstance.put(`${this.baseUrl}/${id}`, doctorData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update doctor');
    }
  }

  async deleteDoctor(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete doctor');
    }
  }

  async getDoctorsByClinic(clinicId: string): Promise<Doctor[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/clinic/${clinicId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch clinic doctors');
    }
  }
}

export default new DoctorService(); 