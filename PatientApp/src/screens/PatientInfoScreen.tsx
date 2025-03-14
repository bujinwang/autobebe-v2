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
import { savePatientData, getPatientByHealthcareNumber } from '../services/patientService';
import { getClinicInfoById } from '../services/clinicService';
import { getAppointmentById } from '../services/appointmentService';

// We'll need to create this component
import CardScanner from '../components/CardScanner';

type PatientInfoScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PatientInfo'>;
  route: RouteProp<RootStackParamList, 'PatientInfo'>;
};

const PatientInfoScreen = ({ navigation, route }: PatientInfoScreenProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    clinicId: route.params?.clinicId || ''
  });

  const [errors, setErrors] = useState({
    name: ''
  });

  const [showScanner, setShowScanner] = useState(false);
  const [scanType, setScanType] = useState<'healthcard' | 'driverlicense'>('healthcard');
  const [showScanOptions, setShowScanOptions] = useState(false);

  const [loading, setLoading] = useState(true);
  const [existingAppointmentId, setExistingAppointmentId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const initializeScreen = async () => {
      try {
        console.log('Initializing PatientInfoScreen...');
        // Get clinic ID from route params instead of hardcoding
        const clinicId = route.params?.clinicId;
        console.log(`Fetching clinic info for ID: ${clinicId}`);
        
        if (!clinicId) {
          throw new Error('No clinic ID provided');
        }
        
        const clinic = await getClinicInfoById(clinicId);
        
        // Check if we have route params with existing appointment or patient info
        if (route.params) {
          // If we have an existing appointment ID, fetch that appointment
          if (route.params.existingAppointmentId) {
            const appointmentId = route.params.existingAppointmentId;
            setExistingAppointmentId(appointmentId);
            
            console.log(`Loading existing appointment: ${appointmentId}`);
            const appointment = await getAppointmentById(appointmentId);
            
            // Get patient info from the appointment
            if (appointment && appointment.patientId) {
              const patient = await getPatientByHealthcareNumber(appointment.patientId.toString());
              if (patient) {
                setFormData({
                  name: patient.name,
                  healthcareNumber: patient.healthcareNumber,
                  phone: patient.phone || '',
                  clinicId: clinic.id
                });
              }
            }
          } 
          // If we have patient info directly in the route params
          else if (route.params.patientInfo) {
            const { patientInfo } = route.params;
            setFormData({
              name: patientInfo.name,
              healthcareNumber: patientInfo.healthcareNumber,
              phone: patientInfo.phone || '',
              clinicId: clinic.id
            });
          } else {
            // Just set the clinic ID if no patient info
            setFormData(prev => ({ ...prev, clinicId: clinic.id }));
          }
        } else {
          // No route params, just set the clinic ID
          setFormData(prev => ({ ...prev, clinicId: clinic.id }));
        }
      } catch (error) {
        console.error('Error initializing PatientInfoScreen:', error);
        Alert.alert(
          'Error',
          'Failed to initialize screen. Please try again later.',
          [{ text: 'OK' }]
        );
      } finally {
        setLoading(false);
      }
    };

    initializeScreen();
  }, [route.params]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSavePatientData = async () => {
    try {
      const patientData = {
        name: formData.name,
        phone: formData.phone,
        clinicId: formData.clinicId
      };
      
      return await savePatientData(patientData);
    } catch (error) {
      console.error('Error in handleSavePatientData:', error);
      throw error;
    }
  };

  const handleNext = async () => {
    if (validateForm()) {
      try {
        await handleSavePatientData();
        // Navigate to the Symptoms screen with patient information
        navigation.navigate('Symptoms', {
          patientInfo: {
            name: formData.name,
            healthcareNumber: formData.healthcareNumber,
            phone: formData.phone,
            email: '', // Adding empty email since it's required by the type
            // Pass the existing appointment ID if we have one
            ...(existingAppointmentId && { existingAppointmentId })
          }
        });
      } catch (error: any) {
        Alert.alert(
          'Error',
          error.message || 'Failed to save patient information. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleScanCard = (type: 'healthcard' | 'driverlicense') => {
    setScanType(type);
    setShowScanner(true);
    setShowScanOptions(false);
  };

  const handleScanComplete = (data: { name?: string; healthcareNumber?: string }) => {
    setShowScanner(false);
    
    // Update form with scanned data
    const updatedFormData = { ...formData };
    
    if (data.name) {
      updatedFormData.name = data.name;
    }
    
    if (data.healthcareNumber) {
      updatedFormData.healthcareNumber = data.healthcareNumber;
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
            
            {/* Main Scan Button */}
            <TouchableOpacity 
              style={styles.mainScanButton} 
              onPress={toggleScanOptions}
            >
              <Text style={styles.mainScanButtonText}>📷 Scan Your ID Document</Text>
            </TouchableOpacity>
            
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

            {/* Optional Fields */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>{existingAppointmentId ? 'Update & Continue' : 'Next'}</Text>
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