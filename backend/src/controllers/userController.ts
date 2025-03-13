import { Request, Response } from 'express';
import { userService, CreateUserInput, UpdateUserInput } from '../services/userService';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const userController = {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const input: CreateUserInput = req.body;
      const user = await userService.createUser(input);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const input: UpdateUserInput = {
        id,
        ...req.body
      };
      const user = await userService.updateUser(input);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const success = await userService.deleteUser(id);
      if (!success) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await userService.verifyPassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          clinicId: user.clinicId 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token, user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ error: 'Failed to login' });
    }
  }
}; 