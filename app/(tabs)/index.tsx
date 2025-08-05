import { DashboardButton } from '@/components/DashboardButton';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { UserModel } from '@/models/UserModel';
import UserInterface from '@/types/UserInterface';
import { LinearGradient } from 'expo-linear-gradient';
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
      <LinearGradient
        colors={[Colors.light.tint, Colors.light.tint + 'B3']}
        style={styles.introSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hello, {greetingName}!</Text>
          <Text style={styles.subtitle}>Your personalized guide to UK life.</Text>
          <Text style={styles.welcomeMessage}>Connect, learn, and thrive with EasyConnect.</Text>
        </View>
        <View style={styles.offlineIndicator}>
          <View style={styles.offlineCircle} />
          <Text style={styles.offlineText}>Offline Ready</Text>
        </View>
      </LinearGradient>


      {/* Section 2: Buttons */}
      <LinearGradient
        colors={[Colors.light.secondaryBackground, Colors.light.secondaryBackground + 'B3']}
        style={styles.buttonSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
          <DashboardButton
            iconName="text.bubble.fill"
            title="Translate"
            subtitle="From Camera or Text"
            onPress={() => router.push('/(tabs)/translate')}
            startColor={Colors.light.translateButton}
            endColor={Colors.light.translateButton + 'B3'}
          />
          <DashboardButton
            iconName="graduationcap.fill"
            title="Learn English"
            subtitle="Interactive Lessons"
            onPress={() => router.push('/(tabs)/learn-english')}
            startColor={Colors.light.learnEnglishButton}
            endColor={Colors.light.learnEnglishButton + 'B3'}
          />
          <DashboardButton
            iconName="questionmark.circle.fill"
            title="Ask About UK Life"
            subtitle="Get Help & Information"
            onPress={() => router.push('/(tabs)/ask-about-uk-life')}
            startColor={Colors.light.askUkLifeButton}
            endColor={Colors.light.askUkLifeButton + 'B3'}
          />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  introSection: {
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonSection: {
    flex: 1,
    borderRadius: 15,
    padding: 20,
    shadowColor: Colors.light.secondaryBackground,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    justifyContent: 'space-around',
  },

  greetingContainer: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  greetingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.background,
    marginBottom: 20,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 18,
    color: Colors.light.background,
    marginBottom: 4,
    textAlign: 'center',
  },

  welcomeMessage: {
    fontSize: 16,
    color: Colors.light.background,
    textAlign: 'center',
  },

  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  offlineCircle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: Colors.light.success,
    marginRight: 5,
    borderWidth: 1,
    borderColor: Colors.light.background,
  },
  offlineText: {
     fontSize: 14,
     color: Colors.light.background,
   },
});

export default DashboardScreen;