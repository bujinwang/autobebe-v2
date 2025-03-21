import { PrismaClient } from '@prisma/client';
import { Patient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePatientInput {
  name: string;
  phone?: string;
  email?: string;
  clinicId: string;
}

export interface UpdatePatientInput extends Partial<CreatePatientInput> {
  id: number;
}

class PatientService {
  async getAllPatients(): Promise<Patient[]> {
    return prisma.patient.findMany({
      include: {
        clinic: true
      }
    });
  }

  async getPatientById(id: number): Promise<Patient | null> {
    return prisma.patient.findUnique({
      where: { id },
      include: {
        clinic: true
      }
    });
  }

  async getPatientsByClinicId(clinicId: string): Promise<Patient[]> {
    return prisma.patient.findMany({
      where: { clinicId },
      include: {
        clinic: true
      }
    });
  }

  async createPatient(input: CreatePatientInput): Promise<Patient> {
    return prisma.patient.create({
      data: input,
      include: {
        clinic: true
      }
    });
  }

  async findOrCreatePatient(input: CreatePatientInput): Promise<Patient> {
    // Prepare where conditions
    const whereConditions = [];
    
    // Add phone condition if provided
    if (input.phone) {
      whereConditions.push({ phone: input.phone });
    }
    
    // Add email condition if provided
    if (input.email) {
      whereConditions.push({ email: input.email });
    }
    
    // Only search if we have at least one identifier
    if (whereConditions.length > 0) {
      // Try to find a patient with the same phone number or email in the same clinic
      const existingPatient = await prisma.patient.findFirst({
        where: {
          clinicId: input.clinicId,
          OR: whereConditions
        }
      });
      
      // If found, return the existing patient
      if (existingPatient) {
        return existingPatient;
      }
    }

    // Otherwise, create a new patient
    return this.createPatient(input);
  }

  async updatePatient(input: UpdatePatientInput): Promise<Patient> {
    const { id, ...updateData } = input;
    return prisma.patient.update({
      where: { id },
      data: updateData,
      include: {
        clinic: true
      }
    });
  }

  async deletePatient(id: number): Promise<boolean> {
    try {
      await prisma.patient.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const patientService = new PatientService(); 