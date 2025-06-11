import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import "./global.css"
import IntroSlider from './components/introSlider';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Router from './Router';
// import AppBackground from './components/appBackground';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <>
        {/* <AppBackground source={require('./assets/keyboard_background.png')} style={styles.background} resizeMode="repeat" blurRadius={2} > */}
        <Router />
      </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});