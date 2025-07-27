import UserForm from '@/components/UserForm';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StorageHelper } from '../models/StorageHelper';
import { UserModel } from '../models/UserModel';


const WelcomeScreen = () => {
  const handleSave = async (firstName: string, nativeLanguage: Language) => {
    await UserModel.saveUserDetails(firstName, nativeLanguage);
    await StorageHelper.setHasOnboarded();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <UserForm onSave={handleSave} buttonTitle="Get Started" isNewUser={true} />
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
});

export default WelcomeScreen;