import { Request, Response } from 'express';
import { appointmentService, CreateAppointmentInput, UpdateAppointmentInput } from '../services/appointmentService';

export const appointmentController = {
  async getAllAppointments(req: Request, res: Response) {
    try {
      const appointments = await appointmentService.getAllAppointments();
      res.json(appointments);
    } catch (error) {
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
  }
};