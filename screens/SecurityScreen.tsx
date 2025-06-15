import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import zxcvbn from 'zxcvbn';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SecurityScreen = () => {
    const navigation = useNavigation<any>();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [strengthScore, setStrengthScore] = useState(0);
    const [crackTime, setCrackTime] = useState('');
    const [feedback, setFeedback] = useState('');

    const barWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const width = (strengthScore + 1) * 20;
        Animated.timing(barWidth, { toValue: width, duration: 300, useNativeDriver: false,}).start();
    }, [strengthScore]);

    useEffect(() => {
        const result = zxcvbn(password);
        setStrengthScore(result.score);
        setCrackTime(String(result.crack_times_display.offline_slow_hashing_1e4_per_second));
        setFeedback(result.feedback.warning || result.feedback.suggestions.join(' ') || 'Strong password!');
    }, [password]);

    const getStrengthLabel = (score: number) => {
    return ['Very Weak', 'Weak', 'Okay', 'Good', 'Strong'][score];
    };

  const getStrengthColor = (score: number) => {
    return ['#dc2626', '#facc15', '#60a5fa', '#10b981', '#059669'][score];
  };

    return (
        <LinearGradient colors={['#7C3AED', '#4C1D95']} style={{ flex: 1, paddingHorizontal: 20, paddingTop: 50 }}>
            
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Check Your Password Strength</Text>
                <Text style={styles.text}>Ensure your password is strong & secure.</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} secureTextEntry={!showPassword} placeholder="Enter password" placeholderTextColor="#fff" value={password} onChangeText={setPassword}/>
                    <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.icon}>
                        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="white" />
                    </TouchableOpacity>
                </View>
            

                {password !== '' && (
                    <>
                        <View style={styles.strengthBarContainer}>
                            <Animated.View style={[styles.strengthBar, { backgroundColor: getStrengthColor(strengthScore), width: barWidth.interpolate({inputRange: [0, 100],  outputRange: ['0%', '100%'], }),},]} />
                            <Text style={{ color: getStrengthColor(strengthScore), fontWeight: 'bold', marginTop: 10, textAlign: 'center', }}>
                                {getStrengthLabel(strengthScore)}
                            </Text>
                        </View>
                            <Text style={styles.info}>Crack time: {crackTime}</Text>
                            <Text style={styles.feedback}>{feedback}</Text>  
                    </>
                )}
            </View>
        </LinearGradient>
    );
};

export default SecurityScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
    },
    title: { 
        color: 'white', 
        fontSize: 25, 
        fontWeight: 'bold', 
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        marginBottom: 40, 
    },
    headerText: { 
        color: 'white', 
        fontSize: 25, 
        fontWeight: 'bold', 
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    headerContainer: { 
        alignItems: 'center', 
        marginBottom: 40,
    },
    inputContainer: { 
        position: 'relative' 
    },
    input: { 
        borderWidth: 1, 
        borderColor: 'white', 
        borderRadius: 10, 
        padding: 10, 
        paddingRight: 40,
        color: 'white',
    },
    icon: { 
        position: 'absolute', 
        right: 10, 
        top: 12,
    },
    strengthBar: { 
        height: 8, 
        borderRadius: 5, 
        marginTop: 15,
    },
    info: { 
        marginTop: 20, 
        fontSize: 18, 
        color: 'white',
        textAlign: 'center',
    },
    feedback: { 
        marginTop: 5, 
        fontSize: 20, 
        fontStyle: 'italic', 
        color: 'white',
        textAlign: 'center',
        paddingTop: 15,
    },
    strengthBarContainer: {
        height: 'auto',
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 15,
        paddingVertical: 5,
        paddingHorizontal: 9,
        shadowColor: 'black',
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    text: {
        color: 'white',
        fontWeight: 'semibold',
        fontSize: 15,
        paddingVertical: 20,
        marginTop: 20,
        textDecorationLine: 'underline',
    },
    form: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        gap: 20,
    },
});
