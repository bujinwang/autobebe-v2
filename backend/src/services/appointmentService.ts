import { PrismaClient } from '@prisma/client';
import { Appointment } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateAppointmentInput {
  patientId: number;
  clinicId: string;
  appointmentDate: Date;
  status: string;
  followUpQuestions?: any;
  followUpAnswers?: any;
  possibleTreatments?: any;
  suggestedPrescriptions?: any;
  notes?: string;
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
    return prisma.appointment.create({
      data: input,
      include: {
        patient: true,
        clinic: true
      }
    });
  }

  async updateAppointment(input: UpdateAppointmentInput): Promise<Appointment> {
    const { id, ...updateData } = input;
    return prisma.appointment.update({
      where: { id },
      data: updateData,
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