import { View, Text } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const DashboardScreen = () => {
return (
    <LinearGradient colors={['#7C3AED', '#4C1D95']} style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
        <View>
        <Text>DashboardScreen</Text>
        </View>
    </LinearGradient>    
  )
}

export default DashboardScreen;