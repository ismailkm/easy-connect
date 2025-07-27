import { Text, View } from '@/components/Themed';
import { LANGUAGES } from '@/constants/Languages';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

interface UserFormProps {
  initialFirstName?: string;
  initialNativeLanguage?: Language;
  onSave: (firstName: string, nativeLanguage: Language) => void;
  buttonTitle: string;
  isNewUser?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  initialFirstName = '',
  initialNativeLanguage = LANGUAGES[0].value as Language,
  onSave,
  buttonTitle,
  isNewUser = false,
}) => {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(initialNativeLanguage);

  useEffect(() => {
    setFirstName(initialFirstName);
    setSelectedLanguage(initialNativeLanguage);
  }, [initialFirstName, initialNativeLanguage]);

  const handleSave = () => {
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'Please enter your first name.');
      return;
    }
    if (!selectedLanguage) {
      Alert.alert('Validation Error', 'Please select a native language.');
      return;
    }
    onSave(firstName, selectedLanguage);
  };

  return (
    <View style={styles.container}>
      {isNewUser && (
        <View style={styles.logoContainer}>
          <MaterialIcons name="group-add" size={80} color="#007AFF" />
        </View>
      )}
      
      {isNewUser && <Text style={styles.welcomeText}>Welcome to Easy Connect</Text>}

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <View style={styles.languageButtonsContainer}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.value}
            style={[
              styles.languageButton,
              selectedLanguage === lang.value && styles.selectedLanguageButton,
            ]}
            onPress={() => setSelectedLanguage(lang.value as Language)}
          >
            <Text
              style={[
                styles.languageButtonText,
                selectedLanguage === lang.value && styles.selectedLanguageButtonText,
              ]}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{buttonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  logoContainer: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
  },
  languageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  languageButton: {
    flex: 1,
    marginHorizontal: 5,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedLanguageButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  languageButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  selectedLanguageButtonText: {
    color: '#FFFFFF',
  },
  saveButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#6495ED',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default UserForm;