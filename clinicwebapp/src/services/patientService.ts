import axiosInstance from './axiosConfig';
import { Patient } from '../types';

class PatientService {
  private baseUrl = '/admin/patients';

  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await axiosInstance.get(this.baseUrl);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patients');
    }
  }

  async getPatientById(id: string): Promise<Patient> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patient');
    }
  }

  async createPatient(patientData: Partial<Patient>): Promise<Patient> {
    try {
      const response = await axiosInstance.post(this.baseUrl, patientData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create patient');
    }
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient> {
    try {
      const response = await axiosInstance.put(`${this.baseUrl}/${id}`, patientData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update patient');
    }
  }

  async deletePatient(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete patient');
    }
  }

  async getPatientsByClinic(clinicId: string): Promise<Patient[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/clinic/${clinicId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch clinic patients');
    }
  }
}

export default new PatientService(); 