import { Request, Response } from 'express';
import { clinicService } from '../services/clinicService';

export const clinicController = {
  // Public methods
  getClinicInfo: async (req: Request, res: Response) => {
    try {
      const clinicId = req.query.id as string;
      
      if (!clinicId) {
        return res.status(400).json({
          success: false,
          error: 'Clinic ID is required'
        });
      }
      
      console.log('Fetching public clinic info for ID:', clinicId);
      const clinic = await clinicService.getClinicById(clinicId);
      
      if (!clinic) {
        return res.status(404).json({
          success: false,
          error: 'Clinic not found'
        });
      }
      
      // Return only public information
      res.json({
        success: true,
        data: {
          id: clinic.id,
          name: clinic.name,
          company: clinic.company,
          address: clinic.address,
          phone: clinic.phone,
          hours: clinic.hours,
          welcomeMessage: clinic.welcomeMessage
        }
      });
    } catch (error) {
      console.error('Error in getClinicInfo:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch clinic info'
      });
    }
  },

  listClinics: async (req: Request, res: Response) => {
    try {
      console.log('Fetching public clinic list');
      const clinics = await clinicService.getAllClinics();
      
      if (!clinics || clinics.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No clinics found'
        });
      }
      
      // Return only public information for each clinic
      const publicClinicList = clinics.map(clinic => ({
        id: clinic.id,
        name: clinic.name,
        company: clinic.company,
        address: clinic.address,
        phone: clinic.phone,
        hours: clinic.hours,
        welcomeMessage: clinic.welcomeMessage
      }));
      
      res.json({
        success: true,
        data: publicClinicList
      });
    } catch (error) {
      console.error('Error in listClinics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch clinic list'
      });
    }
  },

  // Protected methods (existing)
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

  getClinicById: async (req: Request, res: Response) => {
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
      const clinics = await clinicService.getAllClinics();
      const selectionData = clinics.map(clinic => ({
        id: clinic.id,
        name: clinic.name
      }));
      res.json(selectionData);
    } catch (error) {
      console.error('Error in getClinicsForSelection:', error);
      res.status(500).json({ error: 'Failed to fetch clinics for selection' });
    }
  }
};