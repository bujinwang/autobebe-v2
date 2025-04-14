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
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { registerPatient, savePatientData } from '../services/patientClientService';
import { getClinicInfoById } from '../services/clinicClientService';
import { getAppointmentById } from '../services/appointmentClientService';

// Add this function after the imports and before the component
const isValidDate = (dateString: string): boolean => {
  // Basic validation for MM/DD/YYYY format
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  
  // Check if it's a valid date (not just a valid format)
  const parts = dateString.split('/');
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  // Create date object and check if the date is valid
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

type PatientInfoScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PatientInfo'>;
  route: RouteProp<RootStackParamList, 'PatientInfo'>;
};

const PatientInfoScreen = ({ navigation, route }: PatientInfoScreenProps) => {
  // Log route params when component mounts
  useEffect(() => {
    console.log('PatientInfoScreen - Route params:', route.params);
  }, []);

  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    clinicId: string;
  }>({
    name: route.params?.patientInfo?.name || '',
    phone: route.params?.patientInfo?.phone || '',
    email: route.params?.patientInfo?.email || '',
    dateOfBirth: route.params?.patientInfo?.dateOfBirth || '',
    clinicId: route.params?.clinicId || '4F420955'
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: ''
  });

  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [existingAppointmentId, setExistingAppointmentId] = useState<number | undefined>(undefined);

  // Initialize form data from route params if available
  useEffect(() => {
    const patientInfo = route.params?.patientInfo;
    const clinicId = route.params?.clinicId;

    if (patientInfo) {
      setFormData(prev => ({
        ...prev,
        name: patientInfo.name || '',
        phone: patientInfo.phone || '',
        email: patientInfo.email || '',
        dateOfBirth: patientInfo.dateOfBirth || '',
        clinicId: clinicId || '4F420955'
      }));
    }
  }, [route.params]);

  useEffect(() => {
    const initializeScreen = async () => {
      try {
        console.log('Initializing PatientInfoScreen...');
        const clinicId = route.params?.clinicId || '4F420955';
        console.log(`Using clinic ID: ${clinicId}`);
        
        const clinic = await getClinicInfoById(clinicId);
        console.log('Fetched clinic info:', clinic);
        
        if (route.params) {
          if (route.params.existingAppointmentId) {
            const appointmentId = route.params.existingAppointmentId;
            setExistingAppointmentId(appointmentId);
            
            console.log(`Loading existing appointment: ${appointmentId}`);
            const appointment = await getAppointmentById(appointmentId);
            
            if (appointment) {
              setFormData({
                name: appointment.patientName || '',
                phone: appointment.patientPhone || '',
                email: '',
                dateOfBirth: '',
                clinicId: clinicId
              });
            }
          } 
          else if (route.params.patientInfo) {
            const { patientInfo } = route.params;
            setFormData({
              name: patientInfo.name,
              phone: patientInfo.phone || '',
              email: patientInfo.email || '',
              dateOfBirth: patientInfo.dateOfBirth || '',
              clinicId: clinicId
            });
          } else {
            setFormData(prev => ({ ...prev, clinicId: clinicId }));
          }
        } else {
          setFormData(prev => ({ ...prev, clinicId: clinicId }));
        }
      } catch (error) {
        console.error('Error initializing PatientInfoScreen:', error);
        Alert.alert(
          'Error',
          'Failed to initialize screen. Please try again later.',
          [{ text: 'OK' }]
        );
      }
    };

    initializeScreen();
  }, [route.params]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      dateOfBirth: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Phone validation
    const phoneNumber = formData.phone.trim();
    if (!phoneNumber) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Remove any non-digit characters for validation
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        newErrors.phone = 'Phone number must be between 10 and 15 digits';
      }
    }

    // Email validation
    const email = formData.email.trim();
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Date of Birth validation (optional)
    if (formData.dateOfBirth && !isValidDate(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Please enter a valid date (MM/DD/YYYY)';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const formatPhoneNumber = (text: string) => {
    // Remove any non-digit characters
    const digitsOnly = text.replace(/\D/g, '');
    // Format the phone number as (XXX) XXX-XXXX
    let formatted = digitsOnly;
    if (digitsOnly.length >= 3) {
      formatted = `(${digitsOnly.slice(0, 3)})`;
      if (digitsOnly.length >= 6) {
        formatted += ` ${digitsOnly.slice(3, 6)}`;
        if (digitsOnly.length >= 10) {
          formatted += `-${digitsOnly.slice(6, 10)}`;
        } else {
          formatted += `-${digitsOnly.slice(6)}`;
        }
      } else {
        formatted += ` ${digitsOnly.slice(3)}`;
      }
    }
    return formatted;
  };

  const handlePhoneChange = (text: string) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/\D/g, '');
    
    // Format the phone number for display only
    let formatted = cleaned;
    if (cleaned.length >= 3) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    if (cleaned.length >= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    // For display purposes only, we use the formatted version
    // but when we submit to the API, we'll use only the digits
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleNext = async () => {
    // Validate form
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      dateOfBirth: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.dateOfBirth && !isValidDate(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Please enter a valid date in MM/DD/YYYY format';
    }

    setErrors(newErrors);

    // If there are errors, don't proceed
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setRegistering(true);

    try {
      // Register patient
      const patientData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        clinicId: formData.clinicId
      };

      const patient = await registerPatient(patientData);

      // Navigate to symptoms screen
      navigation.navigate('Symptoms', {
        patientInfo: {
          name: patient.name,
          phone: patient.phone,
          email: formData.email,
          dateOfBirth: formData.dateOfBirth
        },
        clinicId: patient.clinicId || '4F420955'
      });
    } catch (error) {
      console.error('Error registering patient:', error);
      Alert.alert('Error', 'Failed to register patient. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  // Update form data when clinic is selected
  const handleClinicSelect = (clinicId: string) => {
    setFormData(prev => ({
      name: prev.name,
      phone: prev.phone,
      email: prev.email,
      dateOfBirth: prev.dateOfBirth,
      clinicId: clinicId || '4F420955'
    }));
  };

  // Update form data when clinic is selected from route params
  useEffect(() => {
    const clinicId = route.params?.clinicId;
    if (clinicId) {
      setFormData(prev => ({
        name: prev.name,
        phone: prev.phone,
        email: prev.email,
        dateOfBirth: prev.dateOfBirth,
        clinicId: clinicId || '4F420955'
      }));
    }
  }, [route.params?.clinicId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Patient Information</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#27ae60" />
            <Text style={styles.loadingText}>Loading information...</Text>
          </View>
        ) : (
          <>
            {existingAppointmentId && (
              <View style={styles.updateNotice}>
                <Text style={styles.updateNoticeText}>Updating existing appointment information</Text>
              </View>
            )}
            
            {/* Required Fields */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Patient Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.phone ? styles.inputError : null]}
                value={formData.phone}
                onChangeText={handlePhoneChange}
                placeholder="(123) 456-7890"
                keyboardType="phone-pad"
              />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>
            
            {/* Email Input Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="example@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>
            
            {/* Date of Birth Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={[styles.input, errors.dateOfBirth ? styles.inputError : null]}
                value={formData.dateOfBirth}
                onChangeText={(text) => setFormData(prev => ({ ...prev, dateOfBirth: text }))}
                placeholder="MM/DD/YYYY"
                keyboardType="numbers-and-punctuation"
              />
              {errors.dateOfBirth ? <Text style={styles.errorText}>{errors.dateOfBirth}</Text> : null}
            </View>
            
            {/* Next button */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              {loading || registering ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.nextButtonText}>{existingAppointmentId ? 'Update & Continue' : 'Next'}</Text>
              )}
            </TouchableOpacity>
          </>
        )}
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
    marginBottom: 20,
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
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
});

export default PatientInfoScreen;