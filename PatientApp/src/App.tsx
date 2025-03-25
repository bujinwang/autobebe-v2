import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    console.log('App component mounted');
  }, []);

  try {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <AppNavigator />
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    );
  } catch (error: any) {
    console.error('Error in App render:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Something went wrong!</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }
} 