import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Button } from 'react-native-paper'

const ResetPasswordSent = () => {
    const navigation = useNavigation<any>();
    return (
        <LinearGradient colors={['#7C3AED', '#4C1D95']} style={{ flex: 1, paddingHorizontal: 20, paddingTop: 50 }}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Password reset link sent! Check your email.</Text>
            </View>
        </LinearGradient>
    )
}

export default ResetPasswordSent;