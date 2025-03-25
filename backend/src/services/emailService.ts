import Mailjet from 'node-mailjet';

interface EmailOptions {
  to: {
    email: string;
    name?: string;
  }[];
  subject: string;
  textPart: string;
  htmlPart: string;
}

class EmailService {
  private mailjet: any;

  constructor() {
    this.mailjet = Mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC || '',
      process.env.MJ_APIKEY_PRIVATE || ''
    );
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const request = this.mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: 'noreply@autobebesys.com',
                Name: 'AutoBebe System'
              },
              To: options.to,
              Subject: options.subject,
              TextPart: options.textPart,
              HTMLPart: options.htmlPart
            }
          ]
        });

      const result = await request;
      console.log('Email sent successfully:', result.body);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Helper methods for specific email types
  async sendRegistrationEmail(to: string, name: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    return this.sendEmail({
      to: [{ email: to, name }],
      subject: 'Welcome to AutoBebe - Verify Your Email',
      textPart: `Dear ${name},\n\nWelcome to AutoBebe! Please verify your email by clicking the following link: ${verificationUrl}`,
      htmlPart: `
        <h2>Welcome to AutoBebe!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for registering with AutoBebe. Please verify your email by clicking the button below:</p>
        <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
          Verify Email
        </a>
      `
    });
  }

  async sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    return this.sendEmail({
      to: [{ email: to, name }],
      subject: 'AutoBebe - Password Reset Request',
      textPart: `Dear ${name},\n\nYou have requested to reset your password. Click the following link to reset it: ${resetUrl}`,
      htmlPart: `
        <h2>Password Reset Request</h2>
        <p>Dear ${name},</p>
        <p>You have requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
      `
    });
  }

  async send2FACode(to: string, name: string, code: string): Promise<boolean> {
    return this.sendEmail({
      to: [{ email: to, name }],
      subject: 'AutoBebe - Your 2FA Code',
      textPart: `Dear ${name},\n\nYour 2FA code is: ${code}\n\nThis code will expire in 5 minutes.`,
      htmlPart: `
        <h2>Your 2FA Code</h2>
        <p>Dear ${name},</p>
        <p>Your 2FA code is:</p>
        <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${code}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `
    });
  }
}

export const emailService = new EmailService(); 