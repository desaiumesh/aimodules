import React, { useEffect } from 'react'
import DrawerContent from '../components/DrawerContent';
import HomeAIScreen from './HomeAIScreen';
import TextAIScreen from './TextAIScreen';
import SpeechAIScreen from './SpeechAIScreen';
import VisionAIScreen from './VisionAIScreen';
import SettingsAIScreen from './SettingsAIScreen';
import ClassificationAIScreen from './ClassificationAIScreen';
import ClassificationAITrainingScreen from './ClassificationAITrainingScreen';
import OpenAIChatScreen from './OpenAIChatScreen';
import Header from '../components/Header';
import SplashScreen from 'react-native-splash-screen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import OpenAIDallEScreen from './OpenAIDallEScreen';

const MainAIScreen = ({color}) => {

    const Drawer = createDrawerNavigator();

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <Drawer.Navigator
            screenOptions={{
                header: (props) => <Header color={color} {...props} />,
                drawerStyle: {
                    width: 175,
                },
            }}
            drawerContent={() => <DrawerContent />} >
            <Drawer.Screen name="Home" component={HomeAIScreen} />
            <Drawer.Screen name="Text" component={TextAIScreen} />
            <Drawer.Screen name="Speech" component={SpeechAIScreen} />
            <Drawer.Screen name="Vision" component={VisionAIScreen} />
            <Drawer.Screen name="Train" component={ClassificationAITrainingScreen} />
            <Drawer.Screen name="Classify" component={ClassificationAIScreen} />
            <Drawer.Screen name="Settings" component={SettingsAIScreen} />
            <Drawer.Screen name="Chat" component={OpenAIChatScreen} />
            <Drawer.Screen name="Image" component={OpenAIDallEScreen} />
        </Drawer.Navigator>
    )
}

export default MainAIScreen;