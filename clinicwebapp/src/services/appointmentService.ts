import axiosInstance from './axiosConfig';
import { Appointment } from '../types';

class AppointmentService {
  private baseUrl = '/appointments';

  async getAppointments(clinicId: string): Promise<Appointment[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}?clinicId=${clinicId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }

  async getAppointmentById(id: string): Promise<Appointment> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch appointment');
    }
  }

  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      const response = await axiosInstance.post(this.baseUrl, appointmentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create appointment');
    }
  }

  async updateAppointment(id: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      const response = await axiosInstance.put(`${this.baseUrl}/${id}`, appointmentData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update appointment');
    }
  }

  async deleteAppointment(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete appointment');
    }
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    try {
      const response = await axiosInstance.patch(`${this.baseUrl}/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update appointment status');
    }
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/patient/${patientId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patient appointments');
    }
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/doctor/${doctorId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doctor appointments');
    }
  }

  async getAppointmentsByDate(date: string, clinicId: string): Promise<Appointment[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/date/${date}?clinicId=${clinicId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch appointments by date');
    }
  }
}

export default new AppointmentService(); 