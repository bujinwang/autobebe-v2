import { Request, Response } from 'express';
import { appointmentService, CreateAppointmentInput, UpdateAppointmentInput } from '../services/appointmentService';
import { patientService } from '../services/patientService';
import { AuthRequest } from '../middleware/auth';

export const appointmentController = {
  async getAllAppointments(req: Request, res: Response) {
    try {
      const { clinicId } = req.query;
      
      // For super admins with clinicId=all, fetch all appointments
      if (req.body.user?.role === 'SUPER_ADMIN' && (!clinicId || clinicId === 'all')) {
        const appointments = await appointmentService.getAllAppointments();
        return res.json(appointments);
      }
      
      // For other cases, fetch appointments for the specified clinic
      if (!clinicId) {
        return res.status(400).json({ error: 'Clinic ID is required' });
      }

      const appointments = await appointmentService.getAppointmentsByClinic(clinicId as string);
      res.json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  },

  async getAppointmentById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const appointment = await appointmentService.getAppointmentById(id);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch appointment' });
    }
  },

  async getAppointmentsByPatientId(req: Request, res: Response) {
    try {
      const patientId = parseInt(req.params.patientId);
      const appointments = await appointmentService.getAppointmentsByPatientId(patientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch patient appointments' });
    }
  },

  async getAppointmentsByDate(req: Request, res: Response) {
    try {
      const date = new Date(req.params.date);
      const appointments = await appointmentService.getAppointmentsByDate(date);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch appointments by date' });
    }
  },

  async createAppointment(req: Request, res: Response) {
    try {
      // Ensure required fields have default values
      const input: CreateAppointmentInput = {
        ...req.body,
        appointmentDate: new Date(req.body.appointmentDate),
        status: req.body.status || 'Scheduled',
        followUpAnswers: req.body.followUpAnswers || '',
        followUpQuestions: req.body.followUpQuestions || '',
        possibleTreatments: req.body.possibleTreatments || '',
        suggestedPrescriptions: req.body.suggestedPrescriptions || ''
      };
      
      console.log('Creating appointment with input:', input);
      const appointment = await appointmentService.createAppointment(input);
      res.status(201).json(appointment);
    } catch (error) {
      console.error('Detailed error creating appointment:', error);
      const err = error as Error;
      res.status(500).json({ error: 'Failed to create appointment', details: err.message });
    }
  },

  async updateAppointment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const input: UpdateAppointmentInput = {
        id,
        ...req.body,
        appointmentDate: req.body.appointmentDate ? new Date(req.body.appointmentDate) : undefined
      };
      const appointment = await appointmentService.updateAppointment(input);
      res.json(appointment);
    } catch (error) {
      console.error('Error updating appointment:', error);
      const err = error as Error;
      res.status(500).json({ error: 'Failed to update appointment', details: err.message });
    }
  },

  async deleteAppointment(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const success = await appointmentService.deleteAppointment(id);
      if (!success) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete appointment' });
    }
  },

  async takeInAppointment(req: AuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      // Ensure user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      // Get the current user ID from the auth token
      const doctorId = req.user.userId;
      
      // Update the appointment with in-progress status and assign the doctor
      const input: UpdateAppointmentInput = {
        id,
        status: 'in-progress',
        doctorId
      };
      
      const appointment = await appointmentService.updateAppointment(input);
      res.json(appointment);
    } catch (error) {
      console.error('Error taking in appointment:', error);
      const err = error as Error;
      res.status(500).json({ error: 'Failed to take in appointment', details: err.message });
    }
  },

  // Create appointment for unauthenticated patients
  async createPatientAppointment(req: Request, res: Response) {
    try {
      const { patientInfo, appointmentInfo } = req.body;

      // Validate that followUpQuestions and followUpAnswers are arrays
      if (!Array.isArray(appointmentInfo.followUpQuestions) || !Array.isArray(appointmentInfo.followUpAnswers)) {
        return res.status(400).json({
          success: false,
          errors: [
            { message: "Follow-up questions must be an array" },
            { message: "Follow-up answers must be an array" }
          ]
        });
      }

      // First, create or find the patient
      const patient = await patientService.findOrCreatePatient({
        name: patientInfo.name,
        phone: patientInfo.phone,
        email: patientInfo.email,
        clinicId: appointmentInfo.clinicId
      });

      // Create the appointment
      const appointment = await appointmentService.createAppointment({
        patientId: patient.id,
        clinicId: appointmentInfo.clinicId,
        status: 'Scheduled',
        appointmentDate: new Date(),
        purposeOfVisit: appointmentInfo.purposeOfVisit,
        symptoms: appointmentInfo.symptoms,
        followUpQuestions: appointmentInfo.followUpQuestions.join('\n'),
        followUpAnswers: appointmentInfo.followUpAnswers.join('\n'),
        possibleTreatments: '',
        suggestedPrescriptions: ''
      });

      res.status(201).json({
        success: true,
        data: {
          ...appointment,
          patientName: patient.name,
          patientPhone: patient.phone
        }
      });
    } catch (error) {
      console.error('Error creating patient appointment:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create appointment'
      });
    }
  }
};