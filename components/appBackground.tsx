// import React from 'react';
// import { View, Text, ImageBackground, StyleSheet, Image } from 'react-native';
// import { BlurView } from 'expo-blur';

// type Props = {
//     source: any;
//     style?: any;
//     resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
//     blurRadius?: number;
//     children?: React.ReactNode;
// };

// const AppBackground: React.FC<Props> = ({ source, style, resizeMode, blurRadius, children }) => (
//     <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
//         <ImageBackground source={source} style={[styles.background, style]} resizeMode={resizeMode} blurRadius={blurRadius}>
//             {children}
//         </ImageBackground>
//     </View>
// );

// const styles = StyleSheet.create({
//     background: {
//       flex: 1,
//       opacity: 0.8,
//     },
//     blurOverlay: {
//       ...StyleSheet.absoluteFillObject,
//     },
// });

// export default AppBackground;
