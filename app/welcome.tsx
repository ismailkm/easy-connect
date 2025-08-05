import { Text, View } from '@/components/Themed';
import UserForm from '@/components/UserForm';
import { StorageHelper } from '@/models/StorageHelper';
import { UserModel } from '@/models/UserModel';
import UserInterface from '@/types/UserInterface';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const WelcomeScreen = () => {
  const handleSave = async (userData: UserInterface) => {
    await UserModel.saveUserDetails(userData);
    await StorageHelper.setHasOnboarded();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="group-add" size={80} color="#4A90E2" />
          </View>
          <Text style={styles.welcomeText}>Welcome to EasyConnect</Text>
          <Text style={styles.subText}>Let's get you set up</Text>
          
          <UserForm onSave={handleSave} buttonTitle="Continue" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
    padding: 5,
    paddingTop: 30,
  },
  logoContainer: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2', // A vibrant blue
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default WelcomeScreen;