// HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/contexts/AppContext';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { Header } from '@/components/ui/Header';
import { theme } from '@/constants/theme';
import { LoginModal } from '@/components/auth/LoginModal';

export default function HomeScreen() {
  const router = useRouter();
  const { isLoggedIn, userProfile, logout } = useAppContext();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  if (!isLoggedIn) {
    return <LoginModal />;
  }

  if (!userProfile.nativeLanguage || !userProfile.targetLanguage || showLanguageSelector) {
    return <LanguageSelector onComplete={() => setShowLanguageSelector(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="LinguoAI" showBackButton={false} showSettings={false} />
      <Text style={styles.headerSubtitle}>Your AI Language Learning Companion</Text>
      <View style={styles.content}>
        <Image source={require('@/assets/images/home.png')} style={styles.logo} />
        <Text style={styles.welcomeText}>
          Welcome{userProfile.name ? `, ${userProfile.name}` : ''}!
        </Text>

        <View style={styles.currentLanguage}>
          <Text style={styles.languageLabel}>Currently Learning:</Text>
          <Text style={styles.languageText}>{userProfile.targetLanguage?.toUpperCase()}</Text>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setShowLanguageSelector(true)}
          >
            <Text style={styles.changeButtonText}>Change Language</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  welcomeText: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 28,
    color: theme.colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  currentLanguage: {
    alignItems: 'center',
    marginBottom: 32,
  },
  languageLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  languageText: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 24,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  changeButton: {
    backgroundColor: theme.colors.neutral100,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  changeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.primary,
  },
  logoutButton: {
    marginTop: 'auto',
    backgroundColor: theme.colors.neutral100,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
  },
  logoutButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.error,
  },
});
