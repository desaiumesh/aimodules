import { StyleSheet, View, ImageBackground, Switch } from 'react-native'
import React from 'react';
import useAsyncStorage from '../storage/useAsyncStorage';
import { Text, TextInput, IconButton, Divider } from 'react-native-paper';
import { PreferencesContext } from '../components/PreferencesContext';

const SettingsAIScreen = () => {

  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);

  const [isBiometricsEnabled, setIsBiometricsEnabled] = useAsyncStorage('isBiometricsEnabled', true);
  const [isDarkTheme, setIsDarkTheme] = useAsyncStorage('isDarkTheme', true);

  const toggleBiometrics = () => {
    setIsBiometricsEnabled(!isBiometricsEnabled);
  };

  const toggleDarkTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    toggleTheme();
  };

  return (

    <ImageBackground source={require('../assets/AI2.jpg')}
      style={styles.image}
      imageStyle={styles.imageStyle}
      resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.biometricsText}>Biometrics </Text>
          <Switch
            value={isBiometricsEnabled}
            onValueChange={toggleBiometrics} />
        </View>
        <Divider borderWidth={1}/>
        <View style={styles.innerContainer}>
          <Text style={styles.biometricsText}>Dark theme </Text>
          <Switch
            value={isDarkTheme}
            onValueChange={toggleDarkTheme} />
        </View>
        <Divider borderWidth={1}/>
      </View>
    </ImageBackground>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  biometricsText: {
    bottom: 0,
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 10,
  },
  image: {
    flex: 1,
    justifyContent: 'center'
  },
  imageStyle: {
    opacity: 0.2
  },
  boxStyles: {
    borderRadius: 10,
    margin: 10,
    opacity: 0.7,
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  inputStyles: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  dropdownStyles: {
    opacity: 0.7,
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 15
  },
  buttonConatiner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  textSource: {
    height: 150,
    borderWidth: 2,
    margin: 10,
    fontSize: 16,
    borderRadius: 10,
    padding: 5,
  },
  button: {
    margin: 20,
  }
});


export default SettingsAIScreen;