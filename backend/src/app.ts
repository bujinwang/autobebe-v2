import express from 'express';
import cors from 'cors';
import config from './config';
import patientRoutes from './routes/patientRoutes';
import clinicRoutes from './routes/clinicRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import medicalAIRoutes from './routes/medicalAIRoutes';

const app = express();

// Add CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Log configuration for debugging (remove in production)
if (config.nodeEnv === 'development') {
  console.log('Configuration loaded:', {
    medicalAI: {
      apiKey: config.medicalAI.apiKey ? 'Set' : 'Not set',
      url: config.medicalAI.url,
      model: config.medicalAI.model
    }
  });
}

// Use the patient routes
app.use('/api/patients', patientRoutes);

// Use the clinic routes
app.use('/api/clinics', clinicRoutes);

// Use the appointment routes
app.use('/api/appointments', appointmentRoutes);

// Use the medical AI routes
app.use('/api/medicalai', medicalAIRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;