import { Text, View } from '@/components/Themed';
import FormButton from '@/components/ui/FormButton';
import SelectionButton from '@/components/ui/SelectionButton';
import { ENGLISH_LEVELS } from '@/constants/EnglishLevels';
import { GENDERS } from '@/constants/Genders';
import { LANGUAGES } from '@/constants/Languages';
import UserInterface from '@/types/UserInterface';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput } from 'react-native';

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

  return (
    <View style={styles.container}>
      
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.buttonsContainer}>
        {GENDERS.map((gen) => (
          <SelectionButton
            key={gen.value}
            title={gen.label}
            onPress={() => setGender(gen.value)}
            isSelected={gender === gen.value}
          />
        ))}
      </View>

      <Text style={styles.label}>Native Language</Text>
      <View style={styles.buttonsContainer}>
        {LANGUAGES.map((lang) => (
          <SelectionButton
            key={lang.value}
            title={lang.label}
            onPress={() => setNativeLanguage(lang.value as Language)}
            isSelected={nativeLanguage === lang.value}
          />
        ))}
      </View>

      <Text style={styles.label}>English Level</Text>
      <View style={styles.buttonsContainer}>
          {ENGLISH_LEVELS.map((level) => (
            <SelectionButton
              key={level.value}
              title={level.label}
              onPress={() => setEnglishLevel(level.value as EnglishLevel)}
              isSelected={englishLevel === level.value}
            />
          ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Profession"
        value={profession}
        onChangeText={setProfession}
      />

      <FormButton title={buttonTitle} onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'transparent'
  },

});

export default UserForm;