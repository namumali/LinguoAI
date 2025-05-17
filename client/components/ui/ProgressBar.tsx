import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing 
} from 'react-native-reanimated';
import { theme } from '@/constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
}

export function ProgressBar({ 
  progress, 
  height = 8, 
  backgroundColor = theme.colors.neutral200,
  progressColor = theme.colors.primary
}: ProgressBarProps) {
  const progressValue = useSharedValue(0);
  
  useEffect(() => {
    progressValue.value = withTiming(progress, { 
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress]);
  
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value * 100}%`
    };
  });
  
  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <Animated.View style={[
        styles.progressBar,
        { backgroundColor: progressColor },
        progressStyle
      ]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: 'hidden',
    flex: 1,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});