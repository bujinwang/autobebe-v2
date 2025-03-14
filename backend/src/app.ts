import express from 'express';
import cors from 'cors';
import patientRoutes from './routes/patientRoutes';
import clinicRoutes from './routes/clinicRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import medicalAIRoutes from './routes/medicalAIRoutes';

const app = express();

// Add CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use the patient routes
app.use('/api/patients', patientRoutes);

// Use the clinic routes
app.use('/api/clinics', clinicRoutes);

// Use the appointment routes
app.use('/api/appointments', appointmentRoutes);

// Use the medical AI routes
app.use('/api/medical-ai', medicalAIRoutes);

export default app;