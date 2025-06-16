import { StatusBar } from 'react-native';
import { useColorScheme } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import "./global.css"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Router from './Router';
// import AppBackground from './components/appBackground';

const Stack = createNativeStackNavigator();


export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
      <>
        <Router />
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent /></>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});