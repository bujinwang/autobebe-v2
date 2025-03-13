import { Request, Response } from 'express';
import { patientService, CreatePatientInput, UpdatePatientInput } from '../services/patientService';

export const patientController = {
  async getAllPatients(req: Request, res: Response) {
    try {
      const patients = await patientService.getAllPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch patients' });
    }
  },

  async getPatientById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const patient = await patientService.getPatientById(id);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch patient' });
    }
  },

  async getPatientsByClinicId(req: Request, res: Response) {
    try {
      const clinicId = req.params.clinicId;
      const patients = await patientService.getPatientsByClinicId(clinicId);
      res.json(patients);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch clinic patients' });
    }
  },

  async createPatient(req: Request, res: Response) {
    try {
      const input: CreatePatientInput = req.body;
      const patient = await patientService.createPatient(input);
      res.status(201).json(patient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create patient' });
    }
  },

  async updatePatient(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const input: UpdatePatientInput = {
        id,
        ...req.body
      };
      const patient = await patientService.updatePatient(input);
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update patient' });
    }
  },

  async deletePatient(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const success = await patientService.deletePatient(id);
      if (!success) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete patient' });
    }
  }
}; 