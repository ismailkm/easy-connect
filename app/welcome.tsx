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
        keyboardVerticalOffset={20}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="group-add" size={80} color="#007AFF" />
          </View>
          <Text style={styles.welcomeText}>Welcome to Easy Connect</Text>
          
          <UserForm onSave={handleSave} buttonTitle="Get Started" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  logoContainer: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
});

export default WelcomeScreen;