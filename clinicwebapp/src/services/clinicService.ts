import axiosInstance from './axiosConfig';
import { Clinic } from '../types';

class ClinicService {
  private baseUrl = '/clinics';

  async getAllClinics(): Promise<Clinic[]> {
    try {
      const response = await axiosInstance.get(this.baseUrl);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch clinics');
    }
  }

  async getClinicById(id: string): Promise<Clinic> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch clinic');
    }
  }

  async createClinic(clinicData: Partial<Clinic>): Promise<Clinic> {
    try {
      const response = await axiosInstance.post(this.baseUrl, clinicData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create clinic');
    }
  }

  async updateClinic(id: string, clinicData: Partial<Clinic>): Promise<Clinic> {
    try {
      const response = await axiosInstance.put(`${this.baseUrl}/${id}`, clinicData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update clinic');
    }
  }

  async deleteClinic(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete clinic');
    }
  }

  async getClinicsByUser(userId: string): Promise<Clinic[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/user/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user clinics');
    }
  }
}

export default new ClinicService(); 