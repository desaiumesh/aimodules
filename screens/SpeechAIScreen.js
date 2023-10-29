import React, { Component, useState, useEffect } from 'react';
import {
  ImageBackground, PermissionsAndroid, StyleSheet,
  View, TouchableOpacity, LogBox, ScrollView, TouchableHighlight
} from 'react-native';
import 'react-native-get-random-values';
import 'node-libs-react-native/globals';
import {
  AudioConfig, AudioInputStream,
  ResultReason, SpeechConfig, SpeechTranslationConfig,
  TranslationRecognizer, SpeechSynthesizer, SpeakerAudioDestination, AudioOutputStream, CancellationDetails
} from 'microsoft-cognitiveservices-speech-sdk';
import AudioRecord from 'react-native-live-audio-stream';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SelectList } from 'react-native-dropdown-select-list'
import { appStyles } from '../styles/appStyle';
LogBox.ignoreLogs(['new NativeEventEmitter']);
import { Text, TextInput, Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import Video from 'react-native-video';



const RESOURCE_KEY = "8b2ccf3a18f44b1182d976b6329d68ad";
const RESOURCE_REGION = "australiaeast";

const SpeechAIScreen = () => {
  const [theme, setTheme] = useState();

  const [storedFile, setStoredFile] = useState("/data/user/0/com.aimodules/files/aiaudio6.mp3");
 const[pauseFile, setPauseFile] = useState(true);

  const appTheme = useTheme();

  const key = RESOURCE_KEY;
  const region = RESOURCE_REGION;

  const channels = 1;
  const bitsPerChannel = 16;
  const sampleRate = 16000;

  let initializedCorrectly = false;
  let recognizer;

  const [selectedSource, setSelectedSource] = useState("");
  const [selectedTarget, setTargetSelected] = useState("");
  const [sourceLanguages, setSourceLanguages] = useState([]);
  const [targetLanguages, setTargetLanguages] = useState([]);

  const [sourceLanguagesText, setSourceLanguagesText] = useState("");
  const [targetLanguagesText, setTargetLanguagesText] = useState("");

  const allLanguageData = [
    { key: '1', value: '', LanguageName: "English", LanguageGenderName: "English (United States) Female", LanguageCode: "en", LocaleBCP47: "en-US", Voice: "en-US-JennyNeural" },
    { key: '2', value: '', LanguageName: "English", LanguageGenderName: "English (United States) Male", LanguageCode: "en", LocaleBCP47: "en-US", Voice: "en-US-GuyNeural" },
    { key: '3', value: '', LanguageName: "Marathi", LanguageGenderName: "Marathi (India) Female", LanguageCode: "mr", LocaleBCP47: "mr-IN", Voice: "mr-IN-AarohiNeural" },
    { key: '4', value: '', LanguageName: "Marathi", LanguageGenderName: "Marathi (India) Male", LanguageCode: "mr", LocaleBCP47: "mr-IN", Voice: "mr-IN-ManoharNeural" },
    { key: '5', value: '',LanguageName : "Kannada", LanguageGenderName : "Kannada (India) Female", LanguageCode : "kn", LocaleBCP47 : "kn-IN", Voice : "kn-IN-SapnaNeural" },
    { key: '6', value: '',LanguageName : "Kannada", LanguageGenderName : "Kannada (India) Male", LanguageCode : "kn", LocaleBCP47 : "kn-IN", Voice : "kn-IN-GaganNeural" },
    { key: '7', value: '',LanguageName : "Gujarati", LanguageGenderName : "Gujarati (India) Female", LanguageCode : "gu", LocaleBCP47 : "gu-IN", Voice : "gu-IN-DhwaniNeural" },
    { key: '8', value: '',LanguageName : "Gujarati", LanguageGenderName : "Gujarati (India) Male", LanguageCode : "gu", LocaleBCP47 : "gu-IN", Voice : "gu-IN-NiranjanNeural" },
    { key: '9', value: '',LanguageName : "Telugu", LanguageGenderName : "Telugu (India) Female", LanguageCode : "te", LocaleBCP47 : "te-IN", Voice : "te-IN-ShrutiNeural" },
    { key: '10', value: '',LanguageName : "Telugu", LanguageGenderName : "Telugu (India) Male", LanguageCode : "te", LocaleBCP47 : "te-IN", Voice : "te-IN-MohanNeural" },
    { key: '11', value: '',LanguageName : "Hindi", LanguageGenderName : "Hindi (India) Female", LanguageCode : "hi", LocaleBCP47 : "hi-IN", Voice : "hi-IN-SwaraNeural " },
    { key: '12', value: '',LanguageName : "Hindi", LanguageGenderName : "Hindi (India) Male", LanguageCode : "hi", LocaleBCP47 : "hi-IN", Voice : "hi-IN-MadhurNeural" },
    
    { key: '13', value: '',LanguageName : "Urdu", LanguageGenderName : "Urdu (India) Female", LanguageCode : "ur", LocaleBCP47 : "ur-IN", Voice : "ur-IN-GulNeural" },
    { key: '14', value: '',LanguageName : "Urdu", LanguageGenderName : "Urdu (India) Male", LanguageCode : "ur", LocaleBCP47 : "ur-IN", Voice : "ur-IN-SalmanNeural" },
    { key: '15', value: '',LanguageName : "Spanish", LanguageGenderName : "Spanish (Argentina) Female", LanguageCode : "es", LocaleBCP47 : "es-AR", Voice : "es-AR-ElenaNeural" },
    { key: '16', value: '',LanguageName : "Spanish", LanguageGenderName : "Spanish (Argentina) Male", LanguageCode : "es", LocaleBCP47 : "es-AR", Voice : "es-AR-TomasNeural" },
    { key: '17', value: '',LanguageName : "French", LanguageGenderName : "French Female", LanguageCode : "fr", LocaleBCP47 : "fr-FR", Voice : "fr-FR-DeniseNeural" },
    { key: '18', value: '',LanguageName : "French", LanguageGenderName : "French Male", LanguageCode : "fr", LocaleBCP47 : "fr-FR", Voice : "fr-FR-HenriNeural" },
   
  ]

  useEffect(() => {

    setPauseFile(true);
    setTheme(appTheme);

    allLanguageData.forEach(element => {

      const found = sourceLanguages.some(el => el.value === element.LanguageName)

      if (!found) {
        sourceLanguages.push({
          key: element.key,
          value: element.LanguageName,
        });
      }
    });

    allLanguageData.forEach(element => {

      const found = targetLanguages.some(el => el.value === element.LanguageGenderName)

      if (!found) {
        targetLanguages.push({
          key: element.key,
          value: element.LanguageGenderName,
        });
      }

    });

  }, []);

  //prompt for permissions if not granted
  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external storage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  };

  //sets up speechrecognizer and audio stream
  const initializeAudio = async () => {
    setPauseFile(true);

    if (!selectedSource) {
      alert("Please select source language");
      return;
    }

    if (!selectedTarget) {
      alert("Please select target language");
      return;
    }

    await checkPermissions();

    const sourceLanguageObj = allLanguageData.find(element => element.key === selectedSource);
    const language = sourceLanguageObj.LocaleBCP47;

    const targetLanguageObj = allLanguageData.find(element => element.key === selectedTarget);
    const targetLanguage = targetLanguageObj.LanguageCode;

    if (!initializedCorrectly) {

      //creates a push stream system which allows new data to be pushed to the recognizer
      const pushStream = AudioInputStream.createPushStream();
      const options = {
        sampleRate,
        channels,
        bitsPerChannel,
        audioSource: 6,
      };

      AudioRecord.init(options);
      //everytime data is recieved from the mic, push it to the pushStream
      AudioRecord.on('data', (data) => {
        const pcmData = Buffer.from(data, 'base64');
        pushStream.write(pcmData);
      });

      AudioRecord.start();

      const speechTranslationConfig = SpeechTranslationConfig.fromSubscription(key, region);
      speechTranslationConfig.speechRecognitionLanguage = language;
      speechTranslationConfig.addTargetLanguage(targetLanguage);

      const audioConfig = AudioConfig.fromStreamInput(pushStream);
      recognizer = new TranslationRecognizer(speechTranslationConfig, audioConfig);

      setSourceLanguagesText("");
      setTargetLanguagesText("");

      let sourceLText = "";
      let targetLText = "";

      recognizer.recognized = (s, e) => {

        let reason = e.result.reason;

        if (reason === ResultReason.TranslatedSpeech) {

          sourceLText = sourceLText + `${e?.result?.text}`;
          setSourceLanguagesText(sourceLText);

          for (let object of e?.result?.translations?.privMap?.privValues) {
            targetLText = targetLText + `${object}.`;
          }

          setTargetLanguagesText(targetLText);
        }

      };

      recognizer.startContinuousRecognitionAsync(() => {
        console.log("startContinuousRecognitionAsync");
      },
        (err) => {
          console.log(err);
        });

      initializedCorrectly = true;
    }
  };

  //stops the audio stream and recognizer
  const stopAudio = async () => {
    AudioRecord.stop();
    if (!!recognizer) {
      recognizer.stopContinuousRecognitionAsync();
      initializedCorrectly = false;
    }

    await synthetize()
  };

  const synthetize = async () => {

    const speechConfig = SpeechConfig.fromSubscription(key, region);

    const targetLanguageObj = allLanguageData.find(element => element.key === selectedTarget);
    const targetVoice = targetLanguageObj.Voice;
  
    speechConfig.speechSynthesisVoiceName = targetVoice;
    console.log(targetVoice);

    var stream = AudioOutputStream.createPullStream();
    let streamConfig = AudioConfig.fromStreamOutput(stream);

    let speechSynthesizer = new SpeechSynthesizer(speechConfig, streamConfig);

    // The event synthesis completed signals that the synthesis is completed.
    speechSynthesizer.synthesisCompleted = async function (s, e) {
      console.log("synthesisCompleted");
    
      var arrayBufferData = new ArrayBuffer(320000);
      let st = await stream.read(arrayBufferData);
    
      console.log(arrayBufferData.byteLength);

      console.log("write to file");
      var RNFS = require('react-native-fs');
      var path = RNFS.DocumentDirectoryPath + '/aiaudio6.mp3';
      console.log(path);

      var bt = Buffer.from(arrayBufferData).toString('base64');

      RNFS.writeFile(path, bt, 'base64')
        .then((success) => {
          console.log('FILE WRITTEN!');
        })
        .catch((err) => {
          console.log(err.message);
        });

      console.log("synthesisCompleted1");

      setStoredFile(path);
      setPauseFile(false);
    };

    // The synthesis started event signals that the synthesis is started.
    speechSynthesizer.synthesisStarted = function (s, e) {
      console.log("(synthesis started)");
    };

    // The event signals that the service has stopped processing speech.
    // This can happen when an error is encountered.
    speechSynthesizer.SynthesisCanceled = function (s, e) {
      var cancellationDetails = CancellationDetails.fromResult(e.result);
      var str = "(cancel) Reason: " + sdk.CancellationReason[cancellationDetails.reason];
      if (cancellationDetails.reason === sdk.CancellationReason.Error) {
        str += ": " + e.result.errorDetails;
      }
      console.log(str);
    };

    console.log(targetLanguagesText);
    let text = targetLanguagesText;

    speechSynthesizer.speakTextAsync(
      text,
      function (result) {

        speechSynthesizer.close();
        speechSynthesizer = undefined;

      },
      function (err) {
        console.log(err);
        speechSynthesizer.close();
      })
  };

  return (<ImageBackground source={require('../assets/speech.jpg')}
    style={styles.image}
    imageStyle={styles.imageStyle}
    resizeMode="cover">

    <View style={styles.container}>
      <SelectList
        setSelected={setSelectedSource}
        data={sourceLanguages}
        arrowicon={<Ionicons name="chevron-down" size={20} color={'white'} />}
        searchicon={<Ionicons name="search" size={20} color={'white'} />}
        closeicon={<Ionicons name="close" size={20} color={'white'} />}
        search={true}
        placeholder="Select Source Language"
        searchPlaceholder='Search Source Language'
        boxStyles={styles.boxStyles}
        inputStyles={styles.inputStyles}
        dropdownStyles={styles.dropdownStyles}

      />

      <SelectList
        setSelected={setTargetSelected}
        data={targetLanguages}
        arrowicon={<Ionicons name="chevron-down" size={20} color={'white'} />}
        searchicon={<Ionicons name="search" size={20} color={'white'} />}
        closeicon={<Ionicons name="close" size={20} color={'white'} />}
        search={true}
        placeholder="Select Target Language"
        searchPlaceholder='Search Target Language'
        boxStyles={styles.boxStyles}
        inputStyles={styles.inputStyles}
        dropdownStyles={styles.dropdownStyles}
      />

      <View style={styles.buttonConatiner}>

        <Button style={styles.button} icon="microphone" mode="contained" onPress={() => { initializeAudio() }}>Start</Button>
        <Button style={styles.button} icon="microphone" mode="contained" onPress={() => { stopAudio() }}>Stop</Button>

      </View>
      <ScrollView>
        <Text style={styles.textSource} multiline={true}>{sourceLanguagesText}</Text>
        <Text style={styles.textSource} multiline={true}>{targetLanguagesText}</Text>
        
      <Video
          source={{uri: 'file:///data/user/0/com.aimodules/files/aiaudio6.mp3'}}
          shouldPlay={false}
          resizeMode="cover"
          style={{ width: 1, height: 1 }}
          isMuted={false}
          paused={pauseFile} />

      </ScrollView>
    </View>
  </ImageBackground>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginRight: 20,
    marginLeft: 20,
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
    opacity: 0.5
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
    fontSize: 15,
    backgroundColor: appStyles.whiteColor,
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


export default SpeechAIScreen;