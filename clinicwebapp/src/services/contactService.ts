import axiosInstance from './axiosConfig';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}

class ContactService {
  private baseUrl = '/support';

  async sendSupportMessage(formData: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await axiosInstance.post<ContactResponse>(`${this.baseUrl}/message`, formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to send message. Please try again later.');
    }
  }
}

const contactServiceInstance = new ContactService();
export default contactServiceInstance; 