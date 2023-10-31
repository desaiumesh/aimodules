import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { appStyles } from '../styles/appStyle';
import { Drawer } from 'react-native-paper';

import {
    SafeAreaProvider,
    useSafeAreaInsets,
  } from 'react-native-safe-area-context';

const DrawerContent = () => {

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <DrawerContentScrollView>
            <View>
                <Drawer.Item label="Home" icon="home" onPress={() => { navigation.navigate('Home') }} />
                <Drawer.Item label="Text" icon="text" onPress={() => { navigation.navigate('Text') }} />
                <Drawer.Item label="Speech" icon="microphone" onPress={() => { navigation.navigate('Speech') }} />
                <Drawer.Item label="Vision" icon="laptop" onPress={() => { navigation.navigate('Vision') }} />
                <Drawer.Item label="Language" icon="heart" onPress={() => { navigation.navigate('Speech') }} />

            </View>
        </DrawerContentScrollView>
    )
};

export default DrawerContent;