import { axiosInstance } from '.';

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
    const response = await axiosInstance.get(`${this.baseUrl}?clinicId=${clinicId}`);
    return response.data;
  }

  async createStaffMember(data: CreateStaffData): Promise<StaffMember> {
    const response = await axiosInstance.post(this.baseUrl, data);
    return response.data;
  }

  async updateStaffMember(id: number, data: UpdateStaffData): Promise<StaffMember> {
    const response = await axiosInstance.patch(`${this.baseUrl}?id=${id}`, data);
    return response.data;
  }

  async toggleStaffStatus(id: number, isActive: boolean): Promise<StaffMember> {
    return this.updateStaffMember(id, { isActive });
  }
}

const staffService = new StaffService();
export default staffService; 