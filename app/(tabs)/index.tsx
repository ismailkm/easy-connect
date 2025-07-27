import { Text, View } from '@/components/Themed';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { UserModel } from '@/models/UserModel';
import UserInterface from '@/types/UserInterface';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const DashboardScreen = () => {
  const [userData, setUserData] = useState<UserInterface | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const storedUserData = await UserModel.getUserDetails();
          if (storedUserData) {
            setUserData(storedUserData);
          }
        } catch (e) {
          console.error('Failed to load user data from UserModel', e);
        }
      };

      fetchUserData();
    }, [])
  );

  const greetingName = userData?.firstName || 'Friend';

  return (
    <View style={styles.container}>
      {/* Section 1: Introduction */}
      <View style={styles.introSection}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hello, {greetingName}!</Text>
          <Text style={styles.subtitle}>Your personalized guide to UK life.</Text>
          <Text style={styles.welcomeMessage}>Connect, learn, and thrive with EasyConnect.</Text>
        </View>
        
        <View style={styles.offlineIndicator}>
          <View style={styles.offlineCircle} />
          <Text style={styles.offlineText}>Offline Ready</Text>
        </View>
      </View>

      {/* Section 2: Buttons */}
      <View style={styles.buttonSection}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/translate')}>
            <View style={styles.buttonRight}>
              <IconSymbol name="text.bubble.fill" size={40} color="white" />
            </View>
            <View style={styles.buttonLeft}>
              <Text style={styles.buttonTitle}>Translate</Text>
              <Text style={styles.buttonSubtitle}>From Camera or Text</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/practice-english')}>
            <View style={styles.buttonRight}>
              <IconSymbol name="graduationcap.fill" size={40} color="white" />
            </View>
            <View style={styles.buttonLeft}>
              <Text style={styles.buttonTitle}>Practice English</Text>
              <Text style={styles.buttonSubtitle}>Chat with an AI Tutor</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/ask-about-uk-life')}>
            <View style={styles.buttonRight}>
              <IconSymbol name="questionmark.circle.fill" size={40} color="white" />
            </View>
            <View style={styles.buttonLeft}>
              <Text style={styles.buttonTitle}>Ask About UK Life</Text>
              <Text style={styles.buttonSubtitle}>Get Help & Information</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  introSection: {
    flex: 2,
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonSection: {
    flex: 4,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 10,
    justifyContent: 'center',
  },
  greetingContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingsIcon: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  welcomeMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  offlineIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  offlineCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
    marginRight: 5,
  },
  offlineText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonRight: {
    flex:1, 
    backgroundColor: 'transparent'
  },
  buttonLeft: {
    flex:3, 
    backgroundColor: 'transparent'
  },
  buttonTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSubtitle: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
});

export default DashboardScreen;