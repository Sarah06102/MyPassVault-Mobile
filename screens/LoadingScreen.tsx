import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import CircularProgress from 'react-native-circular-progress-indicator';

const LoadingScreen = () => {
  const [value, setValue] = useState(0);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 2) + 1;
      });
    }, 90);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (value === 100) {
      const delay = setTimeout(() => {
        if (globalThis.loginSuccess === true) {
          navigation.replace('Dashboard');
        } else {
          navigation.goBack();
        }
      }, 500); 
      return () => clearTimeout(delay);
    }
  }, [value]);

  return (
    <LinearGradient colors={['#7C3AED', '#4C1D95']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.container}>
      <View style={{ width: 120, alignItems: 'center' }}>
        <CircularProgress radius={90} value={value} progressValueColor="white" progressValueFontSize={24} valueSuffix="%" inActiveStrokeColor="white" inActiveStrokeOpacity={0.2} inActiveStrokeWidth={6} valuePrefix=" " activeStrokeColor="#A78BFA" duration={500} progressValueStyle={{ fontVariant: ['tabular-nums'] }}/>
        </View>
      </View>
    </LinearGradient>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});


{/* Loading Dots */}

// const LoadingScreen = () => {
//   const dot1 = useRef(new Animated.Value(0)).current;
//   const dot2 = useRef(new Animated.Value(0)).current;
//   const dot3 = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const animateDot = (dot: Animated.Value, delay: number) => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(dot, { toValue: 1, duration: 400, delay, useNativeDriver: false }),
//           Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: false }),
//         ])
//       ).start();
//     };

//     animateDot(dot1, 0);
//     animateDot(dot2, 200);
//     animateDot(dot3, 400);
//   }, [dot1, dot2, dot3]);

//   return (
//     <LinearGradient colors={['#7C3AED', '#4C1D95']} style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
//         <View style={styles.dotsContainer}>
//             <Animated.View
//                 style={[styles.dot, { opacity: dot1.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }]}
//             />
//             <Animated.View
//                 style={[styles.dot, { opacity: dot2.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }]}
//             />
//             <Animated.View
//                 style={[styles.dot, { opacity: dot3.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }]}
//             />
//         </View>
//     </LinearGradient>
    
//   );
// };

// const styles = StyleSheet.create({
//     dotsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: 'white',
//     marginHorizontal: 4,
//   },
// });

// export default LoadingScreen;