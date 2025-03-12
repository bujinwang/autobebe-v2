import { PrismaClient, ClinicInfo } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateClinicData {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface UpdateClinicData {
  name?: string;
  address?: string;
  phone?: string;
}

export const clinicService = {
  // Create a new clinic
  create: async (data: CreateClinicData): Promise<ClinicInfo> => {
    return prisma.clinicInfo.create({
      data,
    });
  },

  // Get a clinic by ID
  getById: async (id: string): Promise<ClinicInfo | null> => {
    return prisma.clinicInfo.findUnique({
      where: { id },
      include: {
        patients: true,
        appointments: true,
      },
    });
  },

  // Get all clinics
  getAll: async (): Promise<ClinicInfo[]> => {
    return prisma.clinicInfo.findMany({
      include: {
        patients: true,
        appointments: true,
      },
    });
  },

  // Update a clinic
  update: async (id: string, data: UpdateClinicData): Promise<ClinicInfo> => {
    return prisma.clinicInfo.update({
      where: { id },
      data,
    });
  },

  // Delete a clinic
  delete: async (id: string): Promise<ClinicInfo> => {
    return prisma.clinicInfo.delete({
      where: { id },
    });
  },
}; 