import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// Simple log viewer component for debugging
const LogViewer = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Override console.log to capture logs
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      originalConsoleLog(...args);
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      setLogs(prevLogs => [...prevLogs, logMessage].slice(-50)); // Keep last 50 logs
    };

    return () => {
      console.log = originalConsoleLog; // Restore original console.log on unmount
    };
  }, []);

  if (!visible) {
    return (
      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.toggleButtonText}>Show Logs</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Debug Logs</Text>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.logContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logContainer: {
    flex: 1,
    padding: 10,
  },
  logText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 5,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 5,
    zIndex: 1000,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default LogViewer; 