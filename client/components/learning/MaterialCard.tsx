import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface MaterialCardProps {
  material: {
    id: number;
    title: string;
    type: string;
    duration: string;
    thumbnailUrl: string;
    difficulty: string;
    description: string;
  };
}

export function MaterialCard({ material }: MaterialCardProps) {
  const getTypeIcon = () => {
    switch (material.type) {
      case 'video':
        return <Feather name="play" size={16} color="white" />;
      case 'article':
        return <Feather name="book-open" size={16} color="white" />;
      case 'audio':
        return <Feather name="headphones" size={16} color="white" />;
      default:
        return <Feather name="play" size={16} color="white" />;
    }
  };
  
  
  const getTypeColor = () => {
    switch (material.type) {
      case 'video':
        return theme.colors.primary;
      case 'article':
        return theme.colors.secondary;
      case 'audio':
        return theme.colors.accent;
      default:
        return theme.colors.primary;
    }
  };
  
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: material.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={[styles.typeTag, { backgroundColor: getTypeColor() }]}>
          {getTypeIcon()}
          <Text style={styles.typeText}>{material.type}</Text>
        </View>
        <View style={styles.durationTag}>
          <Text style={styles.durationText}>{material.duration}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {material.title}
        </Text>
        
        <View style={styles.detailsRow}>
          <View style={[styles.difficultyTag, 
            { backgroundColor: 
              material.difficulty === 'beginner' 
                ? theme.colors.success + '20'
                : material.difficulty === 'intermediate'
                  ? theme.colors.warning + '20'
                  : theme.colors.error + '20'
            }
          ]}>
            <Text style={[
              styles.difficultyText,
              { color: 
                material.difficulty === 'beginner' 
                  ? theme.colors.success
                  : material.difficulty === 'intermediate'
                    ? theme.colors.warning
                    : theme.colors.error
              }
            ]}>
              {material.difficulty}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 135,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  typeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  durationTag: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'white',
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
    height: 44,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
});