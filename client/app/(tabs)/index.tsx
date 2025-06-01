import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
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
import { generateAlphabetCard, generateWordCard } from '@/api/ai';

const { width } = Dimensions.get('window');

export default function LearnScreen() {
  const { isLoggedIn, userProfile } = useAppContext();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [learningMode, setLearningMode] = useState<'alphabet' | 'words'>('alphabet');
  const [cardData, setCardData] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCard = async () => {
    setLoading(true);
    try {
      const language = userProfile.targetLanguage || 'ru';
      const letterOrWord = learningMode === 'alphabet' ? 'A' : 'hello';
      const data = learningMode === 'alphabet'
        ? await generateAlphabetCard(letterOrWord)
        : await generateWordCard(letterOrWord, language);
      setCardData(data);
    } catch (err) {
      console.error('Error fetching card:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userProfile.nativeLanguage || !userProfile.targetLanguage) {
      setShowLanguageSelector(true);
    } else {
      fetchCard();
    }
  }, [userProfile, learningMode]);

  const handleNext = () => {
    if (learningMode === 'alphabet') {
      setLearningMode('words');
    }
    fetchCard();
  };

  if (!isLoggedIn) return <LoginModal />;
  if (showLanguageSelector) return <LanguageSelector onComplete={() => setShowLanguageSelector(false)} />;

  return (
    <SafeAreaView style={styles.container}>
      <Header title={learningMode === 'alphabet' ? 'Learn the Alphabet' : 'Practice Words'} />

      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} />
        <Text style={styles.progressText}>Progress</Text>
      </View>

      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <Animated.View
            key={learningMode}
            entering={FadeInDown}
            exiting={FadeOutUp}
            style={styles.cardContainer}
          >
            {learningMode === 'alphabet' && cardData && <AlphabetCard data={cardData} onNext={handleNext} />}
            {learningMode === 'words' && cardData && <WordCard data={cardData} onNext={handleNext} />}
          </Animated.View>
        )}
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.navButton} onPress={handleNext}>
          <Text style={styles.navButtonText}>
            {learningMode === 'alphabet' ? 'Start Words' : 'Next'}
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
  navButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});
