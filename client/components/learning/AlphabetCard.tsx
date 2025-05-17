import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface AlphabetCardProps {
  data: {
    letter: string;
    latinized: string;
    example: string;
    exampleTranslation: string;
    pronunciation: string;
    audioUrl: string;
  };
  onNext: () => void;
}

export function AlphabetCard({ data, onNext }: AlphabetCardProps) {
  const [flipped, setFlipped] = useState(false);
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  const playAudio = () => {
    // In a real app, this would play the audio
    console.log('Playing audio:', data.audioUrl);
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleFlip}
      activeOpacity={0.9}
    >
      {!flipped ? (
        <View style={styles.frontContent}>
          <Text style={styles.letter}>{data.letter}</Text>
          <Text style={styles.latinized}>{data.latinized}</Text>
          
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={playAudio}
          >
            <Feather name="volume-2" size={24} color="black" />
            <Text style={styles.audioText}>Listen</Text>
          </TouchableOpacity>
          
          <Text style={styles.tapHint}>Tap to see more details</Text>
        </View>
      ) : (
        <View style={styles.backContent}>
          <View style={styles.headerRow}>
            <Text style={styles.letterSmall}>{data.letter}</Text>
            <Text style={styles.latinizedSmall}>{data.latinized}</Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Pronunciation:</Text>
            <Text style={styles.detailValue}>{data.pronunciation}</Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <Text style={styles.detailLabel}>Example:</Text>
            <Text style={styles.detailValue}>{data.example}</Text>
            <Text style={styles.detailTranslation}>{data.exampleTranslation}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={playAudio}
          >
            <Feather name="volume-2" size={24} color="black" />
            <Text style={styles.audioText}>Listen</Text>
          </TouchableOpacity>
          
          <Text style={styles.tapHint}>Tap to go back</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    aspectRatio: 3/4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  frontContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  letter: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 80,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  latinized: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 32,
    color: theme.colors.text,
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  letterSmall: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 40,
    color: theme.colors.primary,
    marginRight: 16,
  },
  latinizedSmall: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: theme.colors.text,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: theme.colors.text,
  },
  detailTranslation: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral100,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  audioText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 8,
  },
  tapHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textTertiary,
    marginTop: 16,
    textAlign: 'center',
  },
});