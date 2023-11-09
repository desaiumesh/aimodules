import { StyleSheet, View, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react';
import useAsyncStorage from '../storage/useAsyncStorage';
import { Text, IconButton, Divider, Switch } from 'react-native-paper';
import { PreferencesContext } from '../components/PreferencesContext';

const SettingsAIHomeScreen = ({navigation}) => {

  const { toggleTheme } = React.useContext(PreferencesContext);

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
          <Text style={styles.settingsText}>Biometrics </Text>
          <Switch
            value={isBiometricsEnabled}
            onValueChange={toggleBiometrics} />
        </View>
        <Divider style={styles.divider} />
        <View style={styles.innerContainer}>
          <Text style={styles.settingsText}>Dark Theme</Text>
          <Switch
            value={isDarkTheme}
            onValueChange={toggleDarkTheme} />
        </View>
        <Divider style={styles.divider} />
        <View style={styles.innerContainerWithButton}>
          <Text style={styles.settingsText}>Theme Colour</Text>
          <IconButton icon="arrow-right-bold" mode="contained" onPress={() => navigation.navigate('SettingsThemeColor')}></IconButton>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.innerContainerWithButton}>
          <Text style={styles.settingsText}>Resources</Text>
          <IconButton icon="arrow-right-bold" mode="contained" onPress={() => navigation.navigate('SettingsResources')}></IconButton>
        </View>
        <Divider style={styles.divider} />
      </View>
    </ImageBackground>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    borderWidth: 1,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  innerContainerWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 10,
  },
  innerSaveContainer: {
    alignItems: 'flex-end',
    paddingLeft: 10
  },
  settingsText: {
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
  resourcetext: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 10,
    flex: 1,
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
  keyInputStyles: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 5,
  },
  inputStyles: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,

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


export default SettingsAIHomeScreen;