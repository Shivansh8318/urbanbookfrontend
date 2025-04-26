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

const TeacherDashboard = ({ route, navigation }) => {
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
        colors={['#E8F5E9', '#F9FAFB']}
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
              <Text style={styles.title}>Teacher Dashboard</Text>
              <Text style={styles.subtitle}>
                Welcome back, {userData?.name || 'Teacher'}!
              </Text>
            </Animated.View>

            <Animated.View
              style={styles.card}
              entering={FadeInUp.delay(200).duration(500)}
            >
              <Text style={styles.cardTitle}>Your Classes</Text>
              <View style={styles.classList}>
                <TouchableOpacity style={styles.classItem}>
                  <Text style={styles.className}>Mathematics 101</Text>
                  <Text style={styles.classInfo}>28 students | Grade 10</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.classItem}>
                  <Text style={styles.className}>Physics 202</Text>
                  <Text style={styles.classInfo}>24 students | Grade 11</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.classItem}>
                  <Text style={styles.className}>Advanced Computer Science</Text>
                  <Text style={styles.classInfo}>18 students | Grade 12</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View
              style={styles.card}
              entering={FadeInUp.delay(300).duration(500)}
            >
              <Text style={styles.cardTitle}>Upcoming Schedule</Text>
              <View style={styles.scheduleList}>
                <View style={styles.scheduleItem}>
                  <Text style={styles.scheduleName}>Mathematics 101</Text>
                  <Text style={styles.scheduleInfo}>Today, 9:00 AM - 10:30 AM</Text>
                </View>
                <View style={styles.scheduleItem}>
                  <Text style={styles.scheduleName}>Physics 202</Text>
                  <Text style={styles.scheduleInfo}>Today, 1:00 PM - 2:30 PM</Text>
                </View>
                <View style={styles.scheduleItem}>
                  <Text style={styles.scheduleName}>Staff Meeting</Text>
                  <Text style={styles.scheduleInfo}>Tomorrow, 3:00 PM</Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View
              style={styles.card}
              entering={FadeInUp.delay(400).duration(500)}
            >
              <Text style={styles.cardTitle}>Pending Actions</Text>
              <View style={styles.actionList}>
                <TouchableOpacity style={styles.actionItem}>
                  <Text style={styles.actionName}>Grade Physics Reports</Text>
                  <Text style={styles.actionInfo}>24 submissions pending</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem}>
                  <Text style={styles.actionName}>Math Quiz Preparation</Text>
                  <Text style={styles.actionInfo}>Due in 2 days</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem}>
                  <Text style={styles.actionName}>Parent-Teacher Meetings</Text>
                  <Text style={styles.actionInfo}>Schedule for next week</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View
              style={styles.card}
              entering={FadeInUp.delay(500).duration(500)}
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
                  <Text style={styles.profileItem}>
                    <Text style={styles.profileLabel}>Subject: </Text>
                    {userData.subject || 'Multiple Subjects'}
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
  classList: {
    gap: 12,
  },
  classItem: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  classInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  scheduleList: {
    gap: 12,
  },
  scheduleItem: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  scheduleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  scheduleInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionList: {
    gap: 12,
  },
  actionItem: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  actionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionInfo: {
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

export default TeacherDashboard; 