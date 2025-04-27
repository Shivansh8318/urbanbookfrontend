import React, { useState, useEffect } from 'react';
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
     const [profileData, setProfileData] = useState(null);

     useEffect(() => {
       const fetchProfile = async () => {
         try {
           const baseUrl = 'http://172.20.10.3:8000/api/';
           const response = await fetch(`${baseUrl}student/get-profile/`, {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({ user_id: userData.user_id }),
           });
           const data = await response.json();
           setProfileData(data);
         } catch (error) {
           console.error('Error fetching profile:', error);
         }
       };

       fetchProfile();
     }, [userData]);

     const handleLogout = () => {
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
                   Welcome back, {profileData?.name || userData?.name || 'Student'}!
                 </Text>
               </Animated.View>

               {profileData && (
                 <Animated.View
                   style={styles.card}
                   entering={FadeInUp.delay(200).duration(500)}
                 >
                   <Text style={styles.cardTitle}>Your Profile</Text>
                   <View style={styles.profileInfo}>
                     <Text style={styles.profileItem}>
                       <Text style={styles.profileLabel}>Name: </Text>
                       {profileData.name || 'Not available'}
                     </Text>
                     <Text style={styles.profileItem}>
                       <Text style={styles.profileLabel}>Gender: </Text>
                       {profileData.gender || 'Not available'}
                     </Text>
                     <Text style={styles.profileItem}>
                       <Text style={styles.profileLabel}>Age: </Text>
                       {profileData.age || 'Not available'}
                     </Text>
                     <Text style={styles.profileItem}>
                       <Text style={styles.profileLabel}>Grade: </Text>
                       {profileData.grade || 'Not available'}
                     </Text>
                     <Text style={styles.profileItem}>
                       <Text style={styles.profileLabel}>School: </Text>
                       {profileData.school || 'Not available'}
                     </Text>
                   </View>
                 </Animated.View>
               )}

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