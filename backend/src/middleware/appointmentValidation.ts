import { body } from 'express-validator';

export const createAppointmentValidation = [
  body('patientId').isInt().withMessage('Patient ID must be an integer'),
  body('clinicId').isString().withMessage('Clinic ID is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('status').isString().withMessage('Status is required'),
  body('followUpAnswers').isString().withMessage('Follow-up answers are required'),
  body('followUpQuestions').isString().withMessage('Follow-up questions are required'),
  body('possibleTreatments').isString().withMessage('Possible treatments are required'),
  body('suggestedPrescriptions').isString().withMessage('Suggested prescriptions are required'),
  // Optional fields
  body('purposeOfVisit').optional().isString(),
  body('symptoms').optional().isString(),
];