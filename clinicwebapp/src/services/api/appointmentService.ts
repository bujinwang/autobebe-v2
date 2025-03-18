import axiosInstance from './axiosConfig';
import { Appointment } from '../../types';
import { isSameDay, parseISO } from 'date-fns';

const appointmentService = {
  // Get all appointments (no date filter)
  getAllAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await axiosInstance.get('/appointments');
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  // Get appointments by date
  getAppointmentsByDate: async (date: string): Promise<Appointment[]> => {
    try {
      const response = await axiosInstance.get('/appointments', {
        params: { date }
      });
      
      // If the backend doesn't support date filtering, we can do it client-side
      if (!response.data.some((appointment: Appointment) => 
        'date' in appointment && appointment.date === date)) {
        const dateObj = parseISO(date);
        return response.data.filter((appointment: Appointment) => 
          isSameDay(parseISO(appointment.appointmentDate), dateObj)
        );
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments by date:', error);
      throw error;
    }
  },

  // Get appointments by patient ID
  getAppointmentsByPatient: async (patientId: number): Promise<Appointment[]> => {
    try {
      const response = await axiosInstance.get(`/appointments/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments by patient:', error);
      throw error;
    }
  },

  // Get a single appointment by ID
  getAppointmentById: async (id: number): Promise<Appointment> => {
    try {
      const response = await axiosInstance.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment with ID ${id}:`, error);
      throw error;
    }
  },

  // Update an appointment
  updateAppointment: async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
    try {
      const response = await axiosInstance.put(`/appointments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new appointment
  createAppointment: async (data: Partial<Appointment>): Promise<Appointment> => {
    try {
      const response = await axiosInstance.post('/appointments', data);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
  
  // Delete an appointment
  deleteAppointment: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/appointments/${id}`);
    } catch (error) {
      console.error(`Error deleting appointment with ID ${id}:`, error);
      throw error;
    }
  },

  getTodayAppointments: async (): Promise<Appointment[]> => {
    try {
      const appointments = await appointmentService.getAllAppointments();
      return appointments.filter(appointment => 
        isSameDay(parseISO(appointment.appointmentDate), new Date())
      );
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
      throw error;
    }
  }
};

export default appointmentService;
