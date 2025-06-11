import { View, Text } from 'react-native'
import React from 'react'
import IntroSlider from '../components/introSlider'
import { LinearGradient } from 'expo-linear-gradient';

const OnboardingScreen = () => {
  return (
    <LinearGradient colors={['#7C3AED', '#4C1D95']} style={{ flex: 1 }}>
        <View className="flex-1 bg-purple-700">
            <IntroSlider />
        </View>
    </LinearGradient>
  )
}

export default OnboardingScreen