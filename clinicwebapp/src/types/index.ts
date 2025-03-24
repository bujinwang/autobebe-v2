export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  defaultClinicId?: string;
  clinics?: Clinic[];
  position?: string;
  specialty?: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string | null;
  clinicId: string;
  isActive: boolean;
}

export interface Patient {
  id: number;
  name: string;
  phone: string;
  clinicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  clinicId: string;
  appointmentDate: string;
  status: string;
  purposeOfVisit?: string;
  symptoms: string;
  followUpQuestions: string;
  followUpAnswers: string;
  possibleTreatments: string;
  suggestedPrescriptions: string;
  patient?: Patient;
  doctor?: Doctor;
  clinic?: Clinic;
}