import { Text, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import React, { Component } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = () => {
  const navigation = useNavigation<any>();

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
          <TextInput placeholder="First Name" placeholderTextColor="#d1d5db" style={styles.input}/>
          <TextInput placeholder="Last Name" placeholderTextColor="#d1d5db" style={styles.input}/>
          <TextInput placeholder="Email address" placeholderTextColor="#d1d5db"style={styles.input}/>
          <TextInput placeholder="Password" placeholderTextColor="#d1d5db" secureTextEntry style={styles.input}/>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button}>
          <Text className="text-purple-700 font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 flex-row items-center justify-center" style={{ marginTop: 20 }}>
        <Text className="text-white text-center">
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ textDecorationLine: 'underline' }} className="text-white font-semibold">
            Log in
          </Text>
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
  }
});