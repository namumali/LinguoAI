// LanguageSelector.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAppContext } from '@/contexts/AppContext';
import { languages } from '@/constants/languages';
import { Header } from '@/components/ui/Header';
import { theme } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';

interface LanguageSelectorProps {
  onComplete: () => void;
}

export function LanguageSelector({ onComplete }: LanguageSelectorProps) {
  const { userProfile, setUserLanguages } = useAppContext();
  const [step, setStep] = useState(1);
  const [nativeLanguage, setNativeLanguage] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile.nativeLanguage && userProfile.targetLanguage) {
      onComplete();
    }
  }, [userProfile]);

  const handleLanguageSelect = (languageCode: string) => {
    if (step === 1) {
      setNativeLanguage(languageCode);
      setStep(2);
    } else {
      setTargetLanguage(languageCode);
      if (nativeLanguage) {
        setUserLanguages(nativeLanguage, languageCode);
        onComplete();
      }
    }
  };

  const renderLanguageItem = ({ item }: { item: typeof languages[0] }) => {
    const isSelected =
      (step === 1 && item.code === nativeLanguage) ||
      (step === 2 && item.code === targetLanguage);

    if (step === 2 && item.code === nativeLanguage) {
      return null;
    }

    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          isSelected && styles.selectedLanguageItem,
        ]}
        onPress={() => handleLanguageSelect(item.code)}
      >
        <View style={styles.languageInfo}>
          <Text style={styles.languageFlag}>{item.flag}</Text>
          <Text style={styles.languageName}>{item.name}</Text>
        </View>

        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Feather name="chevron-right" size={24} color="black" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={step === 1 ? 'Select Your Native Language' : 'Select Language to Learn'}
        showBackButton={step === 2}
        showSettings={false}
      />

      <Text style={styles.description}>
        {step === 1
          ? 'Choose the language you already speak fluently.'
          : 'Now, select the language you want to learn.'}
      </Text>

      <FlatList
        data={languages.sort((a, b) => a.popularity - b.popularity)}
        renderItem={renderLanguageItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.languageList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginHorizontal: 16,
    marginVertical: 16,
  },
  languageList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...theme.shadows.sm,
  },
  selectedLanguageItem: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
  },
  selectedIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
