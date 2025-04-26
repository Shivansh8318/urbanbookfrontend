import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

const StudentDashboard = ({ route, navigation }) => {
  const { userData } = route.params || {};

  const handleLogout = () => {
    // Navigate back to welcome screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8F0FE', '#F9FAFB']}
        style={StyleSheet.absoluteFill}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Animated.View
              style={styles.header}
              entering={FadeIn.delay(100).duration(500)}
            >
              <Text style={styles.title}>Student Dashboard</Text>
              <Text style={styles.subtitle}>
                Welcome back, {userData?.name || 'Student'}!
              </Text>
            </Animated.View>

            <Animated.View
              style={styles.card}
              entering={FadeInUp.delay(200).duration(500)}
            >
              <Text style={styles.cardTitle}>Your Courses</Text>
              <View style={styles.courseList}>
                <TouchableOpacity style={styles.courseItem}>
                  <Text style={styles.courseName}>Mathematics</Text>
                  <Text style={styles.courseInfo}>Progress: 75%</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.courseItem}>
                  <Text style={styles.courseName}>Physics</Text>
                  <Text style={styles.courseInfo}>Progress: 60%</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.courseItem}>
                  <Text style={styles.courseName}>Computer Science</Text>
                  <Text style={styles.courseInfo}>Progress: 85%</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View
              style={styles.card}
              entering={FadeInUp.delay(300).duration(500)}
            >
              <Text style={styles.cardTitle}>Upcoming Assignments</Text>
              <View style={styles.assignmentList}>
                <View style={styles.assignmentItem}>
                  <Text style={styles.assignmentName}>Physics Lab Report</Text>
                  <Text style={styles.assignmentInfo}>Due: Tomorrow</Text>
                </View>
                <View style={styles.assignmentItem}>
                  <Text style={styles.assignmentName}>Math Problem Set</Text>
                  <Text style={styles.assignmentInfo}>Due: In 3 days</Text>
                </View>
                <View style={styles.assignmentItem}>
                  <Text style={styles.assignmentName}>Programming Project</Text>
                  <Text style={styles.assignmentInfo}>Due: Next week</Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View
              style={styles.card}
              entering={FadeInUp.delay(400).duration(500)}
            >
              <Text style={styles.cardTitle}>Your Profile</Text>
              {userData && (
                <View style={styles.profileInfo}>
                  <Text style={styles.profileItem}>
                    <Text style={styles.profileLabel}>Name: </Text>
                    {userData.name || 'Not available'}
                  </Text>
                  <Text style={styles.profileItem}>
                    <Text style={styles.profileLabel}>ID: </Text>
                    {userData.user_id || 'Not available'}
                  </Text>
                  <Text style={styles.profileItem}>
                    <Text style={styles.profileLabel}>Contact: </Text>
                    {userData.identity_value || 'Not available'}
                  </Text>
                </View>
              )}
            </Animated.View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  courseList: {
    gap: 12,
  },
  courseItem: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  courseInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  assignmentList: {
    gap: 12,
  },
  assignmentItem: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  assignmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  assignmentInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  profileInfo: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 8,
  },
  profileItem: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  profileLabel: {
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentDashboard; 