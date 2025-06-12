import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated, Easing } from 'react-native';
import Modal from 'react-native-modal';

type Password = {
    id: string;
    site_name: string;
    email: string;
    logo_url?: string;
};

const DashboardScreen = () => {
    const [passwordEntries, setPasswordEntries] = useState<Password[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newEntryData, setNewEntryData] = useState({ site_name: '', email: '', password: '', notes: '', domain_extension: '.com' });
    const [formHeight] = useState(new Animated.Value(0));
    const [isModalVisible, setModalVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const domainOptions = ['.com', '.ca', '.org', '.net', '.edu'];

    useEffect(() => {
        fetchPasswords();
    }, []);

    const refreshAccessToken = async () => {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
      
        const response = await axios.post('https://mypassvault.onrender.com/api/token/refresh/', {
            refresh: refreshToken,
        });
        const newAccessToken = response.data.access;
        await AsyncStorage.setItem('token', newAccessToken);
        return newAccessToken;
    };

    const fetchPasswords = async () => {
        try {
            let token = await AsyncStorage.getItem('token');
            let response;
      
            try {
                response = await axios.get('https://mypassvault.onrender.com/api/passwords/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            } catch (error: any) {
            if (error.response && error.response.data.code === 'token_not_valid') {
                console.log('Access token expired. Refreshing...');
                token = await refreshAccessToken();
                response = await axios.get('https://mypassvault.onrender.com/api/passwords/', {
                headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                throw error;
            }
            }
            setPasswordEntries(response.data);
        } catch (error: any) {
            console.error('Error fetching passwords:', error.response?.data || error.message);
        }
    };
      
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleAddPassword = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          await axios.post('https://mypassvault.onrender.com/api/passwords/', newEntryData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNewEntryData({ site_name: '', email: '', password: '', notes: '', domain_extension: '.com' });
          fetchPasswords();
        } catch (error: any) {
          console.error('Error adding password:', error.response?.data || error.message);
        }
    };

    const DomainSelector = ({ selected, onSelect }: any) => {
        return (
            <>
                <View style={styles.domainRow}>
                    {domainOptions.map((option, index) => {
                        const isSelected = selected === option;
                        const isFirst = index === 0;
                        const isLast = index === domainOptions.length - 1;

                        return (
                        <TouchableOpacity key={option} onPress={() => onSelect(option)} style={[ styles.button, isSelected && styles.selectedButton, isFirst && styles.firstButton, isLast && styles.lastButton, ]}>
                            <Text style={[styles.text, isSelected && styles.selectedText]}>{option}</Text>
                        </TouchableOpacity>
                        );
                    })}
                </View>
                
            </>
        );
    };

    const generatePasswordFromAPI = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await axios.get('https://mypassvault.onrender.com/api/generate-password/', {
            headers: { Authorization: `Bearer ${token}` },
        });
            const generated = response.data.password;
            setNewEntryData({ ...newEntryData, password: generated });
        } catch (error: any) {
            console.error('Error generating password:', error.response?.data || error.message);
        }
    };

return (
    <LinearGradient colors={['#7C3AED', '#4C1D95']} style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Header */}
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Your Saved Passwords</Text>
            <TouchableOpacity onPress={toggleModal}>
                <Ionicons name="pencil" size={24} color="white" />
            </TouchableOpacity>
        </View>

        {/* Passwords List */}
        <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} onBackButtonPress={toggleModal} swipeDirection="down" onSwipeComplete={toggleModal} style={styles.modal}>
            <View style={styles.modalContent}>
                <Text style={styles.formTitle}>Add New Password</Text>
                <TextInput placeholder="Site Name" placeholderTextColor="#ccc" value={newEntryData.site_name} onChangeText={(text) => setNewEntryData({ ...newEntryData, site_name: text })} style={styles.input} />
                <DomainSelector selected={newEntryData.domain_extension} onSelect={(value: any) => setNewEntryData({ ...newEntryData, domain_extension: value })}/>
                <TextInput placeholder="Email" placeholderTextColor="#ccc" value={newEntryData.email} onChangeText={(text) => setNewEntryData({ ...newEntryData, email: text })} style={styles.input} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10, }}>
                    <View style={{ flex: 1, position: 'relative' }}>
                        <TextInput placeholder="Password" placeholderTextColor="#ccc" value={newEntryData.password} onChangeText={(text) => setNewEntryData({ ...newEntryData, password: text })} style={[styles.input, { flex: 1, marginBottom: 0, paddingRight: 40 }]} secureTextEntry={!showPassword} />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: '50%', transform: [{ translateY: -12 }], }}>
                            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#7C3AED" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={generatePasswordFromAPI} style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#E7C6FF', marginLeft: 8, borderRadius: 999, }}>
                        <Text style={{ color: '#7C3AED', fontWeight: 'bold', }}>Generate</Text>
                    </TouchableOpacity>
                </View>
                <TextInput placeholder="Notes (optional)" placeholderTextColor="#ccc" value={newEntryData.notes} onChangeText={(text) => setNewEntryData({ ...newEntryData, notes: text })} style={styles.input} />
                <TouchableOpacity onPress={handleAddPassword} style={styles.addButton}>
                <Text style={{ color: '#7C3AED', fontWeight: 'bold' }}>Add Password</Text>
                </TouchableOpacity>
            </View>
        </Modal>

        <FlatList data={passwordEntries} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (
            <View style={styles.entryContainer}>
                {item.logo_url ? (
                    <View style={styles.logoContainer}>
                        <Image source={{ uri: item.logo_url }} style={styles.logoImage} resizeMode="contain" />
                    </View>
                ) : (
                    <View style={styles.iconContainer}>
                        <Ionicons name="folder" size={24} color="#7C3AED" />
                    </View>
                )}
                <View style={styles.textContainer}>
                    <Text style={styles.siteName}>{item.site_name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                </View>
            </View>
            )}
            ListEmptyComponent={<Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>No passwords yet. Tap the pencil to add one!</Text>}
            contentContainerStyle={{ paddingBottom: 30 }}
        />
    </LinearGradient>    
  )
}

