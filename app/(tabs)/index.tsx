import { DashboardButton } from '@/components/DashboardButton';
import { Text, View } from '@/components/Themed';
import { UserModel } from '@/models/UserModel';
import UserInterface from '@/types/UserInterface';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

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
          <DashboardButton
            iconName="text.bubble.fill"
            title="Translate"
            subtitle="From Camera or Text"
            onPress={() => router.push('/(tabs)/translate')}
          />
          <DashboardButton
            iconName="graduationcap.fill"
            title="Learn English"
            subtitle="Interactive Lessons"
            onPress={() => router.push('/(tabs)/learn-english')}
          />
          <DashboardButton
            iconName="questionmark.circle.fill"
            title="Ask About UK Life"
            subtitle="Get Help & Information"
            onPress={() => router.push('/(tabs)/ask-about-uk-life')}
          />
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
  }
});

export default DashboardScreen;