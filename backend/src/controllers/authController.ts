import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';
import { emailService } from '../services/emailService';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const RESET_TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role,
        ...(user.role !== 'SUPER_ADMIN' && user.clinicId ? { clinicId: user.clinicId } : {})
      }, 
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Return user info and token
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        clinicId: user.clinicId,
        defaultClinicId: user.role !== 'SUPER_ADMIN' ? user.clinicId : undefined
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRY);

    // Store reset token in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Send reset email
    const success = await emailService.sendPasswordResetEmail(email, user.name, resetToken);
    
    if (!success) {
      return res.status(500).json({ message: 'Failed to send reset email' });
    }

    return res.status(200).json({
      message: 'Password reset instructions have been sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const adminChangePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, newPassword } = req.body;
    const adminId = req.user?.userId;
    const adminRole = req.user?.role;

    if (!adminId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user is admin
    if (adminRole !== 'SUPER_ADMIN' && adminRole !== 'CLINIC_ADMIN') {
      return res.status(403).json({ message: 'Only administrators can change other users passwords' });
    }

    // Find target user
    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For CLINIC_ADMIN, ensure they can only change passwords of users in their clinic
    if (adminRole === 'CLINIC_ADMIN') {
      const admin = await prisma.user.findUnique({
        where: { id: adminId }
      });

      if (targetUser.clinicId !== admin?.clinicId) {
        return res.status(403).json({ message: 'You can only change passwords for staff in your clinic' });
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { password: hashedPassword }
    });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Admin change password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};