export default DashboardScreen;

const styles = StyleSheet.create({
    entryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: 12,
        marginBottom: 10,
        padding: 10,
    },
    iconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        borderRadius: 8,
        padding: 8,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    siteName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    email: {
        color: '#d1d5db',
        fontSize: 12,
    },
    emptyText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    
    headerContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 40,
        marginTop: 80, 
    },
    headerText: { 
        color: 'white', 
        fontSize: 20, 
        fontWeight: 'bold' 
    },
    formContainer: {
        overflow: 'hidden',
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
    },
    formTitle: { 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#C084FC', 
        borderRadius: 8, 
        padding: 8, 
        marginBottom: 10, 
        color: 'black' 
    },
    addButton: { 
        backgroundColor: 'white', 
        borderColor: '#C084FC', 
        borderWidth: 2, 
        borderRadius: 8, 
        padding: 10, 
        alignItems: 'center' 
    },
    logoContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 30,
        height: 30,
        borderRadius: 6,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'stretch',
        minHeight: 355,
    },
    domainRow: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        marginBottom: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    firstButton: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    borderRight: {
        borderRightWidth: 1,
        borderColor: '#d1d5db',
    },
    borderLeft: {
        borderLeftWidth: 1,
        borderColor: '#d1d5db',
    },
    lastButton: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    selectedButton: {
        backgroundColor: '#E7C6FF',
        borderColor: '#7C3AED',
        borderWidth: 1,
        zIndex: 1,
    },
    text: {
        color: '#555',
        fontWeight: '500',
    },
    selectedText: {
        color: '#7C3AED',
        fontWeight: 'bold',
    },     
});