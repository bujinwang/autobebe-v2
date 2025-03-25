import { Request, Response } from 'express';
import { userService, CreateUserInput, UpdateUserInput } from '../services/userService';

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
  }
}; 