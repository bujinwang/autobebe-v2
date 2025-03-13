import { PrismaClient } from '@prisma/client';
import { ClinicInfo } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateClinicInput {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface UpdateClinicInput extends Partial<CreateClinicInput> {
  id: string;
}

class ClinicService {
  async getAllClinics(): Promise<ClinicInfo[]> {
    return prisma.clinicInfo.findMany({
      include: {
        patients: true,
        users: true
      }
    });
  }

  async getClinicById(id: string): Promise<ClinicInfo | null> {
    return prisma.clinicInfo.findUnique({
      where: { id },
      include: {
        patients: true,
        users: true
      }
    });
  }

  async createClinic(input: CreateClinicInput): Promise<ClinicInfo> {
    return prisma.clinicInfo.create({
      data: input,
      include: {
        patients: true,
        users: true
      }
    });
  }

  async updateClinic(input: UpdateClinicInput): Promise<ClinicInfo> {
    const { id, ...updateData } = input;
    return prisma.clinicInfo.update({
      where: { id },
      data: updateData,
      include: {
        patients: true,
        users: true
      }
    });
  }

  async deleteClinic(id: string): Promise<boolean> {
    try {
      await prisma.clinicInfo.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const clinicService = new ClinicService(); 