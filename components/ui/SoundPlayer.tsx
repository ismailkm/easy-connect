import { useGemma } from '@/context/GemmaProvider';
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';

type SoundPlayerProps = {
  text: string;
  languageCode: LanguageCode;
  size?: number;
  color?: string;
  messageId: string;
};

export const SoundPlayer: React.FC<SoundPlayerProps> = ({
  text,
  languageCode,
  size = 24,
  color = 'black',
  messageId
}) => {
  const animation = useState(new Animated.Value(0))[0];
  const { speak, stopSpeaking, speakingUtteranceId } = useGemma();

  const isSpeaking = speakingUtteranceId === messageId;
  
  useEffect(() => {
    if (isSpeaking) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isSpeaking]); 

  const startAnimation = () => {
    animation.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const stopAnimation = () => {
    animation.stopAnimation();
    animation.setValue(0);
  };

  const handlePress = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text, languageCode, messageId);
    }
  };

  const animatedStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.1, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Animated.View style={animatedStyle}>
          <FontAwesome
            name={isSpeaking ? 'stop-circle' : 'play-circle'}
            size={size}
            color={color}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    marginRight: 12,
    fontSize: 16,
  },
  button: {
    padding: 4,
  },
});