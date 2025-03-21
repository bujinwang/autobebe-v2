import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult, ValidationError } from 'express-validator';

// Validation middleware for patient registration
export const validatePatientRegistration = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[\d\s-()]+$/).withMessage('Invalid phone number format')
    .isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters'),
  
  body('clinicId')
    .optional()
    .trim()
    .notEmpty().withMessage('Clinic ID cannot be empty if provided'),
  
  // Validation error handler
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err: ValidationError) => ({
          field: err.type === 'field' ? err.path : err.type,
          message: err.msg
        }))
      });
    }
    next();
  }
];

// Validation for patient appointment creation
export const validatePatientAppointment = [
  // Patient Info Validation
  body('patientInfo.name')
    .trim()
    .notEmpty().withMessage('Patient name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('patientInfo.phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[\d\s-]{10,}$/).withMessage('Please enter a valid phone number'),
  
  body('patientInfo.email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email address'),

  // Appointment Info Validation
  body('appointmentInfo.clinicId')
    .trim()
    .notEmpty().withMessage('Clinic ID is required'),
  
  body('appointmentInfo.purposeOfVisit')
    .trim()
    .notEmpty().withMessage('Purpose of visit is required')
    .isLength({ min: 5, max: 500 }).withMessage('Purpose must be between 5 and 500 characters'),
  
  body('appointmentInfo.symptoms')
    .trim()
    .notEmpty().withMessage('Symptoms description is required')
    .isLength({ min: 5, max: 1000 }).withMessage('Symptoms must be between 5 and 1000 characters'),
  
  body('appointmentInfo.followUpQuestions')
    .optional()
    .isArray().withMessage('Follow-up questions must be an array'),
  
  body('appointmentInfo.followUpAnswers')
    .optional()
    .isArray().withMessage('Follow-up answers must be an array'),

  // Validation middleware
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err: ValidationError) => ({
          field: err.type === 'field' ? err.path : err.type,
          message: err.msg
        }))
      });
    }
    next();
  }
]; 