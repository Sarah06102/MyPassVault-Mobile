import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

const Panel = (props: any) => {
    const [userEmail, setUserEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            const loadEmail = async () => {
                const email = await AsyncStorage.getItem("email");
                const first = await AsyncStorage.getItem("first_name");
                const last = await AsyncStorage.getItem("last_name");
        
                console.log('Loaded from AsyncStorage:', { email, first, last });

                if (email) setUserEmail(email);
                if (first) setFirstName(first);
                if (last) setLastName(last);
            };
            loadEmail();
        }, [])
    );

    const handleLogout = async () => {
        await AsyncStorage.multiRemove(["token", "email", "first_name", "last_name"]);
        props.navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
    };
    return (
      <DrawerContentScrollView {...props} style={styles.container}>
        {/* User Profile */}
        <View style={styles.profileContainer}>
            <Ionicons name="person-circle" size={64} color="white" />
            <Text style={styles.emailText}>{userEmail || "Your email"}</Text>
            <Text style={styles.emailText}>{firstName && lastName ? `${firstName} ${lastName}` : "Your name"}</Text>
        </View>

        <MenuItem icon="key" label="Dashboard" onPress={() => props.navigation.navigate('Dashboard')} />
        <MenuItem icon="shield-checkmark" label="Security" onPress={() => props.navigation.navigate('Security')} />
        <MenuItem icon="settings" label="Settings" onPress={() => props.navigation.navigate('Settings')} />
        <MenuItem icon="help-circle" label="Help" onPress={() => props.navigation.navigate('Help')} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    );
  }
  
    const MenuItem = ({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <Ionicons name={icon} size={20} color="white" style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#7C3AED',
      flex: 1,
      paddingTop: 40,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
      paddingLeft: 20,
    },
    icon: {
      marginRight: 20,
    },
    label: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    emailText: {
        color: 'white',
        marginTop: 8,
        fontSize: 14,
    },
    logoutButton: {
        marginTop: 10,
        backgroundColor: 'white',
        paddingVertical: 6,
        borderRadius: 999,
    },
    logoutText: {
        color: '#7C3AED',
        fontWeight: '600',
        textAlign: 'center',
    },
});
  
export default Panel;