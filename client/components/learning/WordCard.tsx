import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface WordCardProps {
  data: {
    word: string;
    translation: string;
    pronunciation: string;
    englishPronunciation: string;
    partOfSpeech: string;
    example: string;
    exampleTranslation: string;
    audioUrl: string;
    imageUrl: string;
  };
  onNext: () => void;
}

export function WordCard({ data, onNext }: WordCardProps) {
  const [showExample, setShowExample] = useState(false);
  
  const playAudio = () => {
    // In a real app, this would play the audio
    console.log('Playing audio:', data.audioUrl);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: data.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.word}>{data.word}</Text>
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={playAudio}
          >
            <Feather name="volume-2" size={24} color="black" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.translation}>{data.translation}</Text>
        
        <View style={styles.pronunciationContainer}>
          <Text style={styles.pronunciationLabel}>Pronunciation:</Text>
          <Text style={styles.pronunciation}>{data.pronunciation}</Text>
          <Text style={styles.pronunciationGuide}>{data.englishPronunciation}</Text>
        </View>
        
        <Text style={styles.partOfSpeech}>{data.partOfSpeech}</Text>
        
        <TouchableOpacity 
          style={styles.exampleButton}
          onPress={() => setShowExample(!showExample)}
        >
          <Text style={styles.exampleButtonText}>
            {showExample ? 'Hide Example' : 'Show Example'}
          </Text>
          {showExample 
            ? <Feather name="chevron-up" size={24} color="black" />
            : <Feather name="chevron-down" size={24} color="black" />
          }
        </TouchableOpacity>
        
        {showExample && (
          <View style={styles.exampleContainer}>
            <Text style={styles.example}>{data.example}</Text>
            <Text style={styles.exampleTranslation}>{data.exampleTranslation}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  word: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 28,
    color: theme.colors.text,
  },
  audioButton: {
    padding: 8,
    backgroundColor: theme.colors.neutral100,
    borderRadius: 20,
  },
  translation: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  pronunciationContainer: {
    backgroundColor: theme.colors.neutral100,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  pronunciationLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  pronunciation: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 18,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  pronunciationGuide: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  partOfSpeech: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  exampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  exampleButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.primary,
    marginRight: 4,
  },
  exampleContainer: {
    backgroundColor: theme.colors.neutral100,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  example: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  exampleTranslation: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});