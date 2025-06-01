// AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser, updateLanguages, updatePreferences } from '@/api/ai';

interface UserProfile {
  id: string;  // maps to MongoDB _id
  name: string;
  email: string;
  nativeLanguage: string | null;
  targetLanguage: string | null;
  preferences: {
    topicId: number | null;
    preferredTime: string | null;
    sessionLengthMinutes: number;
    daysPerWeek: number;
  };
}

interface AppContextType {
  isLoggedIn: boolean;
  userProfile: UserProfile;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  setUserLanguages: (nativeLanguage: string, targetLanguage: string) => void;
  updateUserPreferences: (preferences: Partial<UserProfile['preferences']>) => void;
  showLogin: () => void;
}

const defaultUserProfile: UserProfile = {
  id: '',
  name: '',
  email: '',
  nativeLanguage: null,
  targetLanguage: null,
  preferences: {
    topicId: null,
    preferredTime: null,
    sessionLengthMinutes: 15,
    daysPerWeek: 3,
  },
};

const AppContext = createContext<AppContextType>({
  isLoggedIn: false,
  userProfile: defaultUserProfile,
  login: () => {},
  register: () => {},
  logout: () => {},
  setUserLanguages: () => {},
  updateUserPreferences: () => {},
  showLogin: () => {},
});

export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUserProfile(JSON.parse(userData));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    loadUserData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await loginUser(email, password);
      const formattedProfile: UserProfile = {
        id: userData.data.id,  // ✅ explicitly use 'id' provided by backend
        name: userData.data.username,
        email: userData.data.username,  // assuming username is email
        nativeLanguage: userData.data.nativeLanguage,
        targetLanguage: userData.data.learningLanguages[0] || null,
        preferences: defaultUserProfile.preferences,
      };
      setUserProfile(formattedProfile);
      setIsLoggedIn(true);
      await AsyncStorage.setItem('user', JSON.stringify(formattedProfile));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const userData = await registerUser(name, email, password);
      const formattedProfile: UserProfile = {
        id: userData.data.id,
        name: userData.data.username,
        email: userData.data.username,
        nativeLanguage: userData.data.nativeLanguage,
        targetLanguage: userData.data.learningLanguages[0] || null,
        preferences: defaultUserProfile.preferences,
      };
      setUserProfile(formattedProfile);
      setIsLoggedIn(true);
      await AsyncStorage.setItem('user', JSON.stringify(formattedProfile));
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUserProfile(defaultUserProfile);

    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  };

  const setUserLanguages = async (nativeLanguage: string, targetLanguage: string) => {
    console.log('Sending updateLanguages with:', userProfile.id, nativeLanguage, targetLanguage);
    try {
      const updatedProfile = await updateLanguages(userProfile.id, nativeLanguage, targetLanguage);
      setUserProfile(prev => ({
        ...prev,
        nativeLanguage: updatedProfile.nativeLanguage,
        targetLanguage: updatedProfile.learningLanguages[0] || null,
      }));
      await AsyncStorage.setItem('user', JSON.stringify({ ...userProfile, ...updatedProfile }));
    } catch (error) {
      console.error('Error updating languages:', error);
    }
  };

  const updateUserPreferences = async (preferences: Partial<UserProfile['preferences']>) => {
    try {
      const updatedProfile = await updatePreferences(userProfile.id, preferences);
      setUserProfile(prev => ({
        ...prev,
        preferences: updatedProfile.preferences,
      }));
      await AsyncStorage.setItem('user', JSON.stringify({ ...userProfile, ...updatedProfile }));
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const showLogin = () => {
    setIsLoggedIn(false);
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        userProfile,
        login,
        register,
        logout,
        setUserLanguages,
        updateUserPreferences,
        showLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
