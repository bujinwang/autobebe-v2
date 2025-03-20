import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  clinicId?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthServiceConfig {
  jwtSecret: string;
}

class AuthService {
  private readonly jwtSecret: string;

  constructor(config: AuthServiceConfig) {
    this.jwtSecret = config.jwtSecret;
  }

  async register(data: CreateUserData) {
    const { clinicId, ...restData } = data;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const userData = {
      ...restData,
      password: hashedPassword,
    };
    
    // Add clinicId only if it's defined to satisfy Prisma's typing
    if (clinicId) {
      (userData as any).clinicId = clinicId;
    }
    
    const user = await prisma.user.create({
      data: userData,
    });

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role,
        clinicId: user.clinicId 
      },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        clinicId: user.clinicId
      },
      token,
    };
  }

  async login({ email, password }: LoginData) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role,
        clinicId: user.clinicId 
      },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        clinicId: user.clinicId
      },
      token,
    };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      throw new Error('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}

const config = {
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
};

const authService = new AuthService(config);

export { authService, CreateUserData, LoginData };