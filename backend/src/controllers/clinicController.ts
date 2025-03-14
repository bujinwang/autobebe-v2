import { Request, Response } from 'express';
import { clinicService } from '../services/clinicService';

export const clinicController = {
  getAllClinics: async (req: Request, res: Response) => {
    try {
      console.log('Fetching all clinics');
      const clinics = await clinicService.getAllClinics();
      
      if (!clinics || clinics.length === 0) {
        return res.status(404).json({ error: 'No clinics found' });
      }
      
      console.log(`Found ${clinics.length} clinics`);
      res.json(clinics);
    } catch (error) {
      console.error('Error in getAllClinics:', error);
      res.status(500).json({ error: 'Failed to fetch clinics' });
    }
  },
  // Add timeout handling to prevent hanging requests
  async getClinicById(req: Request, res: Response) {
    try {
      console.log('getClinicById called with query:', req.query);
      const clinicId = req.query.id as string;
      
      if (!clinicId) {
        return res.status(400).json({ error: 'Clinic ID is required' });
      }
      
      console.log('Fetching clinic with ID:', clinicId);
      
      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );
      
      const clinicPromise = clinicService.getClinicById(clinicId);
      
      const clinic = await Promise.race([clinicPromise, timeoutPromise]);
      
      if (!clinic) {
        return res.status(404).json({ error: 'Clinic not found' });
      }
      
      console.log('Clinic found:', clinic);
      res.json(clinic);
    } catch (error) {
      console.error('Error in getClinicById:', error);
      res.status(500).json({ error: 'Failed to fetch clinic info' });
    }
  },
  getClinicsForSelection: async (req: Request, res: Response) => {
    try {
      console.log('Fetching clinics for selection');
      const clinics = await clinicService.getClinicsForSelection();
      
      if (!clinics || clinics.length === 0) {
        return res.status(404).json({ error: 'No clinics found for selection' });
      }
      
      console.log(`Found ${clinics.length} clinics for selection`);
      res.json(clinics);
    } catch (error) {
      console.error('Error in getClinicsForSelection:', error);
      res.status(500).json({ error: 'Failed to fetch clinics for selection' });
    }
  },
};