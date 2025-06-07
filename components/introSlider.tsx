import { StyleSheet, FlatList, Text, View, NativeSyntheticEvent, NativeScrollEvent, ViewToken } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedRef } from 'react-native-reanimated';
import React, { useRef, useState } from 'react';
import IntroSlideItem from './introSlideItem';
import Slides from '../data';
import IntroSlideDots from './introSlideDots';


const IntroSlider: React.FC = () => {
    const scrollX = useSharedValue(0);
    const [index, setIndex] = useState(0);
    const flatListRef = useAnimatedRef<FlatList<any>>();

    const handleOnScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });
        

    const handleOnViewableItemsChange = useRef (({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
        console.log('viewableItems', viewableItems)
        setIndex(viewableItems[0]?.index ?? 0);
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    return (
        <View>
            <Animated.FlatList data={Slides} ref={flatListRef} renderItem = {({ item, index }) => <IntroSlideItem item={item} index={index} scrollX={scrollX} goToNextSlide={() => {}}/>} horizontal pagingEnabled snapToAlignment='center' showsHorizontalScrollIndicator={false} onScroll={handleOnScroll} onViewableItemsChanged={handleOnViewableItemsChange} viewabilityConfig={viewabilityConfig}/>
            <IntroSlideDots data={Slides} scrollX={scrollX} index={index}/>
        </View>
    );
};

export default IntroSlider;
