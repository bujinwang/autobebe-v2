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
  Modal,
  ActivityIndicator
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { registerPatient, savePatientData } from '../services/patientClientService';
import { getClinicInfoById } from '../services/clinicClientService';
import { getAppointmentById } from '../services/appointmentClientService';
import CardScanner from '../components/CardScanner';

type PatientInfoScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PatientInfo'>;
  route: RouteProp<RootStackParamList, 'PatientInfo'>;
};

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

const PatientInfoScreen = ({ navigation, route }: PatientInfoScreenProps) => {
  // Log route params when component mounts
  useEffect(() => {
    console.log('PatientInfoScreen - Route params:', route.params);
  }, []);

  // Add dateOfBirth to your state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    clinicId: route.params?.clinicId || '4F420955'
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: ''
  });

  const [showScanner, setShowScanner] = useState(false);
  const [scanType, setScanType] = useState<'healthcard' | 'driverlicense'>('healthcard');
  const [showScanOptions, setShowScanOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [existingAppointmentId, setExistingAppointmentId] = useState<number | undefined>(undefined);

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
                clinicId: clinicId
              });
            }
          } 
          else if (route.params.patientInfo) {
            const { patientInfo } = route.params;
            setFormData({
              name: patientInfo.name,
              phone: patientInfo.phone || '',
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
    const formatted = formatPhoneNumber(text);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  // Make sure the handleSavePatientData function properly includes dateOfBirth
  const handleSavePatientData = async () => {
    try {
      setRegistering(true);
      console.log('Attempting to save patient data:', formData);
  
      if (!validateForm()) {
        console.log('Form validation failed');
        Alert.alert('Validation Error', 'Please correct the errors in the form.');
        return false;
      }
  
      if (!formData.clinicId) {
        console.log('Missing clinic ID');
        Alert.alert('Error', 'Clinic ID is required');
        return false;
      }
  
      // Attempt to save patient data
      console.log('Calling savePatientData with:', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        dateOfBirth: formData.dateOfBirth || '',
        clinicId: formData.clinicId
      });
      
      const savedPatient = await savePatientData({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        dateOfBirth: formData.dateOfBirth || '',
        clinicId: formData.clinicId
      });
      console.log('Patient registered successfully:', savedPatient);
      return true;
    } catch (error) {
      console.error('Error saving patient data:', error);
      let message = 'Failed to register patient. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Validation failed:')) {
          message = error.message;
        } else if (error.message.includes('Too many registration attempts')) {
          message = 'Too many registration attempts. Please try again later.';
        } else if (error.message.includes('Unable to connect')) {
          message = 'Unable to connect to the server. Please check your internet connection.';
        }
      }
      
      Alert.alert('Registration Error', message);
      return false;
    } finally {
      setRegistering(false);
    }
  };
  
  // Make sure the handleNext function properly passes dateOfBirth
  const handleNext = async () => {
    setLoading(true);
    try {
      const success = await handleSavePatientData();
      if (success) {
        // Navigate to symptoms screen with the form data
        navigation.navigate('Symptoms', {
          patientInfo: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || '',
            dateOfBirth: formData.dateOfBirth || '',
            healthcareNumber: '', // Add empty healthcare number since it's required by the type
          },
          clinicId: formData.clinicId
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScanCard = (type: 'healthcard' | 'driverlicense') => {
    setScanType(type);
    setShowScanner(true);
    setShowScanOptions(false);
  };

  const handleScanComplete = (data: { name?: string }) => {
    setShowScanner(false);
    
    // Update form with scanned data
    const updatedFormData = { ...formData };
    
    if (data.name) {
      updatedFormData.name = data.name;
    }
    
    setFormData(updatedFormData);
    
    // Show success message
    Alert.alert(
      'Scan Complete',
      'Your information has been extracted from the card.',
      [{ text: 'OK' }]
    );
  };

  const toggleScanOptions = () => {
    setShowScanOptions(!showScanOptions);
  };

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
            
                 {/* Scan Options */}
            {showScanOptions && (
              <View style={styles.scanOptionsContainer}>
                <TouchableOpacity 
                  style={styles.scanOptionButton} 
                  onPress={() => handleScanCard('healthcard')}
                >
                  <Text style={styles.scanOptionText}>Health Card</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.scanOptionButton} 
                  onPress={() => handleScanCard('driverlicense')}
                >
                  <Text style={styles.scanOptionText}>Driver's License</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Required Fields */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Patient Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
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
                onChangeText={(text) => setFormData({ ...formData, email: text })}
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
                onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
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

      {/* Camera Scanner Modal */}
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <CardScanner
          scanType={scanType}
          onScanComplete={handleScanComplete}
          onClose={() => setShowScanner(false)}
        />
      </Modal>
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
  mainScanButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainScanButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f1f8e9',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  scanOptionButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    flex: 0.48,
    alignItems: 'center',
  },
  scanOptionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#34495e',
  },
});

export default PatientInfoScreen;