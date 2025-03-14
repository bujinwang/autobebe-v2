import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, SafeAreaView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { fetchClinicsForSelection } from '../api/client';

interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  hours?: string;
}

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const loadClinics = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        const clinicList = await fetchClinicsForSelection();
        setClinics(clinicList);
        
        // Set the first clinic as default if available
        if (clinicList.length > 0) {
          setSelectedClinic(clinicList[0]);
          console.log(`Default clinic set: ${clinicList[0].name} with ID: ${clinicList[0].id}`);
        } else {
          // Set a fallback default clinic if the list is empty
          const defaultClinic = {
            id: '4F420955',
            name: "Default Clinic"
          };
          setSelectedClinic(defaultClinic);
          console.log(`No clinics found, using default: ${defaultClinic.name} with ID: ${defaultClinic.id}`);
        }
      } catch (error) {
        console.error('Failed to load clinics:', error);
        setApiError('Unable to load clinics. Using default clinic.');
        // Set a default clinic when API fails
        const fallbackClinic = {
          id: '4F420955',
          name: "Naomi's Clinic"
        };
        setSelectedClinic(fallbackClinic);
        console.log(`Error loading clinics, using fallback: ${fallbackClinic.name} with ID: ${fallbackClinic.id}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadClinics();
  }, []);

  const renderClinicItem = ({ item }: { item: Clinic }) => (
    <TouchableOpacity
      style={styles.clinicItem}
      onPress={() => {
        setSelectedClinic(item);
        setModalVisible(false);
      }}
    >
      <Text style={[
        styles.clinicItemText,
        selectedClinic?.id === item.id && styles.selectedClinicText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const handleStartCheckin = () => {
    // Ensure we always have a valid clinic ID
    const clinicId = selectedClinic?.id || '4F420955';
    console.log(`Starting check-in for clinic: ${clinicId}`);
    
    // Log the full selected clinic object for debugging
    console.log('Selected clinic object:', selectedClinic);
    
    navigation.navigate('PatientInfo', { clinicId });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patient Health App</Text>
      </View>

      {/* Clinic Info Section */}
      <View style={styles.clinicInfoContainer}>
        <Text style={styles.clinicName}>{selectedClinic?.name || "Select a clinic"}</Text>
        <Text style={styles.clinicAddress}>{selectedClinic?.address || "Address information will appear here"}</Text>
        <Text style={styles.clinicPhone}>{selectedClinic?.phone || "Phone information will appear here"}</Text>
        <Text style={styles.clinicHours}>{selectedClinic?.hours || "Hours information will appear here"}</Text>
      </View>

      {/* Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Welcome to {selectedClinic?.name || "our clinic"}. We are committed to providing exceptional healthcare services to our community.
        </Text>
        <Text style={styles.tagline}>Your trusted healthcare partner</Text>
      </View>

      {/* Clinic Selection */}
      <View style={styles.clinicSelectionContainer}>
        <Text style={styles.selectionTitle}>Choose a clinic location:</Text>
        
        {apiError && (
          <Text style={styles.errorText}>{apiError}</Text>
        )}
        
        {isLoading ? (
          <Text style={styles.loadingText}>Loading available clinics...</Text>
        ) : (
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.selectedClinicName}>
              {selectedClinic?.name || 'Select a clinic'}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Start Check-in Button */}
      <TouchableOpacity 
        style={styles.checkInButton}
        onPress={handleStartCheckin}
      >
        <Text style={styles.checkInButtonText}>Start Check-in</Text>
      </TouchableOpacity>

      {/* Clinic Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Clinic</Text>
            
            <FlatList
              data={clinics}
              renderItem={renderClinicItem}
              keyExtractor={(item) => item.id}
              style={styles.clinicList}
            />
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4285F4',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clinicInfoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  clinicName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  clinicAddress: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  clinicPhone: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  clinicHours: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    textAlign: 'center',
  },
  welcomeContainer: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic',
  },
  clinicSelectionContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 10,
  },
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#4285F4',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectedClinicName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#4285F4',
    fontWeight: 'bold',
  },
  checkInButton: {
    backgroundColor: '#27AE60',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  checkInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  clinicList: {
    maxHeight: 300,
  },
  clinicItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  clinicItemText: {
    fontSize: 16,
  },
  selectedClinicText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 14,
  },
});

export default HomeScreen;


// When navigating to the SymptomsScreen
const handleContinue = () => {
  if (validateForm()) {
    navigation.navigate('Symptoms', {
      patientInfo: {
        name: patientName,
        healthcareNumber: healthcareNumber,
        phone: phoneNumber,
        email: email
      },
      clinicId: selectedClinicId // Always pass the selected clinic ID
    });
  }
};