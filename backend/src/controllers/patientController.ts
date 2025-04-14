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
      const { name, phone, email, clinicId } = req.body;

      if (!clinicId) {
        return res.status(400).json({
          success: false,
          error: 'Clinic ID is required'
        });
      }

      // Clean the phone number to keep only digits
      const cleanedPhone = phone ? phone.replace(/\D/g, '') : '';

      // First check if a patient with exactly the same name AND phone number already exists
      const exactMatch = await prisma.patient.findFirst({
        where: {
          AND: [
            { name: { equals: name, mode: 'insensitive' } },
            { phone: { contains: cleanedPhone } },
            { clinicId: clinicId }
          ]
        }
      });

      // If exact match found (same name AND phone), return that patient
      if (exactMatch) {
        logger.info('Exact match patient found during registration', {
          patientId: exactMatch.id,
          clinicId: exactMatch.clinicId
        });

        return res.status(200).json({
          success: true,
          data: exactMatch,
          message: 'Found existing patient with same name and phone number'
        });
      }

      // Create new patient with proper clinic relation and cleaned phone number
      const patient = await prisma.patient.create({
        data: {
          name,
          phone: cleanedPhone, // Always use digits-only format in the database
          email, // Add email if provided
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
  },

  // Check if patient exists by phone number and name
  async checkPatientByPhone(req: Request, res: Response) {
    try {
      const { phone, name } = req.query;

      if (!phone || typeof phone !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Phone number is required'
        });
      }

      // Clean the phone number to keep only digits
      const cleanedPhone = phone.replace(/\D/g, '');

      if (cleanedPhone.length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Phone number must have at least 10 digits'
        });
      }

      let whereCondition: any = {
        phone: {
          contains: cleanedPhone
        }
      };

      // If name is provided, include it in the search
      if (name && typeof name === 'string') {
        whereCondition = {
          AND: [
            whereCondition,
            { name: { equals: name, mode: 'insensitive' } }
          ]
        };
      }

      // Search for patient with the specified criteria
      const patient = await prisma.patient.findFirst({
        where: whereCondition,
        include: {
          clinic: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      logger.info('Patient lookup', {
        phone: cleanedPhone,
        name: name || 'not provided',
        found: !!patient
      });

      return res.status(200).json({
        success: true,
        data: patient // Will be null if no patient is found
      });
    } catch (error) {
      logger.error('Error checking patient', { error });
      return res.status(500).json({
        success: false,
        error: 'Failed to check patient'
      });
    }
  },

  // Utility endpoint to clean phone numbers in the database
  async cleanPhoneNumbers(req: Request, res: Response) {
    try {
      // Get all patients
      const patients = await prisma.patient.findMany();
      const updatedPatients = [];
      const errors = [];

      // Process each patient
      for (const patient of patients) {
        try {
          if (patient.phone) {
            // Clean phone number to only contain digits
            const cleanedPhone = patient.phone.replace(/\D/g, '');
            
            // Only update if the phone number actually changed
            if (cleanedPhone !== patient.phone) {
              const updatedPatient = await prisma.patient.update({
                where: { id: patient.id },
                data: { phone: cleanedPhone }
              });
              updatedPatients.push(updatedPatient);
            }
          }
        } catch (err) {
          errors.push({ patientId: patient.id, error: err });
        }
      }

      logger.info('Phone number cleanup completed', {
        processed: patients.length,
        updated: updatedPatients.length,
        errors: errors.length
      });

      return res.status(200).json({
        success: true,
        message: 'Phone number cleanup completed',
        stats: {
          total: patients.length,
          updated: updatedPatients.length,
          errors: errors.length
        }
      });
    } catch (error) {
      logger.error('Error cleaning phone numbers', { error });
      return res.status(500).json({
        success: false,
        error: 'Failed to clean phone numbers'
      });
    }
  }
}; 