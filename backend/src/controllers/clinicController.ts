import { Request, Response } from 'express';
import { clinicService, CreateClinicInput, UpdateClinicInput } from '../services/clinicService';

export const clinicController = {
  async getAllClinics(req: Request, res: Response) {
    try {
      const clinics = await clinicService.getAllClinics();
      res.json(clinics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch clinics' });
    }
  },

  async getClinicById(req: Request, res: Response) {
    try {
      // Handle both query param and path param
      const id = req.query.id || req.params.id;
      
      if (!id) {
        return res.status(400).json({ error: 'Missing clinic ID parameter' });
      }
      
      // Add ID format validation
      if (!/^[A-Z0-9]{8}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid clinic ID format' });
      }

      const clinic = await clinicService.getClinicById(id);
      if (!clinic) {
        return res.status(404).json({ error: 'Clinic not found' });
      }
      res.json(clinic);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch clinic' });
    }
  },

  async createClinic(req: Request, res: Response) {
    try {
      const input: CreateClinicInput = req.body;
      const clinic = await clinicService.createClinic(input);
      res.status(201).json(clinic);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create clinic' });
    }
  },

  async updateClinic(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const input: UpdateClinicInput = {
        id,
        ...req.body
      };
      const clinic = await clinicService.updateClinic(input);
      res.json(clinic);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update clinic' });
    }
  },

  async deleteClinic(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const success = await clinicService.deleteClinic(id);
      if (!success) {
        return res.status(404).json({ error: 'Clinic not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete clinic' });
    }
  },
  async getClinicsForSelection(req: Request, res: Response) {
      try {
        const clinics = await clinicService.getAllClinics();
        const simplifiedClinics = clinics.map(clinic => ({
          id: clinic.id,
          name: clinic.name
        }));
        res.json(simplifiedClinics);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clinics for selection' });
      }
    },
};