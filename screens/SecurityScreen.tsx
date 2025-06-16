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
    const [isFocused, setIsFocused] = useState(false);

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
        <LinearGradient colors={['#7C3AED', '#4C1D95']} style={{ flex: 1, paddingHorizontal: 20, paddingTop: 50, }}>
            
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" style={styles.panelIcon} size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Check Your Password Strength</Text>
                
            </View>
            <View style={styles.form}>
            <Text style={styles.text}>Ensure your password is strong & secure.</Text>
            <Text style={{ textAlign: 'center' }}>Enter your password below to check how secure it is!</Text>
            <View style={{ marginBottom: 10 }} />
                <View style={styles.inputContainer}>
                    <TextInput onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} style={[styles.input, isFocused && { borderColor: 'gray', shadowColor: '#6366f1', shadowOpacity: 0.2 },]} secureTextEntry={!showPassword} placeholder="Enter password" placeholderTextColor="gray" value={password} onChangeText={setPassword}/>
                    <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.icon}>
                        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
                    </TouchableOpacity>
                </View>
            

                {password !== '' && (
                    <>
                        <View style={[styles.strengthBarContainer, password && { borderColor: getStrengthColor(strengthScore),}]}>
                            <Animated.View style={[styles.strengthBar, { backgroundColor: getStrengthColor(strengthScore), width: barWidth.interpolate({inputRange: [0, 100],  outputRange: ['0%', '100%'], }),},]} />
                            <Text style={{ backgroundColor: getStrengthColor(strengthScore), fontWeight: 'bold', marginTop: 10, textAlign: 'center',color: 'white', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', alignSelf: 'center',}}>
                                {getStrengthLabel(strengthScore)}
                            </Text>
                        </View>
                        <Animated.View style={{ opacity: password !== '' ? 1 : 0 }}>
                            <Text style={styles.info}>Crack time: {crackTime}</Text>
                            <Text style={styles.feedback}>{feedback}</Text>
                        </Animated.View>  
                    </>
                )}
            </View>
        </LinearGradient>
    );
};

export default SecurityScreen;

const styles = StyleSheet.create({
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
        paddingBottom: 60,
    },
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
        borderColor: 'black', 
        borderRadius: 10, 
        padding: 10, 
        paddingRight: 40,
        color: 'black',
    },
    panelIcon: {
        bottom: 43.5,
        right: 130,
    },
    icon: { 
        position: 'absolute', 
        right: 10, 
        top: 10,
    },
    strengthBar: { 
        height: 8, 
        borderRadius: 5, 
        marginTop: 15,
    },
    info: { 
        marginTop: 20, 
        fontSize: 18, 
        color: 'black',
        textAlign: 'center',
    },
    feedback: { 
        marginTop: 5, 
        fontSize: 20, 
        fontStyle: 'italic', 
        color: '#4b5563',
        textAlign: 'center',
        paddingTop: 15,
    },
    strengthBarContainer: {
        backgroundColor: '#f3f4f6',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 12,
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
     },
      
    text: {
        color: 'black',
        fontWeight: 'semibold',
        fontSize: 15,
        textAlign: 'center',
        paddingVertical: 20,
        marginTop: 20,
        textDecorationLine: 'underline',
    },
});
