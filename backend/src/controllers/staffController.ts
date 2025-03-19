import { Request, Response } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const staffController = {
  // Get all staff members for a clinic
  getStaffMembers: async (req: Request, res: Response) => {
    try {
      const { clinicId } = req.query;
      
      if (!clinicId) {
        return res.status(400).json({ message: 'Clinic ID is required' });
      }

      const staff = await prisma.user.findMany({
        where: {
          clinicId: clinicId as string,
          role: {
            in: [UserRole.SUPER_ADMIN, UserRole.CLINIC_ADMIN, UserRole.STAFF]
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          position: true,
          specialty: true,
          isActive: true,
          clinicId: true
        }
      });

      res.json(staff);
    } catch (error) {
      console.error('Error getting staff members:', error);
      res.status(500).json({ message: 'Failed to get staff members' });
    }
  },

  // Create a new staff member
  createStaffMember: async (req: Request, res: Response) => {
    try {
      const { name, email, password, role, position, specialty, isActive, clinicId } = req.body;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const staff = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role as UserRole,
          position: position || null,
          specialty: specialty || null,
          isActive: isActive ?? true,
          clinicId
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          position: true,
          specialty: true,
          isActive: true,
          clinicId: true
        }
      });

      res.status(201).json(staff);
    } catch (error) {
      console.error('Error creating staff member:', error);
      res.status(500).json({ message: 'Failed to create staff member' });
    }
  },

  // Update a staff member
  updateStaffMember: async (req: Request, res: Response) => {
    try {
      const { id } = req.query;
      const { name, email, password, role, position, specialty, isActive, clinicId } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Staff ID is required' });
      }

      const updateData: any = {
        name,
        email,
        role: role as UserRole,
        position: position || null,
        specialty: specialty || null,
        isActive: isActive ?? true,
        clinicId
      };

      // Only update password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const staff = await prisma.user.update({
        where: { id: parseInt(id as string) },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          position: true,
          specialty: true,
          isActive: true,
          clinicId: true
        }
      });

      res.json(staff);
    } catch (error) {
      console.error('Error updating staff member:', error);
      res.status(500).json({ message: 'Failed to update staff member' });
    }
  },

  // Delete a staff member
  deleteStaffMember: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { id: parseInt(id) }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting staff member:', error);
      res.status(500).json({ message: 'Failed to delete staff member' });
    }
  }
};

export default staffController; 