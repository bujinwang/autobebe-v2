import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import config from './config';
import patientRoutes from './routes/patientRoutes';
import publicPatientRoutes from './routes/publicPatientRoutes';
import clinicRoutes from './routes/clinicRoutes';
import publicClinicRoutes from './routes/publicClinicRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import medicalAIRoutes from './routes/medicalAIRoutes';
import authRoutes from './routes/authRoutes';
import staffRoutes from './routes/staffRoutes';
import userRoutes from './routes/userRoutes';
import supportRoutes from './routes/supportRoutes';
import { errorHandler } from './middleware/errorHandler';
import publicAppointmentRoutes from './routes/publicAppointmentRoutes';
import { authenticate } from './middleware/auth';

const app = express();

// Add CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Public routes (no authentication required)
app.use('/api/public/patients', publicPatientRoutes);
app.use('/api/public/clinics', publicClinicRoutes);
app.use('/api/public/appointments', publicAppointmentRoutes);
app.use('/api/support', supportRoutes);

// Protected routes (require authentication)
app.use('/api/auth', authRoutes);
app.use('/api/clinics', clinicRoutes);

// Use the appointment routes
app.use('/api/appointments', authenticate, appointmentRoutes);

// Use the medical AI routes
app.use('/api/medicalai', medicalAIRoutes);

// Use the staff routes
app.use('/api/staff', authenticate, staffRoutes);

// Use the patient routes
app.use('/api/admin/patients', authenticate, patientRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;