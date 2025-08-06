import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'hasOnBoarded';

export const StorageHelper = {
  async setHasOnboarded(): Promise<void> {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  },

  async getOnboardedStatus(): Promise<boolean> {
    const status = await AsyncStorage.getItem(ONBOARDING_KEY);
    return status === 'true';
  },

  async clearAllStorage(): Promise<void> {
    await AsyncStorage.clear();
  },
};