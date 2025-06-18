import { Text, View, TouchableOpacity, StyleSheet, TextInput, Linking, Touchable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

declare global {
    var loginSuccess: boolean | undefined;
}

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showFaceIdButton, setShowFaceIdButton] = useState(false);

    useEffect(() => {
        const checkFaceIdSetting = async () => {
            const setting = await SecureStore.getItemAsync('use_face_id');
            if (setting === 'true') setShowFaceIdButton(true);
        };
        checkFaceIdSetting();
    }, []);

    const handleLogin = async () => {
        setErrorMessage('');
        globalThis.loginSuccess = false;
      
        try {
          const response = await axios.post('https://mypassvault.onrender.com/api/login/', {
            email: email.toLowerCase(),
            password: password,
          });
      
          const access = response.data.access || response.data.token;
          const refresh = response.data.refresh;
      
          if (access) {
            await AsyncStorage.setItem('token', access);
            if (refresh) {
              await AsyncStorage.setItem('refresh_token', refresh);
            }
      
            const profileRes = await fetch('https://mypassvault.onrender.com/api/profile/', {
              headers: { Authorization: `Bearer ${access}` },
            });
            const profileData = await profileRes.json();
      
            await AsyncStorage.setItem('email', profileData.email || '');
            await AsyncStorage.setItem('first_name', profileData.first_name || '');
            await AsyncStorage.setItem('last_name', profileData.last_name || '');
            await SecureStore.setItemAsync('email', email.toLowerCase());
            await SecureStore.setItemAsync('password', password);
      
            globalThis.loginSuccess = true;
      
            navigation.navigate('Loading');

            Alert.alert(
                "Enable Face ID?",
                "Would you like to use Face ID for faster login next time?",
                [
                    {
                        text: "No",
                        style: "cancel",
                        onPress: async () => {
                            await SecureStore.deleteItemAsync('use_face_id');
                        },
                    },
                    {
                        text: "Yes",
                        onPress: async () => {
                            await SecureStore.setItemAsync('use_face_id', 'true');
                        },
                    },
                ]
            );

          } else {
            setErrorMessage('Unexpected error, please try again.');
          }
      
        } catch (error: any) {
          globalThis.loginSuccess = false;
      
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || 'Invalid credentials.');
            } else {
                setErrorMessage('Network error. Please try again.');
            }
        }
    };

    const biometricLogin = async (savedEmail: string, savedPassword: string) => {
        try {
            const response = await axios.post('https://mypassvault.onrender.com/api/login/', {
                email: savedEmail.toLowerCase(),
                password: savedPassword,
            });

            navigation.navigate('Loading');
            const access = response.data.access || response.data.token;
            const refresh = response.data.refresh;
      
            if (access) {
                await AsyncStorage.setItem('token', access);
                if (refresh) await AsyncStorage.setItem('refresh_token', refresh);
        
                const profileRes = await fetch('https://mypassvault.onrender.com/api/profile/', {
                    headers: { Authorization: `Bearer ${access}` },
                });
                const profileData = await profileRes.json();
      
                await AsyncStorage.setItem('email', profileData.email || '');
                await AsyncStorage.setItem('first_name', profileData.first_name || '');
                await AsyncStorage.setItem('last_name', profileData.last_name || '');
      
                globalThis.loginSuccess = true;
                navigation.navigate('Dashboard');
            } else {
                console.error('Biometric login failed: Token not found');
            }
        } catch (err) {
            console.error('Biometric login error:', err);
        }
    };
      

    const authenticate = async () => {
        console.log("Face ID attempt started");
      
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        const supportsFaceId = supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
      
        console.log("Face ID checks:", { hasHardware, isEnrolled, supportedTypes });
      
        if (hasHardware && isEnrolled && supportsFaceId) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Login with Face ID',
                fallbackLabel: '',
                disableDeviceFallback: false,
            });
      
            console.log("Face ID auth result:", result);
      
            if (result.success) {
                const savedEmail = await SecureStore.getItemAsync('email');
                const savedPassword = await SecureStore.getItemAsync('password');
                if (savedEmail && savedPassword) {
                    biometricLogin(savedEmail, savedPassword);
                } else {
                    console.log('No saved credentials');
                    setErrorMessage('No saved credentials found. Please login manually first.');
                }

            } else {
                if (result.error === 'user_cancel') {
                    console.log('User cancelled Face ID');
                    setErrorMessage('Authentication cancelled.');
                } else {
                    console.log('Authentication failed');
                    setErrorMessage('Face ID authentication failed. Please try again.');
                }
            }
        } else {
            console.log('Face ID not supported');
            setErrorMessage('Face ID is not supported or not set up on this device.');
        }
    };
      
      
    return (
        <LinearGradient colors={['#7C3AED', '#4C1D95']} style={{ flex: 1, paddingHorizontal: 20, paddingTop: 50 }}>

            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View style={{ paddingTop: 50 }}>
                {/* Title */}
                <Text style={styles.title}>Login to your account</Text>

                {/* Form Fields */}
                <View style={{ gap: 20 }}>
                    <TextInput placeholder="Email address" placeholderTextColor="#d1d5db" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none"/>
                    <TextInput placeholder="Password" placeholderTextColor="#d1d5db" value={password} onChangeText={setPassword} secureTextEntry style={styles.input}/>
                </View>

                {/* Error Message */}
                {errorMessage !== '' && (
                    <Text style={styles.errorText}>
                        {errorMessage}
                    </Text>
                )}

                {/* <TouchableOpacity onPress={() => navigation.navigate("reset-password")} style={{marginTop: 20, }}>
                    <Text className="text-white text-center" style={{textDecorationLine: 'underline'}}>Forgot password?</Text>
                </TouchableOpacity> */}

                {/* Login Button */}
                <View style={{ alignItems: 'center', marginTop: 40, gap: 15 }}>
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text className="text-purple-700 font-semibold">Login</Text>
                    </TouchableOpacity>
                    
                    {showFaceIdButton && (
                        <>
                            <Text className="text-gray-200 font-semibold text-center">or</Text>
                            <TouchableOpacity onPress={authenticate} style={styles.button}>
                                <Text className="text-purple-700 font-semibold">Login with Face ID</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </LinearGradient>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#C084FC',
        color: 'white',
        paddingVertical: 10,
        fontSize: 16,
    },
    title: {
        color: 'white', 
        fontSize: 30, 
        fontWeight: 'bold', 
        marginBottom: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 12,
        alignItems: 'center',
        alignSelf: 'center',
        width: '80%',
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: 'purple',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 15,
    }
});