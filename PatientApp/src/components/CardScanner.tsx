import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

interface CardScannerProps {
  scanType: 'healthcard' | 'driverlicense';
  onScanComplete: (data: { name?: string; healthcareNumber?: string }) => void;
  onClose: () => void;
}

const CardScanner = ({ scanType, onScanComplete, onClose }: CardScannerProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        
        // In a real app, you would send this image to an OCR service
        // For this demo, we'll simulate extracting data
        simulateDataExtraction(scanType);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        // In a real app, you would send this image to an OCR service
        // For this demo, we'll simulate extracting data
        simulateDataExtraction(scanType);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const simulateDataExtraction = (type: 'healthcard' | 'driverlicense') => {
    // Simulate processing delay
    setTimeout(() => {
      if (type === 'healthcard') {
        onScanComplete({
          name: 'John Doe',
          healthcareNumber: '123456789'
        });
      } else {
        onScanComplete({
          name: 'Jane Smith',
          healthcareNumber: ''
        });
      }
    }, 1500);
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Select from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {scanType === 'healthcard' ? 'Scan Health Card' : 'Scan Driver\'s License'}
      </Text>
      
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back as any}
        ref={(ref) => setCameraRef(ref)}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </Camera>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Select from Gallery</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 300,
    height: 200,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 0.45,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});

export default CardScanner; 