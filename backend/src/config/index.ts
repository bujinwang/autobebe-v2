// Load environment variables (this should be imported first in your entry file)
import dotenv from 'dotenv';
dotenv.config();

// Define interface for strongly typed config
interface Config {
  port: number;
  nodeEnv: string;
  medicalAI: {
    apiKey: string;
    url: string;
    model: string;
  };
  // Add other configuration categories as needed
}

// Validate that required environment variables are set
const requiredEnvVars = ['MEDICAL_AI_API_KEY', 'MEDICAL_AI_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Create and export the config object
const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  medicalAI: {
    apiKey: process.env.MEDICAL_AI_API_KEY!,
    url: process.env.MEDICAL_AI_URL!,
    model: process.env.MEDICAL_AI_MODEL || 'default-model',
  },
  // Add other configuration sections as needed
};

export default config;