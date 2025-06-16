import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

const ResetPassword = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const handleReset = async () => {
        setErrorMessage('');
        setMessage('');
      
        try {
            const formData = new URLSearchParams();
            formData.append('email', email.toLowerCase());
      
            const response = await fetch('https://mypassvault.onrender.com/mobile/password_reset/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString(),
            });
      
            if (response.ok) {
                setMessage('Check your email for a password reset link.');
                navigation.navigate('reset-password-sent');
            } else {
                setErrorMessage('Failed to send reset link. Please try again.');
            }
        } catch (error) {
            console.error('Reset error:', error);
            setErrorMessage('Network error. Please try again.');
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
                <Text style={styles.title}>Reset your password</Text>

                {/* Input */}
                <TextInput placeholder="Enter your email" placeholderTextColor="#d1d5db" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address"/>

                {/* Error or Success Message */}
                {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
                {message !== '' && <Text style={styles.successText}>{message}</Text>}

                {/* Submit Button */}
                <TouchableOpacity style={styles.button} onPress={handleReset}>
                    <Text className="text-purple-700 font-semibold">Send Reset Link</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default ResetPassword;

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#C084FC',
        color: 'white',
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    title: {
        color: 'white', 
        fontSize: 30, 
        fontWeight: 'bold', 
        marginBottom: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        textAlign: 'center',
    },
    button: {
        marginTop: 30,
        backgroundColor: 'white',
        paddingVertical: 12,
        alignItems: 'center',
        alignSelf: 'center',
        width: '80%',
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: 'purple',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 14,
    },
    successText: {
        color: 'lightgreen',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 14,
    },
});

// Fix: Error when reset password btn is clicked. 