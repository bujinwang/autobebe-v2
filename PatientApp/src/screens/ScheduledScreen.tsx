import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getWaitingInstructions, WaitingInstructionsRequest } from '../services/medicalAIService';

type ScheduledScreenProps = {
  navigation: any;
  route: RouteProp<RootStackParamList, 'Scheduled'>;
};

const ScheduledScreen = ({ navigation, route }: ScheduledScreenProps) => {
  const { appointmentData } = route.params || {};
  const [waitingInstructions, setWaitingInstructions] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch waiting instructions when component mounts
  useEffect(() => {
    const fetchWaitingInstructions = async () => {
      if (appointmentData?.purpose && appointmentData?.symptoms) {
        setIsLoading(true);
        try {
          // Debug the data structure
          console.log('Appointment data:', JSON.stringify(appointmentData, null, 2));
          
          // Create properly formatted followUpQAPairs from questions and answers
          const followUpQAPairs = [];
          
          // Only create pairs if both questions and answers exist and are arrays
          if (appointmentData.questions && Array.isArray(appointmentData.questions) &&
              appointmentData.answers && Array.isArray(appointmentData.answers)) {
            
            // Create pairs for each question that has a corresponding answer
            for (let i = 0; i < appointmentData.questions.length; i++) {
              if (appointmentData.questions[i] && appointmentData.answers[i]) {
                followUpQAPairs.push({
                  question: appointmentData.questions[i],
                  answer: appointmentData.answers[i]
                });
              }
            }
          }
          
          // Create the request with the proper structure
          const request = {
            purposeOfVisit: appointmentData.purpose,
            symptoms: appointmentData.symptoms,
            followUpQAPairs: followUpQAPairs
          };
          
          console.log('Sending waiting instructions request:', JSON.stringify(request, null, 2));
          
          const response = await getWaitingInstructions(request);
          console.log('Response received:', JSON.stringify(response, null, 2));
          
          if (response && response.success) {
            setWaitingInstructions(response.instructions);
          } else {
            console.error('Error in waiting instructions response:', 
              response ? response.errorMessage : 'No response');
          }
        } catch (error) {
          console.error('Error fetching waiting instructions:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('Missing required appointment data for waiting instructions');
      }
    };
    
    fetchWaitingInstructions();
  }, [appointmentData]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>Appointment Scheduled!</Text>
          <Text style={styles.successMessage}>
            Your appointment has been successfully scheduled. A healthcare provider will review your information.
          </Text>
        </View>

        {/* Waiting Instructions Section - Moved above appointment details */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading care instructions...</Text>
          </View>
        ) : waitingInstructions ? (
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>While You Wait</Text>
            <Text style={styles.instruction}>{waitingInstructions}</Text>
          </View>
        ) : null}

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Purpose of Visit:</Text>
            <Text style={styles.detailText}>{appointmentData?.purpose || 'Not specified'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Symptoms:</Text>
            <Text style={styles.detailText}>{appointmentData?.symptoms || 'None'}</Text>
          </View>
          
          {appointmentData?.questions && appointmentData.questions.length > 0 && (
            <View style={styles.questionsContainer}>
              <Text style={styles.detailLabel}>Follow-up Questions:</Text>
              {appointmentData.questions.map((question, index) => (
                <View key={index} style={styles.questionItem}>
                  <Text style={styles.questionText}>Q: {question}</Text>
                  <Text style={styles.answerText}>A: {appointmentData.answers[index] || 'No answer provided'}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.doneButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  successContainer: {
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#34495e',
  },
  questionsContainer: {
    marginTop: 10,
  },
  questionItem: {
    marginTop: 10,
    marginBottom: 15,
  },
  questionText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 5,
  },
  answerText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 10,
  },
  doneButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionContainer: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    color: '#34495E',
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#7F8C8D',
  },
  
  // Make sure these styles are included
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  successContainer: {
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#34495e',
  },
  questionsContainer: {
    marginTop: 10,
  },
  questionItem: {
    marginTop: 10,
    marginBottom: 15,
  },
  questionText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 5,
  },
  answerText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 10,
  },
  doneButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ScheduledScreen;