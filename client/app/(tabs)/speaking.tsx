// SpeakingScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { useAppContext } from '@/contexts/AppContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { Header } from '@/components/ui/Header';
import { theme } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { speakingPrompts } from '@/constants/speakingData';

export default function SpeakingScreen() {
  const { isLoggedIn, userProfile } = useAppContext();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'ai', timestamp: Date}>>([]);
  const [feedback, setFeedback] = useState<null | { accuracy: number; feedback: string }>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    if (!userProfile.nativeLanguage || !userProfile.targetLanguage) {
      setShowLanguageSelector(true);
    } else {
      setMessages([{
        text: "Hello! I'm your speaking practice assistant. Try saying the phrase below.",
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [isLoggedIn, userProfile]);

  if (!isLoggedIn) return <LoginModal />;
  if (showLanguageSelector) return <LanguageSelector onComplete={() => setShowLanguageSelector(false)} />;

  const startRecording = () => {
    setIsRecording(true);
    setTimeout(stopRecording, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    const promptText = speakingPrompts[currentPrompt].text;
    setMessages(prev => [...prev, { text: promptText, sender: 'user', timestamp: new Date() }]);

    setTimeout(() => {
      const accuracy = Math.floor(Math.random() * 31) + 70;
      const fb = {
        accuracy,
        feedback:
          accuracy > 90
            ? "Excellent pronunciation!"
            : accuracy > 80
            ? "Good job! Work on your intonation."
            : "You're getting there. Let's practice more."
      };

      setFeedback(fb);
      setMessages(prev => [
        ...prev,
        {
          text: `${fb.feedback} ${
            accuracy > 90
              ? 'Your accent sounds very natural.'
              : accuracy > 80
              ? 'Try emphasizing the stressed syllables more.'
              : 'Focus on the rhythm of the sentence.'
          }`,
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }, 1000);
  };

  const handleNextPrompt = () => {
    setFeedback(null);
    setCurrentPrompt((currentPrompt + 1) % speakingPrompts.length);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Speaking Practice" />

      <View style={styles.promptContainer}>
        <Text style={styles.promptLabel}>Repeat this phrase:</Text>
        <Text style={styles.promptText}>{speakingPrompts[currentPrompt].text}</Text>
        <Text style={styles.promptTranslation}>{speakingPrompts[currentPrompt].translation}</Text>
      </View>

      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={[styles.messageContainer, msg.sender === 'user' ? styles.userMessage : styles.aiMessage]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
            <Text style={styles.timestamp}>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        ))}
      </ScrollView>

      {feedback && (
        <Animated.View style={styles.feedbackContainer}>
          <View style={styles.feedbackHeader}>
            <Text style={styles.feedbackTitle}>Pronunciation Feedback</Text>
            <Text style={styles.accuracyText}>{feedback.accuracy}% accuracy</Text>
          </View>

          <View style={styles.accuracyBarContainer}>
            <View
              style={[
                styles.accuracyBar,
                { width: `${feedback.accuracy}%` },
                feedback.accuracy > 90
                  ? styles.excellentAccuracy
                  : feedback.accuracy > 80
                  ? styles.goodAccuracy
                  : styles.okayAccuracy
              ]}
            />
          </View>

          <Text style={styles.feedbackText}>{feedback.feedback}</Text>

          <TouchableOpacity style={styles.nextButton} onPress={handleNextPrompt}>
            <Text style={styles.nextButtonText}>Continue</Text>
            <Feather name="check" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingButton]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Feather name={isRecording ? "mic-off" : "mic"} color="white" size={24} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleNextPrompt}>
          <Feather name="rotate-ccw" size={24} color="black" />
          <Text style={styles.skipButtonText}>Skip</Text>
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
  promptContainer: {
    backgroundColor: theme.colors.card,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  promptLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  promptText: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 22,
    color: theme.colors.text,
    marginBottom: 8,
  },
  promptTranslation: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingBottom: 16,
  },
  messageContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: theme.colors.neutral100,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.text,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  feedbackContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
  },
  accuracyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.success,
  },
  accuracyBarContainer: {
    height: 8,
    backgroundColor: theme.colors.neutral200,
    borderRadius: 4,
    marginBottom: 12,
  },
  accuracyBar: {
    height: 8,
    borderRadius: 4,
  },
  excellentAccuracy: {
    backgroundColor: theme.colors.success,
  },
  goodAccuracy: {
    backgroundColor: theme.colors.warning,
  },
  okayAccuracy: {
    backgroundColor: theme.colors.error,
  },
  feedbackText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  recordButton: {
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  recordingButton: {
    backgroundColor: theme.colors.error,
    transform: [{ scale: 1.1 }],
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 16,
  },
  skipButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
});