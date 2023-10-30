import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  NavigationContainer, DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import DrawerContent from './components/DrawerContent';
import HomeAIScreen from './screens/HomeAIScreen';
import TextAIScreen from './screens/TextAIScreen';
import SpeechAIScreen from './screens/SpeechAIScreen';
import App_mic_input from './screens/App_mic_input';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import merge from 'deepmerge';
import { useTheme } from 'react-native-paper';
import Header from './components/Header';
import { StatusBar, View } from 'react-native';
import { PreferencesContext } from './components/PreferencesContext';

const darkColors = {
  "colors": {
    "primary": "rgb(85, 219, 198)",
    "onPrimary": "rgb(0, 55, 48)",
    "primaryContainer": "rgb(0, 80, 71)",
    "onPrimaryContainer": "rgb(118, 248, 226)",
    "secondary": "rgb(177, 204, 197)",
    "onSecondary": "rgb(28, 53, 48)",
    "secondaryContainer": "rgb(51, 75, 70)",
    "onSecondaryContainer": "rgb(205, 232, 225)",
    "tertiary": "rgb(172, 202, 229)",
    "onTertiary": "rgb(19, 51, 72)",
    "tertiaryContainer": "rgb(44, 74, 96)",
    "onTertiaryContainer": "rgb(202, 230, 255)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "rgb(25, 28, 27)",
    "onBackground": "rgb(224, 227, 225)",
    "surface": "rgb(25, 28, 27)",
    "onSurface": "rgb(224, 227, 225)",
    "surfaceVariant": "rgb(63, 73, 70)",
    "onSurfaceVariant": "rgb(190, 201, 197)",
    "outline": "rgb(137, 147, 144)",
    "outlineVariant": "rgb(63, 73, 70)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(224, 227, 225)",
    "inverseOnSurface": "rgb(45, 49, 48)",
    "inversePrimary": "rgb(0, 107, 94)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(28, 38, 36)",
      "level2": "rgb(30, 43, 41)",
      "level3": "rgb(32, 49, 46)",
      "level4": "rgb(32, 51, 48)",
      "level5": "rgb(33, 55, 51)"
    },
    "surfaceDisabled": "rgba(224, 227, 225, 0.12)",
    "onSurfaceDisabled": "rgba(224, 227, 225, 0.38)",
    "backdrop": "rgba(41, 50, 48, 0.4)"
  }
};

const lightColors = {
  "colors": {
    "primary": "rgb(0, 107, 94)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(118, 248, 226)",
    "onPrimaryContainer": "rgb(0, 32, 27)",
    "secondary": "rgb(74, 99, 94)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(205, 232, 225)",
    "onSecondaryContainer": "rgb(6, 32, 27)",
    "tertiary": "rgb(68, 97, 121)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(202, 230, 255)",
    "onTertiaryContainer": "rgb(0, 30, 48)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(250, 253, 251)",
    "onBackground": "rgb(25, 28, 27)",
    "surface": "rgb(250, 253, 251)",
    "onSurface": "rgb(25, 28, 27)",
    "surfaceVariant": "rgb(218, 229, 225)",
    "onSurfaceVariant": "rgb(63, 73, 70)",
    "outline": "rgb(111, 121, 118)",
    "outlineVariant": "rgb(190, 201, 197)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(45, 49, 48)",
    "inverseOnSurface": "rgb(239, 241, 239)",
    "inversePrimary": "rgb(85, 219, 198)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(238, 246, 243)",
      "level2": "rgb(230, 241, 238)",
      "level3": "rgb(223, 237, 234)",
      "level4": "rgb(220, 236, 232)",
      "level5": "rgb(215, 233, 229)"
    },
    "surfaceDisabled": "rgba(25, 28, 27, 0.12)",
    "onSurfaceDisabled": "rgba(25, 28, 27, 0.38)",
    "backdrop": "rgba(41, 50, 48, 0.4)"
  }
};

const darkPaperTheme = {
  ...MD3DarkTheme,
  ...darkColors
};

const lightPaperTheme = {
  ...MD3LightTheme,
  ...lightColors
};

const CombinedNavigationDarkTheme = merge(darkPaperTheme, NavigationDarkTheme);
const CombinedNavigationLightTheme = merge(lightPaperTheme, NavigationDefaultTheme);

function App(): JSX.Element {

  const [isThemeDark, setIsThemeDark] = React.useState(true);

  let themeNv = isThemeDark ? CombinedNavigationDarkTheme : CombinedNavigationLightTheme;
  let themeProvider = isThemeDark ? darkPaperTheme : lightPaperTheme;
  let statusBarColor = isThemeDark ? themeProvider.colors.onPrimary:themeProvider.colors.primary;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  const Drawer = createDrawerNavigator();

 

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={themeProvider}>
      <NavigationContainer theme={themeNv}>
        <View>
          <StatusBar
            backgroundColor={statusBarColor}
            barStyle="light-content"
          />
        </View>
        <Drawer.Navigator
          screenOptions={{ header: (props) => <Header color={statusBarColor} {...props} /> }}
          drawerContent={() => <DrawerContent />} >

          <Drawer.Screen name="Home" component={HomeAIScreen} />
          <Drawer.Screen name="Text" component={TextAIScreen} />
          <Drawer.Screen name="Speech" component={SpeechAIScreen} />
          <Drawer.Screen name="AppMic" component={App_mic_input} />

        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
    </PreferencesContext.Provider>
    
  );
}



export default App;