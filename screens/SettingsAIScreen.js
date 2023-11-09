import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import SettingsAIResourcesScreen from './SettingsAIResourcesScreen';
import SettingsAIHomeScreen from './SettingsAIHomeScreen';
import SettingsAIThemeColorsScreen from './SettingsAIThemeColorsScreen';

const SettingsAIScreen = () => {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="SettingsHome" component={SettingsAIHomeScreen} />
      <Stack.Screen name="SettingsResources" component={SettingsAIResourcesScreen} />
      <Stack.Screen name="SettingsThemeColor" component={SettingsAIThemeColorsScreen} />
    </Stack.Navigator>
  )
}

export default SettingsAIScreen;

