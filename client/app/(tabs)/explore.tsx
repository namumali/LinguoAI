import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { useAppContext } from '@/contexts/AppContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { MaterialCard } from '@/components/learning/MaterialCard';
import { ScheduleSelector } from '@/components/schedule/ScheduleSelector';
import { Header } from '@/components/ui/Header';
import { theme } from '@/constants/theme';
import { learningMaterials, userProgressData, upcomingSchedule } from '@/constants/exploreData';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const { isLoggedIn, userProfile } = useAppContext();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showScheduleSelector, setShowScheduleSelector] = useState(false);

  useEffect(() => {
    if (isLoggedIn && !userProfile.nativeLanguage) {
      setShowLanguageSelector(true);
    }
  }, [isLoggedIn, userProfile]);

  if (!isLoggedIn) {
    return <LoginModal />;
  }

  if (showLanguageSelector) {
    return <LanguageSelector onComplete={() => setShowLanguageSelector(false)} />;
  }

  if (showScheduleSelector) {
    return <ScheduleSelector onComplete={() => setShowScheduleSelector(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Explore" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [
                  {
                    data: userProgressData.weeklyProgress
                  }
                ]
              }}
              width={width - 32}
              height={180}
              chartConfig={{
                backgroundColor: theme.colors.card,
                backgroundGradientFrom: theme.colors.card,
                backgroundGradientTo: theme.colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(62, 100, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: theme.colors.primary
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProgressData.totalLessons}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProgressData.wordsLearned}</Text>
              <Text style={styles.statLabel}>Words</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProgressData.daysStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Materials</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.materialsContainer}
          >
            {learningMaterials.map((material, index) => (
              <MaterialCard key={index} material={material} />
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
            <TouchableOpacity onPress={() => setShowScheduleSelector(true)}>
              <Text style={styles.seeAllText}>Set Schedule</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingSchedule.length > 0 ? (
            <View style={styles.scheduleContainer}>
              {upcomingSchedule.map((item, index) => (
                <View key={index} style={styles.scheduleItem}>
                  <View style={styles.scheduleIconContainer}>
                  <Feather name="calendar" size={24} color="black" />
                  </View>
                  <View style={styles.scheduleDetails}>
                    <Text style={styles.scheduleTitle}>{item.title}</Text>
                    <Text style={styles.scheduleTime}>
                      {item.day} • {item.time}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.scheduleAction}>
                    <Feather name="clock" size={24} color="black" />
                    <Text style={styles.scheduleActionText}>Remind</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptySchedule}>
              <Feather name="book-open" size={24} color="black" />
              <Text style={styles.emptyScheduleText}>
                No scheduled sessions yet.
              </Text>
              <TouchableOpacity 
                style={styles.scheduleButton}
                onPress={() => setShowScheduleSelector(true)}
              >
                <Text style={styles.scheduleButtonText}>Schedule a Session</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: theme.colors.text,
  },
  seeAllText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.primary,
  },
  chartContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 20,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  materialsContainer: {
    paddingBottom: 8,
  },
  scheduleContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  scheduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  scheduleTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  scheduleAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral100,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  scheduleActionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: 4,
  },
  emptySchedule: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyScheduleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  scheduleButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  scheduleButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
});