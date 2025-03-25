import Mailjet from 'node-mailjet';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC || '',
  process.env.MJ_APIKEY_PRIVATE || ''
);

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'noreply@autobebesys.com',
            Name: 'AutoBebe System'
          },
          To: [
            {
              Email: options.to,
              Name: options.to.split('@')[0]
            }
          ],
          Subject: options.subject,
          HTMLPart: options.html
        }
      ]
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};

// Helper methods for specific email types
async function sendRegistrationEmail(to: string, name: string, verificationToken: string): Promise<boolean> {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  try {
    return await sendEmail({
      to,
      subject: 'Welcome to AutoBebe - Verify Your Email',
      html: `
        <h2>Welcome to AutoBebe!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for registering with AutoBebe. Please verify your email by clicking the following link: ${verificationUrl}</p>
      `
    });
  } catch (error) {
    console.error('Failed to send registration email:', error);
    return false;
  }
}

async function sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    return await sendEmail({
      to,
      subject: 'AutoBebe System Support - Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>Dear ${name},</p>
        <p>You have requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
      `
    });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

async function send2FACode(to: string, name: string, code: string): Promise<boolean> {
  try {
    return await sendEmail({
      to,
      subject: 'AutoBebe - Your 2FA Code',
      html: `
        <h2>Your 2FA Code</h2>
        <p>Dear ${name},</p>
        <p>Your 2FA code is:</p>
        <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${code}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `
    });
  } catch (error) {
    console.error('Failed to send 2FA code:', error);
    return false;
  }
}

async function sendSupportMessage(from: { name: string; email: string }, subject: string, message: string): Promise<boolean> {
  try {
    return await sendEmail({
      to: 'support@autobebesys.com',
      subject: `Support Request: ${subject}`,
      html: `
        <h2>New Support Message</h2>
        <div style="margin-bottom: 20px;">
          <strong>From:</strong> ${from.name} (${from.email})
        </div>
        <div style="margin-bottom: 20px;">
          <strong>Subject:</strong> ${subject}
        </div>
        <div style="margin-bottom: 20px;">
          <strong>Message:</strong><br>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send support message:', error);
    return false;
  }
}

export const emailService = {
  sendRegistrationEmail,
  sendPasswordResetEmail,
  send2FACode,
  sendSupportMessage,
}; 