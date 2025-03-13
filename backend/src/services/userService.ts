import { PrismaClient } from '@prisma/client';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: string;
  clinicId?: string;
}

export interface UpdateUserInput extends Partial<Omit<CreateUserInput, 'password'>> {
  id: number;
  password?: string;
}

class UserService {
  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany({
      include: {
        clinic: true
      }
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        clinic: true
      }
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        clinic: true
      }
    });
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    return prisma.user.create({
      data: {
        ...input,
        password: hashedPassword
      },
      include: {
        clinic: true
      }
    });
  }

  async updateUser(input: UpdateUserInput): Promise<User> {
    const { id, password, ...updateData } = input;
    const data: any = { ...updateData };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    return prisma.user.update({
      where: { id },
      data,
      include: {
        clinic: true
      }
    });
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}

export const userService = new UserService(); 