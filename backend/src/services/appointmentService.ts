import { PrismaClient, Appointment } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateAppointmentData {
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

export interface UpdateAppointmentData {
  appointmentDate?: Date;
  status?: string;
  followUpQuestions?: any;
  followUpAnswers?: any;
  possibleTreatments?: any;
  suggestedPrescriptions?: any;
  notes?: string;
}

export const appointmentService = {
  // Create a new appointment
  create: async (data: CreateAppointmentData): Promise<Appointment> => {
    return prisma.appointment.create({
      data,
      include: {
        patient: true,
        clinic: true,
      },
    });
  },

  // Get an appointment by ID
  getById: async (id: number): Promise<Appointment | null> => {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        clinic: true,
      },
    });
  },

  // Get appointments by patient ID
  getByPatient: async (patientId: number): Promise<Appointment[]> => {
    return prisma.appointment.findMany({
      where: { patientId },
      include: {
        clinic: true,
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });
  },

  // Get appointments by clinic ID
  getByClinic: async (clinicId: string): Promise<Appointment[]> => {
    return prisma.appointment.findMany({
      where: { clinicId },
      include: {
        patient: true,
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });
  },

  // Get appointments by date range
  getByDateRange: async (startDate: Date, endDate: Date, clinicId?: string): Promise<Appointment[]> => {
    return prisma.appointment.findMany({
      where: {
        AND: [
          {
            appointmentDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          clinicId ? { clinicId } : {},
        ],
      },
      include: {
        patient: true,
        clinic: true,
      },
      orderBy: {
        appointmentDate: 'asc',
      },
    });
  },

  // Update an appointment
  update: async (id: number, data: UpdateAppointmentData): Promise<Appointment> => {
    return prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: true,
        clinic: true,
      },
    });
  },

  // Delete an appointment
  delete: async (id: number): Promise<Appointment> => {
    return prisma.appointment.delete({
      where: { id },
    });
  },
}; 