import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '@/contexts/AppContext';
import { Header } from '@/components/ui/Header';
import { theme } from '@/constants/theme';
import { languageTopics, preferredTimes } from '@/constants/exploreData';

interface ScheduleSelectorProps {
  onComplete: () => void;
}

export function ScheduleSelector({ onComplete }: ScheduleSelectorProps) {
  const { updateUserPreferences } = useAppContext();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sessionLength, setSessionLength] = useState('15');
  const [daysPerWeek, setDaysPerWeek] = useState('3');
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save preferences
      updateUserPreferences({
        topicId: selectedTopic,
        preferredTime: selectedTime,
        sessionLengthMinutes: parseInt(sessionLength),
        daysPerWeek: parseInt(daysPerWeek)
      });
      onComplete();
    }
  };
  
  const renderTopicItem = ({ item }: { item: typeof languageTopics[0] }) => {
    const isSelected = item.id === selectedTopic;
    
    return (
      <TouchableOpacity 
        style={[
          styles.optionItem,
          isSelected && styles.selectedOptionItem
        ]}
        onPress={() => setSelectedTopic(item.id)}
      >
        <Text style={styles.optionText}>{item.name}</Text>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
             <Feather name="check" size={24} color="black" />
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  const renderTimeItem = ({ item }: { item: typeof preferredTimes[0] }) => {
    const isSelected = item.value === selectedTime;
    
    return (
      <TouchableOpacity 
        style={[
          styles.optionItem,
          isSelected && styles.selectedOptionItem
        ]}
        onPress={() => setSelectedTime(item.value)}
      >
        <View style={styles.timeItemContent}>
        <Feather name="calendar" size={24} color="black" />
          <Text style={styles.optionText}>{item.label}</Text>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Feather name="check" size={24} color="black" />
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="Schedule Your Learning"
        showBackButton={true}
        showSettings={false}
      />
      
      <View style={styles.progressContainer}>
        <View style={[
          styles.progressStep,
          { backgroundColor: theme.colors.primary }
        ]} />
        <View style={[
          styles.progressStep,
          { backgroundColor: step >= 2 ? theme.colors.primary : theme.colors.neutral300 }
        ]} />
        <View style={[
          styles.progressStep,
          { backgroundColor: step >= 3 ? theme.colors.primary : theme.colors.neutral300 }
        ]} />
      </View>
      
      <View style={styles.content}>
        {step === 1 && (
          <>
            <Text style={styles.stepTitle}>What would you like to learn?</Text>
            <Text style={styles.stepDescription}>
              Choose a topic that interests you the most.
            </Text>
            
            <FlatList
              data={languageTopics}
              renderItem={renderTopicItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.optionsList}
            />
          </>
        )}
        
        {step === 2 && (
          <>
            <Text style={styles.stepTitle}>When do you prefer to study?</Text>
            <Text style={styles.stepDescription}>
              Select the time of day that works best for your schedule.
            </Text>
            
            <FlatList
              data={preferredTimes}
              renderItem={renderTimeItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.optionsList}
            />
          </>
        )}
        
        {step === 3 && (
          <>
            <Text style={styles.stepTitle}>How long and how often?</Text>
            <Text style={styles.stepDescription}>
              Set your session length and frequency.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Session length (minutes)</Text>
              <TextInput
                style={styles.input}
                value={sessionLength}
                onChangeText={setSessionLength}
                keyboardType="number-pad"
                placeholder="15"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Days per week</Text>
              <TextInput
                style={styles.input}
                value={daysPerWeek}
                onChangeText={setDaysPerWeek}
                keyboardType="number-pad"
                placeholder="3"
              />
            </View>
            
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Your Learning Plan</Text>
              
              <View style={styles.summaryItem}>
                <Feather name="calendar" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.summaryText}>
                  {daysPerWeek} days per week, {sessionLength} minutes each
                </Text>
              </View>
              
              <View style={styles.summaryItem}>
              <Feather name="calendar" size={24} color="black" />
                <Text style={styles.summaryText}>
                  {selectedTime === 'morning' 
                    ? 'Morning (6AM - 12PM)'
                    : selectedTime === 'afternoon'
                      ? 'Afternoon (12PM - 5PM)'
                      : selectedTime === 'evening'
                        ? 'Evening (5PM - 9PM)'
                        : 'Night (9PM - 12AM)'
                  }
                </Text>
              </View>
              
              <Text style={styles.weeklySummary}>
                Total: {parseInt(sessionLength) * parseInt(daysPerWeek)} minutes per week
              </Text>
            </View>
          </>
        )}
      </View>
      
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity 
          style={[
            styles.nextButton,
            (!selectedTopic && step === 1) || (!selectedTime && step === 2) 
              ? styles.disabledButton 
              : null
          ]}
          onPress={handleNext}
          disabled={(!selectedTopic && step === 1) || (!selectedTime && step === 2)}
        >
          <Text style={styles.nextButtonText}>
            {step < 3 ? 'Continue' : 'Save Schedule'}
          </Text>
          {step < 3 && <Feather name="chevron-right" size={20} color="white" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  progressStep: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  optionsList: {
    paddingBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...theme.shadows.sm,
  },
  selectedOptionItem: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 8,
  },
  timeItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    backgroundColor: theme.colors.neutral100,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: theme.colors.text,
  },
  summaryContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    ...theme.shadows.sm,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
  },
  weeklySummary: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 16,
  },
  disabledButton: {
    backgroundColor: theme.colors.neutral300,
  },
  nextButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
    marginRight: 8,
  },
});