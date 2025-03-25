import axiosInstance from './axiosConfig';
import { Patient } from '../types';

class PatientService {
  private baseUrl = '/admin/patients';

  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await axiosInstance.get(this.baseUrl);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all patients:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch patients');
    }
  }

  async getPatientById(id: string): Promise<Patient> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching patient by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch patient');
    }
  }

  async getPatientsByClinic(clinicId: string): Promise<Patient[]> {
    try {
      const response = await axiosInstance.get(this.baseUrl, {
        params: { clinicId }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching clinic patients:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch clinic patients');
    }
  }

  async createPatient(patientData: {
    name: string;
    email: string;
    phone: string;
    clinicId: string;
  }): Promise<Patient> {
    try {
      console.log('Creating patient with data:', patientData);
      
      const response = await axiosInstance.post(this.baseUrl, patientData);
      console.log('Patient creation response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating patient:', {
        error: error.message,
        data: patientData,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers,
        }
      });
      
      if (error.response?.data) {
        console.error('Server error details:', error.response.data);
      }
      
      throw new Error(error.response?.data?.message || 'Failed to create patient');
    }
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient> {
    try {
      const response = await axiosInstance.put(`${this.baseUrl}/${id}`, patientData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating patient:', error);
      throw new Error(error.response?.data?.message || 'Failed to update patient');
    }
  }

  async deletePatient(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      console.error('Error deleting patient:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete patient');
    }
  }
}

const patientServiceInstance = new PatientService();
export default patientServiceInstance; 