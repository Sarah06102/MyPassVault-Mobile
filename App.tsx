import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import "./global.css"
import IntroSlider from './components/introSlider';
import { LinearGradient } from 'expo-linear-gradient';
// import AppBackground from './components/appBackground';



export default function App() {
  return (
      <>
        {/* <AppBackground source={require('./assets/keyboard_background.png')} style={styles.background} resizeMode="repeat" blurRadius={2} > */}
        <LinearGradient colors={['#7C3AED', '#4C1D95']} style={styles.background}>
          <IntroSlider />
          <StatusBar style="auto" />
          {/* </AppBackground> */}
        </LinearGradient>
      </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});