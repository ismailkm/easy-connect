import { Text, View } from '@/components/Themed';
import FormButton from '@/components/ui/FormButton';
import UserForm from '@/components/UserForm';
import UserInterface from '@/types/UserInterface';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { StorageHelper } from '../../models/StorageHelper';
import { UserModel } from '../../models/UserModel';


const SettingsScreen = () => {
  const [initialUserData, setInitialUserData] = useState<UserInterface | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await UserModel.getUserDetails();
        console.log({userData})
        if (userData) {
          setInitialUserData(userData);
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      }
    };
    loadUserData();
  }, []);

  const handleSave = async (userData: UserInterface) => {
    try {
      await UserModel.saveUserDetails(userData);
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Settings</Text>
          {initialUserData && (
            <UserForm
              initialUserData={initialUserData}
              onSave={handleSave}
              buttonTitle="Save Settings"
            />
          )}

          <FormButton title="Logout" onPress={handleLogout} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
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

});

export default SettingsScreen;