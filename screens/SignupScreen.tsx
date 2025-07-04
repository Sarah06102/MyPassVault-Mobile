import { Text, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = () => {
  const navigation = useNavigation<any>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    setErrorMessage('');
    navigation.navigate('Loading');
    try {
      const response = await axios.post('https://mypassvault.onrender.com/api/signup/', {
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        password: password,
      });
      console.log('Signup successful:', response.data);
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
      }

      navigation.navigate('Dashboard');

  
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error.message);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Signup error. Please try again.');
      } else {
        setErrorMessage('Network error. Please try again.');
      }
      setTimeout(() => {
        navigation.goBack();
      }, 500);
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
        <Text style={styles.title}>Create Account</Text>

        {/* Form Fields */}
        <View style={{ gap: 20 }}>
          <TextInput placeholder="First Name" placeholderTextColor="#d1d5db" style={styles.input} value={firstName} onChangeText={setFirstName}/>
          <TextInput placeholder="Last Name" placeholderTextColor="#d1d5db" style={styles.input} value={lastName} onChangeText={setLastName}/>
          <TextInput placeholder="Email address" placeholderTextColor="#d1d5db" style={styles.input} value={email} onChangeText={setEmail}/>
          <TextInput placeholder="Password" placeholderTextColor="#d1d5db" secureTextEntry={!showPassword} style={styles.input} value={password} onChangeText={setPassword}/>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: '100%', transform: [{ translateY: -32 }], }}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
        )}


        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button}>
          <Text className="text-purple-700 font-semibold" onPress={handleSignup}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 flex-row items-center justify-center" style={{ marginTop: 20 }}>
        <Text className="text-white text-center">
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ textDecorationLine: 'underline' }} className="text-white font-semibold">Log in</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default SignupScreen;

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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});