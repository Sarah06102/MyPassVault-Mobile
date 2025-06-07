import { Text, View, Dimensions, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, SharedValue } from 'react-native-reanimated';

type SlideItemProps = {
    item: {
      id: number;
      title: string;
      description?: string;
    };
    goToNextSlide: () => void;
    index: number;
    scrollX: SharedValue<number>;
};

const { width, height } = Dimensions.get('screen');

const IntroSlideItem: React.FC<SlideItemProps> = ({item, index, goToNextSlide}) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
          setIsLocked((prev) => !prev);
        }, 1000);
      
        return () => clearInterval(interval); 
    }, []);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 1500 });
        translateY.value = withTiming(0, { duration: 1500 });
    }, [index]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));


    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <View style={styles.content}>
                {(() => {
                    switch (item.id) {
                    case 1:
                        return (
                            <>
                                <View className="shadow-lg shadow-violet-800/40">
                                    <Text style={styles.title} className="shadow-black shadow-md">{item.title}</Text>
                                </View>
                                <View className="flex flex-row gap-3 items-center justify-center">
                                    <FontAwesome6 name={isLocked ? 'lock' : 'unlock'} size={28} color="#E0E7FF" shadowColor="#000" shadowOpacity={0.2} shadowOffset={{ width: 0, height: 2 }} shadowRadius={4}/>
                                    <FontAwesome6 name="arrow-right-long" size={28} color="#C084FC" shadowColor="#000" shadowOpacity={0.2} shadowOffset={{ width: 0, height: 2 }} shadowRadius={4}/>
                                    <FontAwesome6 name={isLocked ? 'unlock' : 'lock'} size={28} color="#E0E7FF" shadowColor="#000" shadowOpacity={0.2} shadowOffset={{ width: 0, height: 2 }} shadowRadius={4}/>
                                </View>
                                <Text style={styles.description} className="text-gray-200 mt-2 text-base tracking-wide shadow-black shadow-sm">
                                {item.description}
                                </Text>
                                <TouchableOpacity onPress={goToNextSlide} className="rounded-full bg-white px-8 py-4 shadow-lg border-2 border-purple-700">
                                    <Text className="text-purple-700 font-semibold">Get Started</Text>
                                </TouchableOpacity>
                            </>
                        );
            
                    case 2:
                        return (
                            <>
                                <Text style={styles.title}>{item.title}</Text>
                                <Animatable.Text className="text-center text-white mt-2">
                                    <Text className="font-semibold text-purple-200">Password Generator</Text>, 
                                    <Text className="font-semibold text-purple-200"> Password Checker</Text>, 
                                    <Text className="font-semibold text-purple-200"> Password Manager</Text>
                                </Animatable.Text>
                                {/* More layout for slide 2 if needed */}
                            </>
                        );
            
                    case 3:
                        return (
                            <>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description} className="text-gray-200 mt-2 text-base tracking-wide shadow-black shadow-sm">
                                {item.description}
                                </Text>
                                {/* More layout for slide 3 if needed */}
                            </>
                        );
            
                    default:
                        return (
                            <>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description} className="text-gray-200 mt-2 text-base tracking-wide shadow-black shadow-sm">
                                {item.description}
                                </Text>
                            </>
                        );
                    }
                })()}
            </View>
        </Animated.View>      
    );
};

export default IntroSlideItem;


const styles = StyleSheet.create({
    container: {
        width, 
        height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 0.4,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        gap: 25,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    description: {
        fontSize: 16,
        marginVertical: 12,
        textAlign: 'center',
        lineHeight: 22, 
        maxWidth: 300,
        letterSpacing: 0.5,
    }
});