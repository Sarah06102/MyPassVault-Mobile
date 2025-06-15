import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';


const HelpScreen = () => {
    const navigation = useNavigation<any>();
    const MailLink = ({ url, text }: { url: string; text: string }) => {
        return(
            <Text style={{ color: 'skyblue', textDecorationLine: 'underline', marginTop: 10 }} onPress={() => Linking.openURL(url)}>
                {text}
            </Text>
        )
    };

    const WebLink = ({ url, text }: { url: string; text: string }) => {
        return(
            <Text style={{ color: 'skyblue', textDecorationLine: 'underline', marginTop: 10 }} onPress={() => WebBrowser.openBrowserAsync(url)}>
                {text}
            </Text>
        )
    };
    return (
        <LinearGradient colors={['#7C3AED', '#4C1D95']} style={{ flex: 1, paddingHorizontal: 20, paddingTop: 50 }}>

            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Help & Support</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Contact Us</Text>
                <Text style={styles.text}>Have questions or need help? Reach out to us at <MailLink url="mailto:mypassvaulthelp@gmail.com" text="mypassvaulthelp@gmail.com" />. We're here to help!</Text>
                <Text style={styles.title}>Troubleshooting</Text>
                <Text style={styles.text}>{"\u2022"} Can't log in? Make sure your email and password are correct.</Text> 
                <Text style={styles.text}>{"\u2022"} Forgot your password? Use the password reset link on the login page.</Text> 
                <Text style={styles.text}>{"\u2022"} Issues with password generator? Try refreshing the page or clearing your cache.</Text>
                <Text style={styles.title}>Security Tips</Text>
                <Text style={styles.text}>{"\u2022"} Always use strong, unique passwords for each account.</Text> 
                <Text style={styles.text}>{"\u2022"} Consider enabling two-factor authentication (2FA) for added security.</Text>    
                <Text style={styles.text}>{"\u2022"} Be cautious of phishing emails asking for your credentials.</Text>    
                <Text style={styles.text}>More questions? Check out our <WebLink url="https://my-pass-vault.vercel.app/#faqs" text="FAQ" /> section on the homepage for quick answers to common questions!</Text>
            </View>
        </LinearGradient>
    );
};

export default HelpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15
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
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        textDecorationLine: 'underline',
    },
    text: {
        color: 'white',
        fontWeight: 'semibold',
        fontSize: 15,
    },
})