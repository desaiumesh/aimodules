import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer,  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme, } from '@react-navigation/native';
import DrawerContent from './components/DrawerContent';
import HomeAIScreen from './screens/HomeAIScreen';
import TextAIScreen from './screens/TextAIScreen';
import SpeechAIScreen from './screens/SpeechAIScreen';
import App_mic_input from './screens/App_mic_input';
import { MD3DarkTheme, MD3LightTheme, PaperProvider} from 'react-native-paper';
import merge from 'deepmerge';
import { useTheme } from 'react-native-paper';
import Header from './components/Header';

const darkRedColors={
  "colors": {
    "primary": "rgb(84, 219, 200)",
    "onPrimary": "rgb(0, 55, 49)",
    "primaryContainer": "rgb(0, 80, 71)",
    "onPrimaryContainer": "rgb(116, 248, 228)",
    "secondary": "rgb(177, 204, 198)",
    "onSecondary": "rgb(28, 53, 49)",
    "secondaryContainer": "rgb(51, 75, 71)",
    "onSecondaryContainer": "rgb(204, 232, 226)",
    "tertiary": "rgb(173, 202, 229)",
    "onTertiary": "rgb(20, 51, 73)",
    "tertiaryContainer": "rgb(45, 74, 96)",
    "onTertiaryContainer": "rgb(203, 230, 255)",
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
    "inversePrimary": "rgb(0, 107, 95)",
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

const darkTheme ={
...MD3DarkTheme,
...darkRedColors
};

const CombinedRedDarkTheme = merge(darkTheme, NavigationDarkTheme);

function App(): JSX.Element {

  const theme = useTheme();
  const Drawer = createDrawerNavigator();

  return (
    <PaperProvider theme={CombinedRedDarkTheme}>
      <NavigationContainer theme={CombinedRedDarkTheme}>
        <Drawer.Navigator 
         screenOptions={{ header: (props) => <Header {...props} /> }}
         drawerContent={() => <DrawerContent />} >
          <Drawer.Screen name="Home" component={HomeAIScreen}/>
          <Drawer.Screen name="Text" component={TextAIScreen} />
          <Drawer.Screen name="Speech" component={SpeechAIScreen} />
          <Drawer.Screen name="AppMic" component={App_mic_input} />

        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}



export default App;