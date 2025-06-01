import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useAppContext } from '@/contexts/AppContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { Header } from '@/components/ui/Header';
import { theme } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { generateSpeakingPrompt, getVoiceFeedback } from '@/api/ai';


export default function SpeakingScreen() {
  const { isLoggedIn, userProfile } = useAppContext();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'ai'; timestamp: Date }>>([]);
  const [prompt, setPrompt] = useState<{ text: string; translation: string } | null>(null);
  const [feedback, setFeedback] = useState<null | { accuracy: number; feedback: string }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userProfile.nativeLanguage || !userProfile.targetLanguage) {
      setShowLanguageSelector(true);
    } else {
      fetchNewPrompt();
    }
  }, [userProfile]);

  const fetchNewPrompt = async () => {
    setLoading(true);
    try {
      const res = await generateSpeakingPrompt('beginner', 'greetings');
      setPrompt(res);
      setMessages([{ text: "Hello! I'm your speaking practice assistant. Try saying the phrase below.", sender: 'ai', timestamp: new Date() }]);
    } catch (err) {
      console.error('Failed to load prompt:', err);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setTimeout(stopRecording, 3000);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (!prompt) return;

    const accuracy = Math.floor(Math.random() * 31) + 70;
    setMessages(prev => [...prev, { text: prompt.text, sender: 'user', timestamp: new Date() }]);

    try {
      const fb = await getVoiceFeedback(prompt.text, accuracy);
      setFeedback(fb);
      setMessages(prev => [...prev, { text: fb.feedback, sender: 'ai', timestamp: new Date() }]);
    } catch (err) {
      console.error('Feedback error:', err);
    }
  };

  if (!isLoggedIn) return <LoginModal />;
  if (showLanguageSelector) return <LanguageSelector onComplete={() => setShowLanguageSelector(false)} />;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Speaking Practice" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          <>
            {prompt && (
              <View style={styles.promptContainer}>
                <Text style={styles.promptLabel}>Repeat this phrase:</Text>
                <Text style={styles.promptText}>{prompt.text}</Text>
                <Text style={styles.promptTranslation}>{prompt.translation}</Text>
              </View>
            )}

            <View style={styles.chatContainer}>
              {messages.map((msg, idx) => (
                <View
                  key={idx}
                  style={[styles.message, msg.sender === 'user' ? styles.userMessage : styles.aiMessage]}
                >
                  <Text style={styles.messageText}>{msg.text}</Text>
                  <Text style={styles.timestamp}>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              ))}
            </View>

            {feedback && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackTitle}>Feedback: {feedback.accuracy}%</Text>
                <Text>{feedback.feedback}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingButton]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Feather name={isRecording ? 'mic-off' : 'mic'} color="white" size={24} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={fetchNewPrompt}>
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
  scrollView: {
    flexGrow: 1,
    padding: 16,
  },
  promptContainer: {
    marginBottom: 16,
  },
  promptLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  promptText: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 22,
    color: theme.colors.text,
  },
  promptTranslation: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  chatContainer: {
    marginVertical: 16,
  },
  message: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
  },
  userMessage: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: theme.colors.neutral100,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  feedbackContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
  },
  feedbackTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 8,
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
    marginRight: 16,
  },
  recordingButton: {
    backgroundColor: theme.colors.error,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
});