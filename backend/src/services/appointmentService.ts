import { PrismaClient } from '@prisma/client';
import { Appointment } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateAppointmentInput {
  patientId: number;
  clinicId: string;
  appointmentDate: Date;
  status: string;
  purposeOfVisit?: string;
  symptoms?: string;
  followUpAnswers: string;
  followUpQuestions: string;
  possibleTreatments: string;
  suggestedPrescriptions: string;
}

export interface UpdateAppointmentInput extends Partial<CreateAppointmentInput> {
  id: number;
}

class AppointmentService {
  async getAllAppointments(): Promise<Appointment[]> {
    return prisma.appointment.findMany({
      include: {
        patient: true,
        clinic: true
      }
    });
  }

  async getAppointmentById(id: number): Promise<Appointment | null> {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        clinic: true
      }
    });
  }

  async getAppointmentsByPatientId(patientId: number): Promise<Appointment[]> {
    return prisma.appointment.findMany({
      where: { patientId },
      include: {
        patient: true,
        clinic: true
      }
    });
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        patient: true,
        clinic: true
      }
    });
  }

  async createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    // Extract the fields that should be handled as relations
    const { patientId, clinicId, ...appointmentData } = input;
    
    // Ensure required fields have default values
    const data = {
      ...appointmentData,
      followUpAnswers: input.followUpAnswers || '',
      followUpQuestions: input.followUpQuestions || '',
      possibleTreatments: input.possibleTreatments || '',
      suggestedPrescriptions: input.suggestedPrescriptions || '',
      // Connect the appointment to an existing patient
      patient: {
        connect: { id: patientId }
      },
      // Connect to clinic
      clinic: {
        connect: { id: clinicId }
      }
    };
    
    return prisma.appointment.create({
      data,
      include: {
        patient: true,
        clinic: true
      }
    });
  }

  async updateAppointment(input: UpdateAppointmentInput): Promise<Appointment> {
    const { id, patientId, clinicId, ...updateData } = input;
    
    // Build the update data object
    const data: any = { ...updateData };
    
    // Handle relations if they're provided
    if (patientId) {
      data.patient = { connect: { id: patientId } };
    }
    
    if (clinicId) {
      data.clinic = { connect: { id: clinicId } };
    }
    
    return prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: true,
        clinic: true
      }
    });
  }

  async deleteAppointment(id: number): Promise<boolean> {
    try {
      await prisma.appointment.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const appointmentService = new AppointmentService();