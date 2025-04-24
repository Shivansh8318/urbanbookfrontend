import React, { useState, useEffect, Platform } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  NativeEventEmitter,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { OtplessHeadlessModule } from 'otpless-headless-rn';

const { width, height } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Define types for OTPLESS response
const AuthScreen = ({ route, navigation }) => {
  const { role } = route.params || { role: 'Student' };
  console.log("AuthScreen is loading with app ID: 9DRP3BQPAKLIZYTVT2JS");
  const headlessModule = new OtplessHeadlessModule();
  
  const [authMethod, setAuthMethod] = useState(null);
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize the OTPless module with your App ID
    headlessModule.initialize("9DRP3BQPAKLIZYTVT2JS");
    
    // Set response callback for OTPless module
    headlessModule.setResponseCallback(onHeadlessResult);
    
    // Create event emitter for OTPless module (for backwards compatibility)
    const eventEmitter = new NativeEventEmitter(OtplessHeadlessModule);
    
    // Listen for OTPLESS responses (for backwards compatibility)
    const otplessListener = eventEmitter.addListener('OtplessEvent', (response) => {
      console.log('OTPLESS Response (legacy event):', response);
    });

    // Clean up listener
    return () => {
      otplessListener.remove();
      headlessModule.clearListener();
      headlessModule.cleanup();
    };
  }, []);

  const onHeadlessResult = (result) => {
    console.log('Received OTPless result:', result);
    headlessModule.commitResponse(result);
    const responseType = result.responseType;

    switch (responseType) {
      case "SDK_READY": {
        // Notify that SDK is ready
        console.log("SDK is ready");
        setIsLoading(false);
        break;
      }
      case "FAILED": {
        console.log("SDK initialization failed");
        setIsLoading(false);
        Alert.alert('Error', 'SDK initialization failed');
        break;
      }
      case "INITIATE": {
        // Notify that headless authentication has been initiated
        setIsLoading(false);
        if (result.statusCode == 200) {
          console.log("Headless authentication initiated");
          const authType = result.response.authType; // This is the authentication type
          if (authType === "OTP") {
            // Take user to OTP verification screen
            setIsOtpSent(true);
            Alert.alert('Success', 'OTP sent successfully');
          } else if (authType === "SILENT_AUTH") {
            // Handle Silent Authentication initiation
            console.log("Silent Authentication initiated");
          }
        } else {
          // Handle initiation error
          console.log("Initiation error:", result.response);
          if (Platform.OS === 'android') {
            handleInitiateErrorAndroid(result.response);
          } else {
            Alert.alert('Error', result.response?.errorMessage || 'Failed to initiate authentication');
          }
        }
        break;
      }
      case "OTP_AUTO_READ": {
        // OTP_AUTO_READ is triggered only in Android devices for WhatsApp and SMS.
        if (Platform.OS === "android") {
          const otpValue = result.response.otp;
          console.log(`OTP Received: ${otpValue}`);
          setOtp(otpValue);
        }
        break;
      }
      case "VERIFY": {
        setIsLoading(false);
        // Handle verification result
        if (result.statusCode === 200) {
          // Verification successful
          console.log("Verification successful:", result.response);
          handleAuthSuccess(result.response);
        } else {
          // Verification failed
          if (result.response.authType === "SILENT_AUTH") {
            if (result.statusCode === 9106) {
              // Silent Authentication and all fallback methods failed
              Alert.alert('Error', 'Authentication failed. Please try another method.');
            } else {
              // Silent Authentication failed, other methods may be available
              console.log("Silent auth failed, other methods may be available");
            }
          } else {
            // Handle verification error
            if (Platform.OS === 'android') {
              handleVerifyErrorAndroid(result.response);
            } else {
              Alert.alert('Error', 'Verification failed. Please try again.');
            }
          }
        }
        break;
      }
      case "DELIVERY_STATUS": {
        // This function is called when delivery is successful for your authType.
        const authType = result.response.authType;
        const deliveryChannel = result.response.deliveryChannel;
        console.log(`Delivery successful for ${authType} via ${deliveryChannel}`);
        break;
      }
      case "ONETAP": {
        setIsLoading(false);
        const token = result.response.token;
        if (token != null) {
          console.log(`OneTap Data: ${token}`);
          handleAuthSuccess({ token });
        }
        break;
      }
      case "FALLBACK_TRIGGERED": {
        // A fallback occurs when an OTP delivery attempt on one channel fails
        if (result.response.deliveryChannel != null) {
          const newDeliveryChannel = result.response.deliveryChannel;
          console.log(`Fallback to ${newDeliveryChannel}`);
          Alert.alert('Info', `OTP delivery failed. Trying via ${newDeliveryChannel}...`);
        }
        break;
      }
      default: {
        setIsLoading(false);
        console.warn(`Unknown response type: ${responseType}`);
        break;
      }
    }
  };

  const handleInitiateErrorAndroid = (response) => {
    const errorCode = response?.errorCode;
    const errorMessage = response?.errorMessage;

    if (!errorCode) {
      Alert.alert("Error", errorMessage || "Unknown error");
      return;
    }

    switch (errorCode) {
      case "7101":
        Alert.alert("Error", "Invalid parameters values or missing parameters");
        break;
      case "7102":
        Alert.alert("Error", "Invalid phone number");
        break;
      case "7103":
        Alert.alert("Error", "Invalid phone number delivery channel");
        break;
      case "7104":
        Alert.alert("Error", "Invalid email");
        break;
      case "7105":
        Alert.alert("Error", "Invalid email channel");
        break;
      case "7106":
        Alert.alert("Error", "Invalid phone number or email");
        break;
      case "401":
      case "7025":
        Alert.alert("Error", "Unauthorized request or country not enabled");
        break;
      case "9100":
      case "9104":
      case "9103":
        Alert.alert("Error", "Network connectivity error");
        break;
      default:
        Alert.alert("Error", errorMessage || "Unknown error");
    }
  };

  const handleVerifyErrorAndroid = (response) => {
    const errorCode = response?.errorCode;
    const errorMessage = response?.errorMessage;

    Alert.alert("Verification Failed", errorMessage || "Please try again");
  };

  const handleAuthSuccess = (data) => {
    // Process user data and navigate to next screen
    setUserData(data);
    Alert.alert('Authentication Successful', 'You have successfully signed in!', [
      {
        text: 'OK',
        onPress: () => {
          // Navigate to appropriate screen based on role
          // For now, just go back to role selection
          navigation.goBack();
        },
      },
    ]);
  };

  const resetForm = () => {
    setAuthMethod(null);
    setIsOtpSent(false);
    setOtp('');
  };

  // Start phone authentication
  const startPhoneAuth = () => {
    if (!phoneNumber || !countryCode) {
      Alert.alert('Error', 'Please enter phone number and country code');
      return;
    }
    
    setIsLoading(true);
    
    const request = {
      phone: phoneNumber,
      countryCode
    };
    
    console.log("Starting phone auth with:", request);
    headlessModule.start(request);
  };

  // Start email authentication
  const startEmailAuth = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter email address');
      return;
    }
    
    setIsLoading(true);
    
    const request = {
      email
    };
    
    console.log("Starting email auth with:", request);
    headlessModule.start(request);
  };

  // Start OAuth authentication
  const startOAuth = (channel) => {
    setIsLoading(true);
    
    const request = { 
      channelType: channel 
    };
    
    console.log("Starting OAuth auth with:", request);
    headlessModule.start(request);
  };

  // Verify OTP
  const verifyOtp = () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    setIsLoading(true);

    const request = {
      otp,
      // For phone or email based on what was used
      ...(authMethod === 'phone' 
        ? { phone: phoneNumber, countryCode } 
        : { email })
    };
    
    console.log("Verifying OTP with:", request);
    headlessModule.verify(request);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F9FAFB']}
        style={StyleSheet.absoluteFill}
      >
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <Animated.Text 
                style={styles.title}
                entering={FadeIn.delay(100).duration(500)}
              >
                {`${role} Sign In`}
              </Animated.Text>
            </View>

            <Animated.View
              style={styles.authContainer}
              entering={FadeInUp.delay(200).duration(500)}
            >
              {isLoading && (
                <View style={styles.loadingText}>
                  <Text style={styles.subtitle}>Please wait...</Text>
                </View>
              )}

              {!isLoading && !authMethod && (
                <>
                  <Text style={styles.subtitle}>
                    Choose a sign in method:
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.authButton}
                    onPress={() => setAuthMethod('phone')}
                  >
                    <Text style={styles.authButtonText}>Sign in with Phone</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.authButton}
                    onPress={() => setAuthMethod('email')}
                  >
                    <Text style={styles.authButtonText}>Sign in with Email</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.authButton, { backgroundColor: '#4285F4' }]}
                    onPress={() => startOAuth('GMAIL')}
                  >
                    <Text style={styles.authButtonText}>Sign in with Google</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.authButton, { backgroundColor: '#000000' }]}
                    onPress={() => startOAuth('APPLE')}
                  >
                    <Text style={styles.authButtonText}>Sign in with Apple</Text>
                  </TouchableOpacity>
                </>
              )}

              {!isLoading && authMethod === 'phone' && !isOtpSent && (
                <>
                  <Text style={styles.subtitle}>Enter your phone number:</Text>
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Country Code (e.g., +91)"
                    placeholderTextColor="#9ca3af"
                    value={countryCode}
                    onChangeText={setCountryCode}
                    keyboardType="phone-pad"
                  />
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#9ca3af"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                  
                  <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={startPhoneAuth}
                  >
                    <Text style={styles.buttonText}>Send OTP</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.buttonSecondary}
                    onPress={resetForm}
                  >
                    <Text style={styles.buttonSecondaryText}>Back</Text>
                  </TouchableOpacity>
                </>
              )}

              {!isLoading && authMethod === 'email' && !isOtpSent && (
                <>
                  <Text style={styles.subtitle}>Enter your email address:</Text>
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  
                  <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={startEmailAuth}
                  >
                    <Text style={styles.buttonText}>Send OTP</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.buttonSecondary}
                    onPress={resetForm}
                  >
                    <Text style={styles.buttonSecondaryText}>Back</Text>
                  </TouchableOpacity>
                </>
              )}

              {!isLoading && isOtpSent && (authMethod === 'phone' || authMethod === 'email') && (
                <>
                  <Text style={styles.subtitle}>
                    Enter the OTP sent to your {authMethod === 'phone' ? 'phone' : 'email'}:
                  </Text>
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    placeholderTextColor="#9ca3af"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                  />
                  
                  <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={verifyOtp}
                  >
                    <Text style={styles.buttonText}>Verify OTP</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.buttonSecondary}
                    onPress={() => {
                      setIsOtpSent(false);
                      setOtp('');
                    }}
                  >
                    <Text style={styles.buttonSecondaryText}>Back</Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginVertical: 20,
    position: 'relative',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 0,
    zIndex: 10,
  },
  backButtonText: {
    color: '#111827',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  authContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  authButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonPrimary: {
    width: '100%',
    height: 50,
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonSecondaryText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    padding: 20,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
  },
  socialButton: {
    width: '48%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  socialButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  orText: {
    color: '#6B7280',
    fontSize: 16,
    marginVertical: 15,
    textAlign: 'center',
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  linkText: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
});

export default AuthScreen; 