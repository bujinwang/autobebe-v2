import apiClient, { isAxiosError } from '../api/client';
import { AxiosError } from 'axios';

// Define the base URL for the API

// Define the Appointment interface to match sanya-service
export interface Appointment {
  id: number;
  patientId: number;
  clinicId: string;
  appointmentDate: string;
  status: string;
  followUpQuestions: string;
  followUpAnswers: string;
  possibleTreatments: string;
  suggestedPrescriptions: string;
  purposeOfVisit?: string;
  symptoms?: string;
  doctorId?: number;
  patientName?: string;
  patientPhone?: string;
}

// Interface for patient appointment request
export interface PatientAppointmentRequest {
  patientInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  appointmentInfo: {
    clinicId: string;
    purposeOfVisit?: string;
    symptoms?: string;
    followUpQuestions?: string[];
    followUpAnswers?: string[];
  };
}

// Create an appointment
export const createAppointment = async (appointment: Appointment): Promise<Appointment> => {
  try {
    // Validate required IDs
    if (!appointment.patientId) {
      throw new Error('Patient ID is required');
    }
    
    if (!appointment.clinicId) {
      throw new Error('Clinic ID is required');
    }
    
    // Ensure required fields have default values
    const appointmentData = {
      ...appointment,
      followUpAnswers: appointment.followUpAnswers || '',
      followUpQuestions: appointment.followUpQuestions || '',
      possibleTreatments: appointment.possibleTreatments || '',
      suggestedPrescriptions: appointment.suggestedPrescriptions || ''
    };
    
    console.log('Sending appointment data:', JSON.stringify(appointmentData, null, 2));
    
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    if (error instanceof Error && isAxiosError(error) && error.response) {
      console.error('Server response data:', error.response.data);
      console.error('Server response status:', error.response.status);
    }
    throw error;
  }
};

// Create an appointment for unauthenticated patients
export const createPatientAppointment = async (request: PatientAppointmentRequest): Promise<Appointment> => {
  try {
    // Validate required fields
    if (!request.patientInfo.name || !request.patientInfo.phone) {
      throw new Error('Patient name and phone are required');
    }
    
    if (!request.appointmentInfo.clinicId) {
      throw new Error('Clinic ID is required');
    }
    
    // Ensure followUpQuestions and followUpAnswers are arrays
    const followUpQuestions = Array.isArray(request.appointmentInfo.followUpQuestions) 
      ? request.appointmentInfo.followUpQuestions 
      : [];
    
    const followUpAnswers = Array.isArray(request.appointmentInfo.followUpAnswers) 
      ? request.appointmentInfo.followUpAnswers 
      : [];
    
    // Format the data for the API
    const appointmentData = {
      patientInfo: {
        ...request.patientInfo,
      },
      appointmentInfo: {
        ...request.appointmentInfo,
        status: 'Pending',
        appointmentDate: new Date().toISOString(),
        followUpQuestions,
        followUpAnswers,
        possibleTreatments: '',
        suggestedPrescriptions: ''
      }
    };
    
    console.log('Sending patient appointment data:', JSON.stringify(appointmentData, null, 2));
    
    const response = await apiClient.post('/public/appointments/patient', appointmentData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating patient appointment:', error);
    if (error instanceof Error && isAxiosError(error) && error.response) {
      console.error('Server response data:', error.response.data);
      console.error('Server response status:', error.response.status);
    }
    throw error;
  }
};

// Get appointments by patient ID
export const getAppointmentsByPatientId = async (patientId: number): Promise<Appointment[]> => {
  try {
    const response = await apiClient.get(`/appointments/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Get appointment by ID
export const getAppointmentById = async (id: number): Promise<Appointment> => {
  try {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
};

// Update an appointment
export const updateAppointment = async (id: number, appointment: Appointment): Promise<Appointment> => {
  try {
    const response = await apiClient.put(`/appointments/${id}`, appointment);
    return response.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (id: number): Promise<boolean> => {
  try {
    await apiClient.delete(`/appointments/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }
};