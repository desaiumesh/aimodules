import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { appStyles } from '../styles/appStyle';
import { Avatar, Drawer } from 'react-native-paper';
import { PreferencesContext } from '../components/PreferencesContext';

import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';

const DrawerContent = () => {

    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const { isLoggedOut } = React.useContext(PreferencesContext);

    logout = () => {
        isLoggedOut();
    };

    return (
        <DrawerContentScrollView>
            <View>
                <Drawer.Section>
                    <Drawer.Item label="Home" icon="home" onPress={() => { navigation.navigate('Home') }} />
                </Drawer.Section>

                <Drawer.Section >
                    <Drawer.Item label="Text" icon="text" onPress={() => { navigation.navigate('Text') }} />
                    <Drawer.Item label="Speech" icon="microphone" onPress={() => { navigation.navigate('Speech') }} />
                    <Drawer.Item label="Vision" icon="laptop" onPress={() => { navigation.navigate('Vision') }} />
                    <Drawer.Item label="Avatar" icon="robot" onPress={() => { navigation.navigate('Avatar') }} />
                </Drawer.Section>
                <Drawer.Section title='Classification' >
                    <Drawer.Item label="Train" icon="cog" onPress={() => { navigation.navigate('Train') }} />
                    <Drawer.Item label="Test" icon="image-area" onPress={() => { navigation.navigate('Classify') }} />
                </Drawer.Section>

                <Drawer.Section title='Open AI' >
                    <Drawer.Item label="AI chat" icon="chat" onPress={() => { navigation.navigate('Chat') }} />
                    <Drawer.Item label="Image" icon="image" onPress={() => { navigation.navigate('Image') }} />
                </Drawer.Section>
                <Drawer.Item label="Settings" icon="cog" onPress={() => { navigation.navigate('Settings') }} />

                <Drawer.Item label="Log Out" icon="logout" onPress={() => { logout() }} />

            </View>
        </DrawerContentScrollView>
    )
};

export default DrawerContent;