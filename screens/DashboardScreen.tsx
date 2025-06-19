import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import * as Clipboard from 'expo-clipboard';

type Password = {
    id: string;
    site_name: string;
    email: string;
    logo_url?: string;
    password: string;
    notes?: string;
};

type EditMode = 'none' | 'email' | 'password' | 'notes';

const DashboardScreen = ({ navigation }: { navigation: any }) => {
    const [passwordEntries, setPasswordEntries] = useState<Password[]>([]);
    const [newEntryData, setNewEntryData] = useState({ site_name: '', email: '', password: '', notes: '', domain_extension: '.com' });
    const [isModalVisible, setModalVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<Password | null>(null);
    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    const [editedEmail, setEditedEmail] = useState('');
    const [editedPassword, setEditedPassword] = useState('');
    const [editMode, setEditMode] = useState<EditMode>('none');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEntries, setFilteredEntries] = useState<Password[]>([]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredEntries(passwordEntries);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = passwordEntries.filter(entry =>
                entry.site_name.toLowerCase().includes(query) ||
                entry.email.toLowerCase().includes(query)
            );
            setFilteredEntries(filtered);
        }
    }, [searchQuery, passwordEntries]);
      

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
                        <TouchableOpacity key={option} onPress={() => onSelect(option)} style={[ styles.button, isSelected && styles.selectedButton, isFirst && styles.firstButton, isLast && styles.lastButton, !isSelected && !isLast && styles.borderRight, ]}>
                            <Text style={[styles.text, isSelected && styles.selectedText]}>{option}</Text>
                        </TouchableOpacity>
                        );
                    })}
                </View>
            </>
        );
    };

    const handleSave = async () => {
        if (!selectedEntry) return;
        try {
            const token = await AsyncStorage.getItem('token');
            console.log("Token being used:", token);
            if (!token) {
                throw new Error('No token found in storage');
            }
            const updatedData = {
                site_name: selectedEntry.site_name,
                email: editMode === 'email' ? editedEmail : selectedEntry.email,
                password: editMode === 'password' ? editedPassword : selectedEntry.password,
                notes: selectedEntry.notes || ''
            };
      
            if (editMode === 'email') {
                updatedData.email = editedEmail;
            } else if (editMode === 'password') {
                updatedData.password = editedPassword;
            }
        
            await axios.put(`https://mypassvault.onrender.com/api/passwords/${selectedEntry.id}/`, updatedData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', },
            });
      
            await fetchPasswords();
            setEditMode('none');
        } catch (err) {
            console.error('Save failed:', err);
        }
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

    const handleDeleteEntry = async () => {
        if (!selectedEntry) return;
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`https://mypassvault.onrender.com/api/passwords/${selectedEntry.id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDetailModalVisible(false);
            fetchPasswords();
        } catch (error) {
            console.error('Error deleting password:', error);
        }
    };

    const confirmDelete = () => {
        Alert.alert(
          'Confirm Delete',
          'Are you sure you want to delete this password entry?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: handleDeleteEntry }
          ]
        );
    };
    
    return (
        <LinearGradient colors={['#7C3AED', '#4C1D95']} style={{ flex: 1, paddingHorizontal: 20 }}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="menu" size={30} color="white" />
                </TouchableOpacity>

                <Text style={styles.headerText}>Your Saved Passwords</Text>

                <TouchableOpacity onPress={toggleModal}>
                    <Ionicons name="add-circle-outline" size={30} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput style={styles.searchInput} placeholder="Search Password" placeholderTextColor="#888" value={searchQuery} onChangeText={setSearchQuery}/>
            </View>
            
            {/* Password Details Modal */}
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} onBackButtonPress={toggleModal} swipeDirection="down" onSwipeComplete={toggleModal} style={styles.modal}>
                <View style={styles.modalContent}>
                    <Text style={styles.formTitle}>Add New Password</Text>
                    <TextInput placeholder="Site Name" placeholderTextColor="#ccc" value={newEntryData.site_name} onChangeText={(text) => setNewEntryData({ ...newEntryData, site_name: text })} style={styles.input} autoCapitalize="none"/>
                    <DomainSelector selected={newEntryData.domain_extension} onSelect={(value: any) => setNewEntryData({ ...newEntryData, domain_extension: value })}/>
                    <TextInput placeholder="Email" placeholderTextColor="#ccc" value={newEntryData.email} onChangeText={(text) => setNewEntryData({ ...newEntryData, email: text })} style={styles.input} autoCapitalize="none"/>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10, }}>
                        <View style={{ flex: 1, position: 'relative' }}>
                            <TextInput placeholder="Password" placeholderTextColor="#ccc" value={newEntryData.password} onChangeText={(text) => setNewEntryData({ ...newEntryData, password: text })} style={[styles.input, { flex: 1, marginBottom: 0, paddingRight: 40 }]} secureTextEntry={!showPassword} autoCapitalize="none"/>
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

            <Modal isVisible={isDetailModalVisible} onBackdropPress={() => setDetailModalVisible(false)} onBackButtonPress={() => setDetailModalVisible(false)} style={{ margin: 0 }}>
                
                <View style={styles.fullScreenModal}>
                    
                    {/* Entries */}
                    {selectedEntry && (
                        <>
                            <View style={{ alignItems: 'center', marginBottom: 30 }}>
                                <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 10, marginBottom: 20 }}>{selectedEntry.site_name}</Text>
                                <Image source={{ uri: selectedEntry.logo_url }} style={{ width: 50, height: 50, borderRadius: 6 }} />
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Site:</Text>
                                <Text style={[styles.detailValue, { marginLeft: 4 }]}>{selectedEntry.site_name}</Text>
                            </View>
                                
                            <View style={styles.detailRow}>
                                <Text style={[styles.detailLabel, { marginRight: 6, marginTop: 0 }]}>Email:</Text>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                
                                {editMode === 'email' ? (
                                    <TextInput value={editedEmail} onChangeText={setEditedEmail} style={[styles.detailValue, { flex: 1, borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 5, }]} autoCapitalize="none"/>
                                ) : (
                                    <Text style={[styles.detailValue, { flex: 1, marginBottom: 5, }]} numberOfLines={1} ellipsizeMode="tail">
                                        {selectedEntry.email}
                                    </Text>
                                )}
                                    {/* Update Email Button */}
                                    <TouchableOpacity style={styles.editBtn} onPress={() => { if (editMode === 'email') {handleSave();} else { setEditMode('email'); setEditedEmail(selectedEntry.email); }}}>
                                        <Ionicons name={editMode === 'email' ? 'checkmark' : 'create-outline'} size={20} color="#7C3AED" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={[styles.detailRow, { alignItems: 'center' }]}>
                                <Text style={styles.detailLabel}>Password:</Text>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                                    {editMode === 'password' ? (
                                        <>
                                            <TextInput value={editedPassword} onChangeText={setEditedPassword} secureTextEntry={!showPassword} style={[styles.detailValue, { marginLeft: 3, marginRight: 5, flex: 1, borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 5, }]} autoCapitalize="none"/>
                                            
                                            {/* Show Password Button */}
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#7C3AED" />
                                            </TouchableOpacity>

                                            {/* Copy Password Button */}
                                            <TouchableOpacity onPress={async () => { await Clipboard.setStringAsync(selectedEntry.password); setCopied(true); setTimeout(() => setCopied(false), 1500);}} style={styles.copyBtn}>
                                                <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={20} color="#7C3AED" />
                                            </TouchableOpacity>
                                        

                                            {/* Update Password Button */}
                                            <TouchableOpacity style={styles.editBtn} onPress={() => {
                                                if (editMode === 'password') handleSave();
                                                else {
                                                    setEditMode('password');
                                                    setEditedPassword(selectedEntry.password);
                                                }
                                            }}>
                                                <Ionicons name="checkmark" size={20} color="#7C3AED" />
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <>
                                            <Text style={[styles.detailValue, { flex: 1, marginLeft: 4, marginBottom: 2, }]} numberOfLines={1}>
                                                {showPassword ? selectedEntry.password : '••••••••'}
                                            </Text>
                                            {/* Show Password Button */}
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#7C3AED" />
                                            </TouchableOpacity>
                                            {/* Copy Password Button */}
                                            <TouchableOpacity onPress={async () => { await Clipboard.setStringAsync(selectedEntry.password); setCopied(true); setTimeout(() => setCopied(false), 1500); }} style={styles.copyBtn}>
                                                <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={20} color="#7C3AED" />
                                            </TouchableOpacity>

                                            {/* Update Password Button */}
                                            <TouchableOpacity style={styles.editBtn} onPress={() => {
                                                setEditMode('password');
                                                setEditedPassword(selectedEntry.password);
                                            }}>
                                                <Ionicons name="create-outline" size={20} color="#7C3AED" />
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Notes:</Text>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                                {editMode === 'notes' ? (
                                    <>
                                        <TextInput value={selectedEntry.notes || ''} onChangeText={(text) => selectedEntry && (selectedEntry.notes = text)} style={[styles.detailValue, { flex: 1, borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 10, }]} multiline numberOfLines={4} placeholder="Enter your notes here..." placeholderTextColor="#aaa" autoCapitalize="none"/>
                                        <TouchableOpacity style={styles.editBtn} onPress={() => handleSave()}>
                                            <Ionicons name="checkmark" size={20} color="#7C3AED" />
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={[styles.detailValue, { flex: 1, marginBottom: 2, marginLeft: 2, }]} numberOfLines={4}>
                                            {selectedEntry.notes || 'None'}
                                        </Text>
                                        <TouchableOpacity style={styles.editBtn} onPress={() => {
                                            setEditMode('notes');
                                        }}>
                                            <Ionicons name="create-outline" size={20} color="#7C3AED" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                </View>
                            </View>

                        </>
                    )}
                    <TouchableOpacity onPress={() => setDetailModalVisible(false)} style={[styles.addButton, {marginTop: 15}]}>
                        <Text style={{ color: '#7C3AED', fontWeight: 'bold'  }}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={confirmDelete} style={{ marginTop: 20, padding: 12, backgroundColor: 'red', borderRadius: 8, alignItems: 'center', }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete Entry</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <FlatList data={filteredEntries} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { setSelectedEntry(item); setDetailModalVisible(true); setModalVisible(false); }}>
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
                </TouchableOpacity>
                )} ListEmptyComponent={<Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>No passwords yet. Tap the plus icon to add one!</Text>} contentContainerStyle={{ paddingBottom: 30 }}/>
        </LinearGradient>    
    );
};

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
    icon: {
        top: 45,
        left: 10,
    },
    headerContainer: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 80,
        marginBottom: 40,
    },
    headerText: { 
        color: 'white', 
        fontSize: 25, 
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        marginHorizontal: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        left: 5,
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
    detailLabel: {
        fontWeight: 'bold',
        marginTop: 4, 
    },
    detailValue: {
        color: '#555',
        fontSize: 14,
        marginTop: 4, 
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    editBtn: {
        marginLeft: 6,
        padding: 6,
        backgroundColor: '#F3E8FF',
        borderRadius: 6,
    },
    copyBtn: {
        marginLeft: 6,
        padding: 6,
        backgroundColor: '#F3E8FF',
        borderRadius: 6,
    }, 
    eyeBtn: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#F3E8FF',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 30,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: 'black',
        paddingVertical: 8,
    },  
    fullScreenModal: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 60,
        paddingHorizontal: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
});