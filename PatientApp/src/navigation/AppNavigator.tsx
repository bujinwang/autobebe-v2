import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Image } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import PatientInfoScreen from '../screens/PatientInfoScreen';
import SymptomsScreen from '../screens/SymptomsScreen';
import ScheduledScreen from '../screens/ScheduledScreen';

// Import logo
import JoyTriageLogo from '../../assets/JoyTriage.webp';

// Define the stack navigator parameter list
export type RootStackParamList = {
  Home: undefined;
  PatientInfo: {
    existingAppointmentId?: number;
    clinicId?: string;
    patientInfo?: {
      name: string;
      healthcareNumber: string;
      phone: string;
    }
  } | undefined;
  Symptoms: {
    patientInfo: {
      name: string;
      healthcareNumber: string;
      phone: string;
      email: string;
    },
    clinicId: string;
  };
  Scheduled: {
    appointmentData?: {
      purpose: string;
      symptoms: string;
      questions: string[];
      answers: string[];
    }
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  useEffect(() => {
    console.log('AppNavigator mounted');
  }, []);

  return (
    <NavigationContainer
      fallback={<Text>Loading...</Text>}
      onStateChange={(state) => console.log('New navigation state:', state)}
    >
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4A90E2',
            backgroundImage: 'linear-gradient(to right, #4A90E2, #7ED321)',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={JoyTriageLogo} style={{ width: 50, height: 50, marginRight: 10 }} />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>JoyTriage</Text>
            </View>
          ),
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'JoyTriage' }}
          listeners={{
            focus: () => console.log('Home screen focused'),
            blur: () => console.log('Home screen blurred'),
          }}
        />
        <Stack.Screen name="PatientInfo" component={PatientInfoScreen} options={{ title: 'Patient Information' }} />
        <Stack.Screen name="Symptoms" component={SymptomsScreen} options={{ title: 'Symptoms' }} />
        <Stack.Screen name="Scheduled" component={ScheduledScreen} options={{ title: 'Appointment Scheduled' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 