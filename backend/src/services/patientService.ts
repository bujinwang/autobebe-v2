import { PrismaClient, Patient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePatientData {
  name: string;
  healthcareNumber: string;
  phone?: string;
  clinicId: string;
}

export interface UpdatePatientData {
  name?: string;
  phone?: string;
  clinicId?: string;
}

export const patientService = {
  // Create a new patient
  create: async (data: CreatePatientData): Promise<Patient> => {
    return prisma.patient.create({
      data,
      include: {
        clinic: true,
      },
    });
  },

  // Get a patient by ID
  getById: async (id: number): Promise<Patient | null> => {
    return prisma.patient.findUnique({
      where: { id },
      include: {
        clinic: true,
        appointments: true,
      },
    });
  },

  // Get a patient by healthcare number
  getByHealthcareNumber: async (healthcareNumber: string): Promise<Patient | null> => {
    return prisma.patient.findUnique({
      where: { healthcareNumber },
      include: {
        clinic: true,
        appointments: true,
      },
    });
  },

  // Get all patients for a clinic
  getByClinic: async (clinicId: string): Promise<Patient[]> => {
    return prisma.patient.findMany({
      where: { clinicId },
      include: {
        appointments: true,
      },
    });
  },

  // Update a patient
  update: async (id: number, data: UpdatePatientData): Promise<Patient> => {
    return prisma.patient.update({
      where: { id },
      data,
      include: {
        clinic: true,
      },
    });
  },

  // Delete a patient
  delete: async (id: number): Promise<Patient> => {
    return prisma.patient.delete({
      where: { id },
    });
  },
}; 