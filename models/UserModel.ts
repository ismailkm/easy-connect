import UserInterface from '@/types/UserInterface';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_DATA_KEY = 'userData';

export const UserModel = {

  async saveUserDetails(userData: UserInterface): Promise<void> {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

  },

  async getUserDetails(): Promise<UserInterface | null> {
    const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);
    if (userDataString) {
      return JSON.parse(userDataString) as UserInterface;
    }
    return null;
  },

  async clearUserDetails(): Promise<void> {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  },
  
};