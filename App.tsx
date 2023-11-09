import 'react-native-gesture-handler';
import * as React from 'react';
import { useEffect } from 'react'
import {
  NavigationContainer, DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import merge from 'deepmerge';
import { StatusBar, View } from 'react-native';
import { PreferencesContext } from './components/PreferencesContext';
import SplashScreen from 'react-native-splash-screen';
import LoginAIScreen from './screens/LoginAIScreen';
import MainAIScreen from './screens/MainAIScreen';
import useAsyncStorage from './storage/useAsyncStorage';
import * as constants from './constants/constants';


function App(): JSX.Element {

  const [isDefaultThemeColours, setIsDefaultThemeColours] = useAsyncStorage('isDefaultThemeColours', true);
  const [darkColours, setDarkColours] = useAsyncStorage('darkColours');
  const [lightColours, setLightColours] = useAsyncStorage('lightColours');

  let darkThemeColors = constants.darkColors;
  let lightThemeColors = constants.lightColors;

  var darkPaperTheme = {
    ...MD3DarkTheme,
    ...darkThemeColors
  };

  var lightPaperTheme = {
    ...MD3LightTheme,
    ...lightThemeColors
  };

  if (!isDefaultThemeColours) {
    try {

      var darkColours1 = JSON.stringify(darkColours);
      darkThemeColors = JSON.parse(darkColours1);

      var lightColours1 = JSON.stringify(lightColours);
      lightThemeColors = JSON.parse(lightColours1);;

      darkPaperTheme = {
        ...MD3DarkTheme,
        ...darkThemeColors
      };

      lightPaperTheme = {
        ...MD3LightTheme,
        ...lightThemeColors
      };


    } catch (error) {
      console.log("Error Occured:",error);
    }
  }

  var CombinedNavigationDarkTheme = merge(darkPaperTheme, NavigationDarkTheme);
  var CombinedNavigationLightTheme = merge(lightPaperTheme, NavigationDefaultTheme);

  const [isDarkTheme, setIsDarkTheme] = useAsyncStorage('isDarkTheme', true);
  const [isThemeDark, setIsThemeDark] = React.useState(true);
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  let themeNv = isThemeDark ? CombinedNavigationDarkTheme : CombinedNavigationLightTheme;
  let themeProvider = isThemeDark ? darkPaperTheme : lightPaperTheme;
  let statusBarColor = isThemeDark ? themeProvider.colors.onPrimary : themeProvider.colors.primary;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const isLoggedIn = React.useCallback(() => {
    return setIsSignedIn(true);
  }, [isSignedIn]);

  const isLoggedOut = React.useCallback(() => {
    return setIsSignedIn(false);
  }, [isSignedIn]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
      isLoggedIn,
      isLoggedOut,
      isSignedIn
    }),
    [toggleTheme, isThemeDark, isLoggedIn, isLoggedOut, isSignedIn]

  );

  useEffect(() => {
    SplashScreen.hide();
    var isDarkThemeData = isDarkTheme?.toString() === 'true' ? true : false;
    setIsThemeDark(isDarkThemeData);

  }, [isDarkTheme]);

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={themeProvider}>
        <NavigationContainer theme={themeNv}>
          <View>
            <StatusBar
              backgroundColor={statusBarColor}
              barStyle="light-content" />
          </View>
          {isSignedIn ? <MainAIScreen color={statusBarColor} /> : <LoginAIScreen color={statusBarColor} />}

        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}



export default App;