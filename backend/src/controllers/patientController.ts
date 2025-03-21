import { Request, Response } from 'express';
import { patientService, CreatePatientInput, UpdatePatientInput } from '../services/patientService';
import { prisma } from '../db';
import { logger } from '../utils/logger';

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
  },

  // Public registration endpoint
  async registerPatient(req: Request, res: Response) {
    try {
      const { name, phone, clinicId } = req.body;

      if (!clinicId) {
        return res.status(400).json({
          success: false,
          error: 'Clinic ID is required'
        });
      }

      // Create new patient with proper clinic relation
      const patient = await prisma.patient.create({
        data: {
          name,
          phone,
          clinic: {
            connect: { id: clinicId }
          }
        },
        include: {
          clinic: true
        }
      });

      // Log the registration
      logger.info('New patient registered', {
        patientId: patient.id,
        clinicId: patient.clinicId
      });

      return res.status(201).json({
        success: true,
        data: patient
      });
    } catch (error) {
      logger.error('Error registering patient', { error });
      return res.status(500).json({
        success: false,
        error: 'Failed to register patient'
      });
    }
  }
}; 