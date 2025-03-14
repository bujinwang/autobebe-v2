import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getWaitingInstructions, WaitingInstructionsRequest } from '../services/medicalAIService';

type ScheduledScreenProps = {
  route: RouteProp<RootStackParamList, 'Scheduled'>;
};

const ScheduledScreen = ({ route }: ScheduledScreenProps) => {
  const [instructions, setInstructions] = useState<string>('Please stay in the clinic. A clerk will find you when it\'s your turn.');
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchWaitingInstructions = async () => {
      try {
        // Check if we have appointment data in route params
        if (route.params && route.params.appointmentData) {
          const { purpose, symptoms, questions, answers } = route.params.appointmentData;
          
          // Prepare follow-up QA pairs
          const followUpQAPairs = [];
          if (questions && answers && questions.length === answers.length) {
            for (let i = 0; i < questions.length; i++) {
              followUpQAPairs.push({
                question: questions[i],
                answer: answers[i]
              });
            }
          }
          
          // Request personalized waiting instructions
          const request: WaitingInstructionsRequest = {
            purposeOfVisit: purpose || '',
            symptoms: symptoms || '',
            followUpQAPairs: followUpQAPairs
          };
          
          const response = await getWaitingInstructions(request);
          
          if (response.success && response.instructions) {
            setInstructions(response.instructions);
          }
        }
      } catch (error) {
        console.error('Error fetching waiting instructions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWaitingInstructions();
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>You are scheduled!</Text>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>Important Instructions</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4A90E2" />
                <Text style={styles.loadingText}>Loading personalized instructions...</Text>
              </View>
            ) : (
              <Text style={styles.instruction}>{instructions}</Text>
            )}
          </View>
        </View>
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
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 30,
    textAlign: 'center',
  },
  instructionContainer: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 10,
    width: '100%',
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#7F8C8D',
  },
});

export default ScheduledScreen; 