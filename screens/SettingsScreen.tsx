import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalEventBus from '../utils/globalEventBus';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch('https://mypassvault.onrender.com/api/profile/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUserFirstName(data.first_name);
        setUserLastName(data.last_name);
        setUserEmail(data.email);
    };
        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        const token = await AsyncStorage.getItem('token');
      
        try {
          const res = await fetch('https://mypassvault.onrender.com/api/profile/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                first_name: userFirstName,
                last_name: userLastName,
                email: userEmail,
                ...(userPassword ? { password: userPassword } : {})
            }),
          });
      
          if (res.ok) {
            const data = await res.json();
            await AsyncStorage.setItem('email', data.email || '');
            await AsyncStorage.setItem('first_name', data.first_name || '');
            await AsyncStorage.setItem('last_name', data.last_name || '');
            globalEventBus.emit('profileUpdated');
            Alert.alert('Success', 'Profile updated successfully');
            setUserPassword('');
          } else {
            const errorData = await res.json();
            console.log('Update Error:', errorData);
            Alert.alert('Error', 'Failed to update profile');
          }
        } catch (err) {
          console.log('Network or server error:', err);
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };      
  
  

  return (
    <LinearGradient colors={['#7C3AED', '#4C1D95']} style={{ flex: 1, paddingHorizontal: 20, paddingTop: 50, }}>
        <View style={styles.headerContainer}>
            <View style={styles.iconGroup}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconWrapper}>
                    <Ionicons name="menu" size={30} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={styles.headerText}>Account Settings</Text>
        </View>

        <View style={styles.form}>
            <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#aaa" value={userFirstName} onChangeText={setUserFirstName}/>
            <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#aaa" value={userLastName} onChangeText={setUserLastName}/>
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" value={userEmail} onChangeText={setUserEmail} keyboardType="email-address"/>
            
            <View style={styles.passwordContainer}>
                <TextInput style={[styles.input, { paddingRight: 40 }]} placeholder="New Password" placeholderTextColor="#aaa" secureTextEntry={!showPassword} value={userPassword} onChangeText={setUserPassword}/>
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(prev => !prev)}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
                </TouchableOpacity>
            </View>

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
    </LinearGradient>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    headerText: { 
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    headerContainer: { 
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    iconGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    iconWrapper: {
        marginRight: 10,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 999,
        padding: 12,
        color: 'black',
    },
    icon: { 
        left: 35,
        bottom: 23.5,
    },
    passwordContainer: {
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 12,
    },
    button: {
        backgroundColor: '#7C3AED',
        borderRadius: 999,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});
