import axios from 'axios';
import { Appointment, Clinic, Doctor, User } from '../types';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
    return null;
  },
};

// Appointment services
export const appointmentService = {
  getAllAppointments: async () => {
    const response = await api.get<Appointment[]>('/appointments');
    return response.data;
  },
  getAppointmentById: async (id: number) => {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },
  getAppointmentsByDate: async (date: string) => {
    const response = await api.get<Appointment[]>(`/appointments/date/${date}`);
    return response.data;
  },
  updateAppointment: async (id: number, data: Partial<Appointment>) => {
    const response = await api.put<Appointment>(`/appointments/${id}`, data);
    return response.data;
  },
};

// Clinic services
export const clinicService = {
  getAllClinics: async () => {
    const response = await api.get<Clinic[]>('/clinics');
    return response.data;
  },
  getClinicById: async (id: number) => {
    const response = await api.get<Clinic>(`/clinics/${id}`);
    return response.data;
  },
};

// Doctor services
export const doctorService = {
  getAllDoctors: async () => {
    const response = await api.get<Doctor[]>('/doctors');
    return response.data;
  },
  getDoctorById: async (id: number) => {
    const response = await api.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },
  createDoctor: async (data: Partial<Doctor>) => {
    const response = await api.post<Doctor>('/doctors', data);
    return response.data;
  },
  updateDoctor: async (id: number, data: Partial<Doctor>) => {
    const response = await api.put<Doctor>(`/doctors/${id}`, data);
    return response.data;
  },
  deleteDoctor: async (id: number) => {
    await api.delete(`/doctors/${id}`);
  },
};

export default api;