import { Text, View, TouchableOpacity, StyleSheet, TextInput, Linking, Touchable } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

declare global {
    var loginSuccess: boolean | undefined;
}

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        setErrorMessage('');
        globalThis.loginSuccess = false;
        navigation.navigate('Loading');
        try {
            const response = await axios.post('https://mypassvault.onrender.com/api/login/', {
            email: email.toLowerCase(),
            password: password,
            });

            console.log('Login success:', response.data);
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
            
                globalThis.loginSuccess = true;
            } else {
                console.error('Token not found in login response:', response.data);
                setErrorMessage('Unexpected error, please try again.');
                navigation.goBack();
            }

        } catch (error: any) {
            globalThis.loginSuccess = false;
            console.error('Login error:', error.response?.data || error.message);
            navigation.goBack();
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || 'Invalid credentials. Please try again.');
            } else {
            setErrorMessage('Network error. Please try again.');
            }
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
                    <Text style={styles.errorText}>{errorMessage}</Text>
                )}

                {/* <TouchableOpacity onPress={() => navigation.navigate("reset-password")} style={{marginTop: 20, }}>
                    <Text className="text-white text-center" style={{textDecorationLine: 'underline'}}>Forgot password?</Text>
                </TouchableOpacity> */}

                {/* Sign Up Button */}
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text className="text-purple-700 font-semibold">Login</Text>
                </TouchableOpacity>
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
        marginTop: 40,
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
        fontSize: 14,
    },
});