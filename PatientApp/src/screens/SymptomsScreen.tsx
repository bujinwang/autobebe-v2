import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { createAppointment, updateAppointment, getAppointmentById } from '../services/appointmentService';
import { createPatient, getPatientByHealthcareNumber } from '../services/patientService';
import { getTopQuestions } from '../services/medicalAIService';

type SymptomsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Symptoms'>;
  route: {
    params: {
      patientInfo: {
        name: string;
        healthcareNumber: string;
        phone: string;
        email: string;
        existingAppointmentId?: number;
      },
      clinicId: string; // Add clinicId to route params
    }
  };
};

const SymptomsScreen = ({ navigation, route }: SymptomsScreenProps) => {
  const { patientInfo, existingAppointmentId, clinicId } = route.params || {};
  
  // Log only once when component mounts, not on every render
  useEffect(() => {
    console.log('SymptomsScreen - patientInfo:', patientInfo);
    console.log('SymptomsScreen - existingAppointmentId:', existingAppointmentId);
    console.log('SymptomsScreen - clinicId:', clinicId);
  }, []);  // Empty dependency array ensures this runs only once
  
  const [formData, setFormData] = useState({
    purpose: '',
    symptoms: ''
  });

  const [errors, setErrors] = useState({
    purpose: '',
    symptoms: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [dynamicQuestions, setDynamicQuestions] = useState<Array<{id: string, question: string, answer: string}>>([]);

  // Load existing appointment data if editing
  useEffect(() => {
    const loadExistingAppointment = async () => {
      if (existingAppointmentId) {
        setIsLoading(true);
        try {
          const appointment = await getAppointmentById(existingAppointmentId);
          
          // Update form data with existing values
          setFormData({
            purpose: appointment.purposeOfVisit || '',
            symptoms: appointment.symptoms || ''
          });
          
          // Load existing follow-up questions and answers if available
          if (appointment.followUpQuestions && appointment.followUpAnswers) {
            try {
              const questions = JSON.parse(appointment.followUpQuestions);
              const answers = JSON.parse(appointment.followUpAnswers);
              
              if (Array.isArray(questions) && Array.isArray(answers) && questions.length === answers.length) {
                const loadedQuestions = questions.map((question, index) => ({
                  id: `existing-${index + 1}`,
                  question,
                  answer: answers[index] || ''
                }));
                
                setDynamicQuestions(loadedQuestions);
              }
            } catch (parseError) {
              console.error('Error parsing questions/answers:', parseError);
            }
          }
        } catch (error) {
          console.error('Error loading existing appointment:', error);
          Alert.alert('Error', 'Failed to load appointment data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadExistingAppointment();
  }, [existingAppointmentId]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      purpose: '',
      symptoms: ''
    };

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose of visit is required';
      isValid = false;
    }

    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Symptoms description is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const fetchDynamicQuestions = async () => {
    // Call the MedicalAI service to get top questions
    setIsLoading(true);
    
    try {
      // Call the MedicalAI topquestions endpoint
      const response = await getTopQuestions({
        purposeOfVisit: formData.purpose,
        symptoms: formData.symptoms
      });
      
      if (response.success && response.topQuestions.length > 0) {
        // Transform the response into the format expected by the UI
        const aiQuestions = response.topQuestions.map((question, index) => ({
          id: `ai-${index + 1}`,
          question: question,
          answer: ''
        }));
        
        setDynamicQuestions(aiQuestions);
      } else {
        // If the API call fails or returns no questions, use default questions
        const defaultQuestions = [
          {
            id: 'default-1',
            question: 'How long have you been experiencing these symptoms?',
            answer: ''
          },
          {
            id: 'default-2',
            question: 'Have you taken any medication for these symptoms?',
            answer: ''
          },
          {
            id: 'default-3',
            question: 'Are your symptoms getting better, worse, or staying the same?',
            answer: ''
          }
        ];
        
        setDynamicQuestions(defaultQuestions);
        
        // Show error message if API call failed
        if (!response.success) {
          console.error('Error from MedicalAI service:', response.errorMessage);
          Alert.alert('Note', 'Using default questions due to service unavailability.');
        }
      }
    } catch (error) {
      console.error('Error fetching AI questions:', error);
      Alert.alert('Error', 'Failed to fetch follow-up questions. Using default questions instead.');
      
      // Set default questions on error
      setDynamicQuestions([
        {
          id: 'default-1',
          question: 'How long have you been experiencing these symptoms?',
          answer: ''
        },
        {
          id: 'default-2',
          question: 'Have you taken any medication for these symptoms?',
          answer: ''
        },
        {
          id: 'default-3',
          question: 'Are your symptoms getting better, worse, or staying the same?',
          answer: ''
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (id: string, answer: string) => {
    setDynamicQuestions(questions => 
      questions.map(q => q.id === id ? { ...q, answer } : q)
    );
  };

  const saveAppointment = async () => {
    setIsLoading(true);
    try {
      // First, check if patient exists or create a new one
      let patientId: number;
      const existingPatient = await getPatientByHealthcareNumber(patientInfo.healthcareNumber);
      
      if (existingPatient) {
        patientId = existingPatient.id!;
        console.log(`Using existing patient with ID: ${patientId}`);
      } else {
        // Create new patient
        console.log('Creating new patient');
        const newPatient = await createPatient({
          name: patientInfo.name,
          healthcareNumber: patientInfo.healthcareNumber,
          phone: patientInfo.phone,
          clinicId: clinicId || '4F420955' // Use dynamic clinicId with fallback
        });
        patientId = newPatient.id!;
        console.log(`Created new patient with ID: ${patientId}`);
      }
      
      // Prepare questions and answers for saving
      const questions = dynamicQuestions.map(q => q.question);
      const answers = dynamicQuestions.map(q => q.answer);
      
      // Prepare appointment data
      const appointmentData = {
        patientId,
        clinicId: clinicId || '4F420955', // Use dynamic clinicId with fallback
        appointmentDate: new Date().toISOString(),
        status: 'Scheduled',
        purposeOfVisit: formData.purpose,
        symptoms: formData.symptoms,
        followUpQuestions: JSON.stringify(questions),
        followUpAnswers: JSON.stringify(answers),
        possibleTreatments: JSON.stringify([]),
        suggestedPrescriptions: JSON.stringify([])
      };
      
      // Check if we're updating an existing appointment or creating a new one
      if (existingAppointmentId) {
        console.log(`Updating existing appointment with ID: ${existingAppointmentId}`);
        await updateAppointment(existingAppointmentId, appointmentData);
        console.log('Appointment updated successfully');
      } else {
        console.log('Creating new appointment');
        await createAppointment(appointmentData);
        console.log('New appointment created successfully');
      }
      
      // Prepare appointment data for the Scheduled screen
      const scheduledScreenData = {
        purpose: formData.purpose,
        symptoms: formData.symptoms,
        questions: dynamicQuestions.map(q => q.question),
        answers: dynamicQuestions.map(q => q.answer)
      };
      
      // Navigate to the Scheduled screen with appointment data
      navigation.navigate('Scheduled', { appointmentData: scheduledScreenData });
    } catch (error) {
      console.error('Error saving appointment:', error);
      Alert.alert('Error', 'Failed to save appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (dynamicQuestions.length === 0) {
        // If no dynamic questions yet, fetch them
        fetchDynamicQuestions();
      } else {
        // Check if all dynamic questions are answered
        const unansweredQuestions = dynamicQuestions.filter(q => !q.answer.trim());
        
        if (unansweredQuestions.length > 0) {
          Alert.alert('Please Answer', 'Please answer all follow-up questions before submitting.');
        } else {
          // Save appointment and navigate to scheduled screen
          saveAppointment();
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Symptoms Information</Text>
        
        {existingAppointmentId && (
          <View style={styles.updateNotice}>
            <Text style={styles.updateNoticeText}>Updating existing appointment</Text>
          </View>
        )}
        
        {/* Purpose of Visit */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Purpose of Visit <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.purpose ? styles.inputError : null]}
            value={formData.purpose}
            onChangeText={(text) => setFormData({ ...formData, purpose: text })}
            placeholder="Why are you visiting today?"
          />
          {errors.purpose ? <Text style={styles.errorText}>{errors.purpose}</Text> : null}
        </View>

        {/* Symptoms Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Symptoms <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.textArea, errors.symptoms ? styles.inputError : null]}
            value={formData.symptoms}
            onChangeText={(text) => setFormData({ ...formData, symptoms: text })}
            placeholder="Please describe your symptoms in detail"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.symptoms ? <Text style={styles.errorText}>{errors.symptoms}</Text> : null}
        </View>

        {/* Dynamic Questions Section */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading follow-up questions...</Text>
          </View>
        ) : dynamicQuestions.length > 0 ? (
          <View style={styles.questionsContainer}>
            <Text style={styles.sectionTitle}>Follow-up Questions</Text>
            {dynamicQuestions.map((item) => (
              <View key={item.id} style={styles.questionItem}>
                <Text style={styles.questionText}>{item.question}</Text>
                <TextInput
                  style={styles.input}
                  value={item.answer}
                  onChangeText={(text) => handleAnswerChange(item.id, text)}
                  placeholder="Your answer"
                />
              </View>
            ))}
          </View>
        ) : null}

        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {dynamicQuestions.length === 0 ? 'Continue' : (existingAppointmentId ? 'Update' : 'Submit')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
  },
  updateNotice: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  updateNoticeText: {
    color: '#1976d2',
    textAlign: 'center',
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
  },
  nextButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#34495e',
  },
  questionsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  questionItem: {
    marginBottom: 15,
    backgroundColor: '#f5f6fa',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  questionText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '500',
  },
});

export default SymptomsScreen;