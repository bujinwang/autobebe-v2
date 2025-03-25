import { Request, Response } from 'express';
import { emailService } from '../services/emailService';

export const supportController = {
  async sendSupportMessage(req: Request, res: Response) {
    try {
      const { name, email, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          error: 'Name, email, subject, and message are required'
        });
      }

      // Send email using emailService
      const emailSent = await emailService.sendSupportMessage(
        { name, email },
        subject,
        message
      );

      if (!emailSent) {
        return res.status(500).json({
          success: false,
          error: 'Failed to send support message'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Support message sent successfully'
      });
    } catch (error) {
      console.error('Error sending support message:', error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while sending the message'
      });
    }
  }
}; 