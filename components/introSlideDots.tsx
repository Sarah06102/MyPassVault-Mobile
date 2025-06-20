import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { SharedValue } from 'react-native-reanimated';
import Animated, { interpolate, useAnimatedStyle, Extrapolate } from 'react-native-reanimated';


type IntroSlideDotsProps = {
    data: { id: number; title: string; description?: string }[];
    scrollX: SharedValue<number>; 
    index: number;
};

const { width } = Dimensions.get('screen');

const IntroSlideDots: React.FC<IntroSlideDotsProps> = ({data, scrollX, index}) => {
  return (
    <View className="gap-3" style={styles.container}>
        {data.map((_, idx) => {
            const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

            const animatedStyle = useAnimatedStyle(() => {
                const widthAnim = interpolate(
                scrollX.value,
                inputRange,
                [12, 30, 12],
                Extrapolate.CLAMP
                );
                return { width: widthAnim };
            });

            return (
                <Animated.View key={idx.toString()} style={[styles.dot, index === idx ? styles.dotActive : {}, animatedStyle, ]}/>
                );
            })}

    </View>
  );
};

export default IntroSlideDots;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#a9a9a9',
    },
    dotActive: {
        backgroundColor:'#d1d5db',
    }
})