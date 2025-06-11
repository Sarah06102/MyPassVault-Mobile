import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import "./global.css"
import IntroSlider from './components/introSlider';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from './screens/SignupScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
// import AppBackground from './components/appBackground';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <>
        {/* <AppBackground source={require('./assets/keyboard_background.png')} style={styles.background} resizeMode="repeat" blurRadius={2} > */}
        
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
        
      </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});