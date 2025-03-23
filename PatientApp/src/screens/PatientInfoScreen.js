// ... existing code ...
const PatientInfoScreen = ({ navigation, route }) => {
  // Add dateOfBirth to your state
  const [formData, setFormData] = useState({
    // ... existing form data
    dateOfBirth: '',
  });

  // Add dateOfBirth to your errors state if you have validation
  const [errors, setErrors] = useState({
    // ... existing errors
    dateOfBirth: '',
  });

  // Add validation for dateOfBirth if needed
  const validateForm = () => {
    const newErrors = {
      // ... existing error fields
      dateOfBirth: '',
    };

    // Add validation logic for dateOfBirth if needed
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    // ... rest of your validation logic

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Patient Information</Text>
        
        <View style={styles.formContainer}>
          {/* ... existing form fields ... */}
          
          {/* Date of Birth Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date of Birth <Text style={styles.requiredAsterisk}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.dateOfBirth ? styles.inputError : null]}
              value={formData.dateOfBirth}
              onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
              placeholder="MM/DD/YYYY"
              keyboardType="numbers-and-punctuation"
            />
            {errors.dateOfBirth ? (
              <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
            ) : null}
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!isFormValid()}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

// Add any additional styles if needed
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  requiredAsterisk: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
});