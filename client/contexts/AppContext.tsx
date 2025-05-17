// AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  id: string;
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
    const newUserProfile: UserProfile = {
      id: '123',
      name: 'Demo User',
      email,
      nativeLanguage: null,
      targetLanguage: null,
      preferences: {
        topicId: null,
        preferredTime: null,
        sessionLengthMinutes: 15,
        daysPerWeek: 3,
      },
    };

    setUserProfile(newUserProfile);
    setIsLoggedIn(true);

    try {
      await AsyncStorage.setItem('user', JSON.stringify(newUserProfile));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const newUserProfile: UserProfile = {
      id: '123',
      name,
      email,
      nativeLanguage: null,
      targetLanguage: null,
      preferences: {
        topicId: null,
        preferredTime: null,
        sessionLengthMinutes: 15,
        daysPerWeek: 3,
      },
    };

    setUserProfile(newUserProfile);
    setIsLoggedIn(true);

    try {
      await AsyncStorage.setItem('user', JSON.stringify(newUserProfile));
    } catch (error) {
      console.error('Error saving user data:', error);
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
    const updatedProfile = {
      ...userProfile,
      nativeLanguage,
      targetLanguage,
    };

    setUserProfile(updatedProfile);

    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error saving user languages:', error);
    }
  };

  const updateUserPreferences = async (preferences: Partial<UserProfile['preferences']>) => {
    const updatedProfile = {
      ...userProfile,
      preferences: {
        ...userProfile.preferences,
        ...preferences,
      },
    };

    setUserProfile(updatedProfile);

    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };

  const showLogin = () => {
    setIsLoggedIn(false);
  };

  if (!isHydrated) {
    return null; // or a splash screen or loader component
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
