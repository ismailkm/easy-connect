import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { ENGLISH_LEVELS } from '@/constants/EnglishLevels';
import { GENDERS } from '@/constants/Genders';
import { LANGUAGES } from '@/constants/Languages';
import UserInterface from '@/types/UserInterface';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

interface UserFormProps {
  initialUserData?: UserInterface;
  onSave: (userData: UserInterface) => void;
  buttonTitle: string;
}

const UserForm: React.FC<UserFormProps> = ({
  initialUserData,
  onSave,
  buttonTitle,
}) => {
  const [firstName, setFirstName] = useState(initialUserData?.firstName || '');
  const [nativeLanguage, setNativeLanguage] = useState<Language>(LANGUAGES[0].value as Language);
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>(ENGLISH_LEVELS[0].value as EnglishLevel);
  const [age, setAge] = useState<string>(initialUserData?.age?.toString() || '');
  const [profession, setProfession] = useState<string>(initialUserData?.profession || '');
  const [gender, setGender] = useState<GenderType>(GENDERS[0].value);

  useEffect(() => {
    if (initialUserData) {
      setFirstName(initialUserData.firstName || '');
      setNativeLanguage(initialUserData.nativeLanguage || LANGUAGES[0]);
      setEnglishLevel(initialUserData.englishLevel || ENGLISH_LEVELS[0]);
      setAge(initialUserData.age?.toString() || '');
      setProfession(initialUserData.profession || '');
      setGender(initialUserData.gender || GENDERS[0].value);
    }
  }, [initialUserData]);

  const handleSave = () => {
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'Please enter your first name.');
      return;
    }
    if (!nativeLanguage) {
      Alert.alert('Validation Error', 'Please select a native language.');
      return;
    }
    if (!age.trim()) {
      Alert.alert('Validation Error', 'Please enter your age.');
      return;
    }
    if (!profession.trim()) {
      Alert.alert('Validation Error', 'Please enter your profession.');
      return;
    }
    if (!gender) {
      Alert.alert('Validation Error', 'Please select your gender.');
      return;
    }
    onSave({
      firstName,
      nativeLanguage,
      englishLevel,
      age: age ? parseInt(age, 10) : undefined,
      profession: profession || undefined,
      gender: gender || undefined,
    });
  };

  const renderSelectionButtons = (options: { label: string; value: string }[], selectedValue: string, onSelect: (value: string) => void) => (
    <View style={styles.buttonsContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[styles.selectionButton, selectedValue === option.value && styles.selectedButton]}
          onPress={() => onSelect(option.value)}
        >
          <Text style={[styles.selectionButtonText, selectedValue === option.value && styles.selectedButtonText]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#888"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor="#888"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Gender</Text>
        {renderSelectionButtons(GENDERS, gender, setGender as (value: string) => void)}

        <Text style={styles.label}>Native Language</Text>
        {renderSelectionButtons(LANGUAGES, nativeLanguage, setNativeLanguage as (value: string) => void)}

        <Text style={styles.label}>English Level</Text>
        {renderSelectionButtons(ENGLISH_LEVELS, englishLevel, setEnglishLevel as (value: string) => void)}

        <TextInput
          style={styles.input}
          placeholder="Profession"
          placeholderTextColor="#888"
          value={profession}
          onChangeText={setProfession}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
          <Text style={styles.submitButtonText}>{buttonTitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    width: '100%',
    padding: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 10,
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  selectionButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
    backgroundColor: '#F8F8F8',
    marginRight: 6,
  },
  selectedButton: {
    backgroundColor: Colors.light.buttonColor, // A vibrant blue
    borderColor: Colors.light.buttonColor,
  },
  selectionButtonText: {
    color: '#555555',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: Colors.light.buttonColor,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.light.buttonColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserForm;