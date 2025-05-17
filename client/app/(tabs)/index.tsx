// LearnScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useAppContext } from '@/contexts/AppContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { AlphabetCard } from '@/components/learning/AlphabetCard';
import { WordCard } from '@/components/learning/WordCard';
import { Header } from '@/components/ui/Header';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { theme } from '@/constants/theme';
import { alphabetData, wordData } from '@/constants/learningData';

const { width } = Dimensions.get('window');

export default function LearnScreen() {
  const { isLoggedIn, userProfile } = useAppContext();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [learningMode, setLearningMode] = useState<'alphabet' | 'words'>('alphabet');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!userProfile.nativeLanguage || !userProfile.targetLanguage) {
      setShowLanguageSelector(true);
    }
  }, [userProfile]);

  useEffect(() => {
    if (learningMode === 'alphabet') {
      setProgress((currentIndex + 1) / alphabetData.length);
    } else {
      setProgress((currentIndex + 1) / wordData.length);
    }
  }, [currentIndex, learningMode]);

  const handleNext = () => {
    const maxIndex = learningMode === 'alphabet' ? alphabetData.length - 1 : wordData.length - 1;
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    } else if (learningMode === 'alphabet') {
      setLearningMode('words');
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!isLoggedIn) {
    return <LoginModal />;
  }

  if (showLanguageSelector) {
    return <LanguageSelector onComplete={() => setShowLanguageSelector(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title={learningMode === 'alphabet' ? 'Learn the Alphabet' : 'Practice Words'} />

      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} />
        <Text style={styles.progressText}>
          {currentIndex + 1} of {learningMode === 'alphabet' ? alphabetData.length : wordData.length}
        </Text>
      </View>

      <View style={styles.contentContainer}>
        {learningMode === 'alphabet' ? (
          <Animated.View
            key={`alphabet-${currentIndex}`}
            entering={FadeInDown}
            exiting={FadeOutUp}
            style={styles.cardContainer}
          >
            <AlphabetCard data={alphabetData[currentIndex]} onNext={handleNext} />
          </Animated.View>
        ) : (
          <Animated.View
            key={`word-${currentIndex}`}
            entering={FadeInDown}
            exiting={FadeOutUp}
            style={styles.cardContainer}
          >
            <WordCard data={wordData[currentIndex]} onNext={handleNext} />
          </Animated.View>
        )}
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text style={[styles.navButtonText, currentIndex === 0 && styles.navButtonTextDisabled]}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <Text style={styles.navButtonText}>
            {learningMode === 'alphabet' && currentIndex === alphabetData.length - 1 ? 'Start Words' : 'Next'}
          </Text>
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
  progressContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    marginLeft: 10,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 'auto',
  },
  navButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: theme.colors.neutral200,
  },
  navButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  navButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },
});
