import { PrismaClient } from '@prisma/client';
import { Patient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePatientInput {
  name: string;
  healthcareNumber: string;
  phone?: string;
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