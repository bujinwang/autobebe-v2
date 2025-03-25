import axiosInstance from './axiosConfig';
import { Doctor } from '../types';

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'CLINIC_ADMIN' | 'STAFF';
  position: string | null;
  specialty: string | null;
  isActive: boolean;
  clinicId: string;
}

export interface CreateStaffData extends Omit<StaffMember, 'id'> {
  password: string;
}

export interface UpdateStaffData extends Partial<CreateStaffData> {}

class StaffService {
  private baseUrl = '/staff';

  async getStaffMembers(clinicId: string): Promise<StaffMember[]> {
    try {
      const response = await axiosInstance.get(this.baseUrl, {
        params: { clinicId }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch staff members');
    }
  }

  async getAllStaff(clinicId: string): Promise<StaffMember[]> {
    return this.getStaffMembers(clinicId);
  }

  async getStaffById(id: number): Promise<StaffMember> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch staff member');
    }
  }

  async getDoctors(clinicId: string): Promise<Doctor[]> {
    try {
      const response = await axiosInstance.get(`${this.baseUrl}/doctors`, {
        params: { clinicId }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch doctors');
    }
  }

  async createStaffMember(staffData: CreateStaffData): Promise<StaffMember> {
    try {
      const response = await axiosInstance.post(this.baseUrl, staffData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create staff member');
    }
  }

  async updateStaffMember(id: number, staffData: UpdateStaffData): Promise<StaffMember> {
    try {
      const response = await axiosInstance.patch(this.baseUrl, {
        ...staffData,
        id
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update staff member');
    }
  }

  async toggleStaffStatus(id: number, isActive: boolean): Promise<StaffMember> {
    return this.updateStaffMember(id, { isActive });
  }

  async deleteStaffMember(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete staff member');
    }
  }
}

const staffServiceInstance = new StaffService();
export default staffServiceInstance; 