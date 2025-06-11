import { Text, View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

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
    const navigation = useNavigation<any>();
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
                                    <Text style={styles.title} className="text-white text-center text-2xl font-bold tracking-wide shadow-md">{item.title}</Text>
                                </View>
                                <View className="flex flex-row gap-3 items-center justify-center">
                                    <FontAwesome6 name={isLocked ? 'lock' : 'unlock'} size={28} color="#E0E7FF" shadowColor="#000" shadowOpacity={0.2} shadowOffset={{ width: 0, height: 2 }} shadowRadius={4}/>
                                    <FontAwesome6 name="arrow-right-long" size={28} color="#C084FC" shadowColor="#000" shadowOpacity={0.2} shadowOffset={{ width: 0, height: 2 }} shadowRadius={4}/>
                                    <FontAwesome6 name={isLocked ? 'unlock' : 'lock'} size={28} color="#E0E7FF" shadowColor="#000" shadowOpacity={0.2} shadowOffset={{ width: 0, height: 2 }} shadowRadius={4}/>
                                </View>
                                <Text style={styles.description} className="text-gray-200 mt-2 text-base tracking-wide shadow-black shadow-sm">
                                    {item.description}
                                </Text>
                                <TouchableOpacity onPress={goToNextSlide} style={styles.button}>
                                    <Text className="text-purple-700 font-semibold">Next</Text>
                                </TouchableOpacity>
                            </>
                        );
            
                    case 2:
                        return (
                            <>
                                <Text style={styles.title} className="text-white text-center text-2xl font-bold tracking-wide shadow-md">{item.title}</Text>
                                <Animatable.View animation="fadeInUp" delay={300} duration={600} className="mt-4 flex flex-col space-y-4 w-full px-8 gap-3">
                                {/* Password Generator */}
                                <View className="bg-white/10 rounded-xl p-4 flex items-center space-x-4 gap-3">
                                    <View className="flex flex-row gap-3 items-center justify-center">
                                        <FontAwesome6 name="gear" size={24} color="#C084FC" />
                                        <Text className="font-bold text-purple-200 text-base">Password Generator</Text>
                                    </View>
                                    <Text className="text-sm text-gray-300 text-center">Generate secure and random passwords effortlessly.</Text>
                                </View>

                                {/* Password Checker */}
                                <View className="bg-white/10 rounded-xl p-4 flex items-center space-x-4 gap-3">
                                    <View className="flex flex-row gap-3 items-center justify-center">
                                        <FontAwesome6 name="check-circle" size={24} color="#C084FC" />
                                        <Text className="font-bold text-purple-200 text-base">Password Checker</Text>
                                    </View>
                                    <Text className="text-sm text-gray-300 text-center">Assess the strength of your passwords in real-time.</Text>
                                </View>
                                
                                {/* Password Manager */}
                                <View className="bg-white/10 rounded-xl p-4 flex items-center space-x-4 gap-3">
                                    <View className="flex flex-row gap-3 items-center justify-center">
                                        <FontAwesome6 name="shield-alt" size={24} color="#C084FC" />
                                        <Text className="font-bold text-purple-200 text-base">Password Manager</Text>
                                    </View>
                                    <Text className="text-sm text-gray-300 text-center">Store and manage your passwords securely and conveniently.</Text>
                                </View>
                                </Animatable.View>
                                <TouchableOpacity onPress={goToNextSlide} style={styles.button}>
                                    <Text className="text-purple-700 font-semibold">Next</Text>
                                </TouchableOpacity>
                            </>
                        );
            
                    default:
                        return (
                            <>
                                <Text style={styles.title} className="text-white text-center text-2xl font-bold shadow-md">{item.title}</Text>
                                <Animatable.View animation="fadeInUp" delay={300} duration={600} className="mt-1 flex flex-col space-y-4">
                                    <View className="flex-row flex-wrap justify-center gap-2">
                                        {[
                                            'Robust Password Generator',
                                            'Customizable Length',
                                            'Flexible Character Set',
                                            'Instant Copy',
                                            'Quick Refresh',
                                            'Secure Storage',
                                        ].map((feature, idx) => (
                                            <View key={idx} className="bg-white/10 px-3 py-2 rounded-full shadow shadow-black/20">
                                                <Text className="text-white text-sm font-semibold">{feature}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </Animatable.View>
                                <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.button}>
                                    <Text className="text-purple-700 font-semibold">Get Started</Text>
                                </TouchableOpacity>
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
        paddingHorizontal: 30,
        gap: 25,
    },
    title: {
        fontSize: 25,
        fontWeight: '800',
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
    },
    button: {
        marginTop: 40,
        backgroundColor: 'white',
        paddingVertical: 12,
        alignItems: 'center',
        alignSelf: 'center',
        width: width * 0.7,
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: 'purple',
    },
});