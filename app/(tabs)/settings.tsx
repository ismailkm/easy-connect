import { Text, View } from '@/components/Themed';
import UserForm from '@/components/UserForm';
import { LANGUAGES } from '@/constants/Languages';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { StorageHelper } from '../../models/StorageHelper';
import { UserModel } from '../../models/UserModel';

const SettingsScreen = () => {
  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialNativeLanguage, setInitialNativeLanguage] = useState<Language>(LANGUAGES[0].value as Language);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await UserModel.getUserDetails();
        if (userData) {
          setInitialFirstName(userData.firstName || '');
          setInitialNativeLanguage(userData.nativeLanguage as Language);
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      }
    };
    loadUserData();
  }, []);

  const handleSave = async (firstName: string, nativeLanguage: Language) => {
    try {
      await UserModel.saveUserDetails(firstName, nativeLanguage);
      Alert.alert('Success', 'Your settings have been saved!');
    } catch (error) {
      console.error('Failed to save user data', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const handleLogout = async () => {
    await StorageHelper.clearAllStorage();
    router.replace('/welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <UserForm
        initialFirstName={initialFirstName}
        initialNativeLanguage={initialNativeLanguage}
        onSave={handleSave}
        buttonTitle="Save Settings"
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  resetButton: {
    width: '100%',
    height: 60,
    backgroundColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#808080',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;