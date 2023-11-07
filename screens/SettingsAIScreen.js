import { StyleSheet, View, ImageBackground, Switch, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react';
import useAsyncStorage from '../storage/useAsyncStorage';
import { Text, TextInput, IconButton, Divider, Button } from 'react-native-paper';
import { PreferencesContext } from '../components/PreferencesContext';
import AIResource from '../components/AIResource';

const SettingsAIScreen = () => {

  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);

  const [isBiometricsEnabled, setIsBiometricsEnabled] = useAsyncStorage('isBiometricsEnabled', true);
  const [isDarkTheme, setIsDarkTheme] = useAsyncStorage('isDarkTheme', true);

  const [textResource, SetTextResource] = useAsyncStorage("textResource", null);
  const [textKey, SetTextKey] = useState('3a04cc4d49624e1f920ec4a1adb62aa8');
  const [textRegion, SetTextRegion] = useState('australiaeast');

  const [speechResource, SetSpeechResource] = useAsyncStorage("speechResource", null);
  const [speechKey, SetSpeechKey] = useState('06495201accc4dfcaf847bb1f71252aa');
  const [speechRegion, SetSpeechRegion] = useState('australiaeast');

  const [computerResource, SetComputerResource] = useAsyncStorage("computerResource", null);
  const [computerKey, SetComputerKey] = useState('5e4cd7027f1d46a69fb9d21492b0d1bd');
  const [computerRegion, SetComputerRegion] = useState('australiaeast');

  const [customVisionResource, SetCustomVisionResource] = useAsyncStorage("customVisionResource", null);

  const [customVisionProjectId, SetCustomVisionProjectId] = useState('ba91a0bb-1f42-4777-8ce3-897692e71d5f');

  const [customVisionTrainingKey, SetCustomVisionTrainingKey] = useState('263c89ff01984f109a6f9b8b040e1a20');
  const [customVisionTrainingUrl, SetCustomVisionTrainingUrl] = useState('https://customaiimage.cognitiveservices.azure.com');

  const [customVisionPredictionKey, SetCustomVisionPredictionKey] = useState('fb92bb0d21b74cdfbeb9076b6b9d4b1c');
  const [customVisionPredictionUrl, SetCustomVisionPredictionUrl] = useState('https://customaiimage-prediction.cognitiveservices.azure.com');
  const [cVPublicationPredictionKey, SetCVPublicationPredictionKey] = useState('/subscriptions/bccebad9-cd2c-4d0b-83e5-0f0d6747cecc/resourceGroups/AI-102-ResourceGroup/providers/Microsoft.CognitiveServices/accounts/CustomAIImage-Prediction');

  const [openAIResource, SetOpenAIResource] = useAsyncStorage("openAIResource", null);
  const [openAIKey, SetOpenAIKey] = useState('064e47e4ffce44678ac1fda5522f8f81');
  const [openAIEndpoint, SetOpenAIEndpoint] = useState('https://openaimodules102.openai.azure.com/');

  const toggleBiometrics = () => {
    setIsBiometricsEnabled(!isBiometricsEnabled);
  };

  const toggleDarkTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    toggleTheme();
  };

  const saveResources = () => {
    SetTextResource({ key: textKey, region: textRegion });
    SetSpeechResource({ key: speechKey, region: speechRegion });
    SetComputerResource({ key: computerKey, region: computerRegion });
    SetCustomVisionResource({
      projectId: customVisionProjectId, trainingKey: customVisionTrainingKey, trainingUrl: customVisionTrainingUrl,
      predictionKey: customVisionPredictionKey, predictionUrl: customVisionPredictionUrl, publicationPredictionKey: cVPublicationPredictionKey
    });
    SetOpenAIResource({ key: openAIKey, endpoint: openAIEndpoint });
  };

  useEffect(() => {
    SetTextKey(textResource?.key);
    SetTextRegion(textResource?.region);

    SetSpeechKey(speechResource?.key);
    SetSpeechRegion(speechResource?.region);

    SetComputerKey(computerResource?.key);
    SetComputerRegion(computerResource?.region);

    SetCustomVisionProjectId(customVisionResource?.projectId);
    SetCustomVisionTrainingKey(customVisionResource?.trainingKey);
    SetCustomVisionTrainingUrl(customVisionResource?.trainingUrl);
    SetCustomVisionPredictionKey(customVisionResource?.predictionKey);
    SetCustomVisionPredictionUrl(customVisionResource?.predictionUrl);
    SetCVPublicationPredictionKey(customVisionResource?.publicationPredictionKey);

    SetOpenAIKey(openAIResource?.key);
    SetOpenAIEndpoint(openAIResource?.endpoint);

  }, [isBiometricsEnabled, isDarkTheme, textResource, speechResource, computerResource,
    customVisionResource, openAIResource]);

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
        <Divider style={styles.divider} />
        <View style={styles.innerContainer}>
          <Text style={styles.biometricsText}>Dark Theme</Text>
          <Switch
            value={isDarkTheme}
            onValueChange={toggleDarkTheme} />
        </View>
        <Divider style={styles.divider} />
        <View style={styles.innerContainer}>
          <Text style={styles.biometricsText}>Save Resources</Text>
          <IconButton icon="content-save" mode="contained" onPress={() => { saveResources() }}></IconButton>
        </View>
        <ScrollView>
          <AIResource resourceText='Text Resource'
            firstInputPlaceholder='Key' firstInput={textKey} firstInputChanged={(textKeyValue) => { SetTextKey(textKeyValue); }}
            secondInputPlaceholder='Region' secondInput={textRegion}
            secondInputChanged={(textRegionValue) => { SetTextRegion(textRegionValue); }}>
          </AIResource>
          <Divider style={styles.divider} />
          <AIResource resourceText='Speech Resource'
            firstInputPlaceholder='Key' firstInput={speechKey} firstInputChanged={(speechKeyValue) => { SetSpeechKey(speechKeyValue); }}
            secondInputPlaceholder='Region' secondInput={speechRegion}
            secondInputChanged={(speechRegionValue) => { SetSpeechRegion(speechRegionValue); }}>
          </AIResource>
          <Divider style={styles.divider} />
          <AIResource resourceText='Computer Vision Resource'
            firstInputPlaceholder='Key' firstInput={computerKey}
            firstInputChanged={(computerKeyValue) => { SetComputerKey(computerKeyValue); }}
            secondInputPlaceholder='Region' secondInput={computerRegion}
            secondInputChanged={(computerRegionValue) => { SetComputerRegion(computerRegionValue); }}>
          </AIResource>
          <Divider style={styles.divider} />
          <AIResource resourceText='Custom Vision Training Resource'
            firstInputPlaceholder='Training Key' firstInput={customVisionTrainingKey}
            firstInputChanged={(KeyValue) => { SetCustomVisionTrainingKey(KeyValue); }}
            secondInputPlaceholder='Training Url' secondInput={customVisionTrainingUrl}
            secondInputChanged={(url) => { SetCustomVisionTrainingUrl(url); }}>
          </AIResource>
          <TextInput style={styles.keyInputStyles} placeholder='Project ID' value={customVisionProjectId}
            onChangeText={(text) => SetCustomVisionProjectId(text)} />
          <Divider style={styles.divider} />
          <AIResource resourceText='Custom Vision Prediction Resource'
            firstInputPlaceholder='Prediction Key' firstInput={customVisionPredictionKey} firstInputChanged={(key) => { SetCustomVisionPredictionKey(key); }}
            secondInputPlaceholder='Prediction Url' secondInput={customVisionPredictionUrl}
            secondInputChanged={(url) => { SetCustomVisionPredictionUrl(url); }}>
          </AIResource>
          <TextInput style={styles.keyInputStyles} placeholder='Publication Prediction Key'
            value={cVPublicationPredictionKey}
            onChangeText={(text) => SetCVPublicationPredictionKey(text)} />
          <Divider style={styles.divider} />
          <AIResource resourceText='Open AI Resource'
            firstInputPlaceholder='Key' firstInput={openAIKey} firstInputChanged={(openAIKeyValue) => { SetOpenAIKey(openAIKeyValue); }}
            secondInputPlaceholder='Region' secondInput={openAIEndpoint}
            secondInputChanged={(openAIEndpointValue) => { SetOpenAIEndpoint(openAIEndpointValue); }}>
          </AIResource>
          <Divider style={styles.divider} />
        </ScrollView>
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
  innerSaveContainer: {
    alignItems: 'flex-end',
    paddingLeft: 10
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


export default SettingsAIScreen;