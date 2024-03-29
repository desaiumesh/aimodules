import React, { useState, useEffect } from 'react';
import { ImageBackground, PermissionsAndroid, StyleSheet, View, LogBox, ScrollView } from 'react-native';
import 'react-native-get-random-values';
import 'node-libs-react-native/globals';
import {
  AudioConfig, AudioInputStream, ResultReason, SpeechConfig, SpeechTranslationConfig,
  TranslationRecognizer, SpeechSynthesizer, AudioOutputStream, CancellationDetails, AutoDetectSourceLanguageConfig, LanguageIdMode
} from 'microsoft-cognitiveservices-speech-sdk';
import AudioRecord from 'react-native-live-audio-stream';
import { appStyles } from '../styles/appStyle';
LogBox.ignoreLogs(['new NativeEventEmitter']);
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import Video from 'react-native-video';
import { useIsFocused } from "@react-navigation/native";
import useAsyncStorage from '../storage/useAsyncStorage';
import * as constants from '../constants/constants';
import AISelectList from '../components/AISelectList';

const SpeechAIScreen = () => {

  const [speechResource] = useAsyncStorage("speechResource", null);
  const [allLanguageData] = useAsyncStorage('speakingLanguages', constants.languages);
  const isFocused = useIsFocused();

  let aiAudioFileName = 'aiAudio.mp3';
  let aiAutoAudioFileName = 'aiAutoAudio.mp3';

  const [storedFile, setStoredFile] = useState(undefined);
  const [pauseFile, setPauseFile] = useState(true);
  const [muteFile, setMuteFile] = useState(true);

  const [storedAutoFile, setStoredAutoFile] = useState(undefined);
  const [isAutoSpeak, setIsAutoSpeak] = useState(false);
  const [pauseAutoFile, setPauseAutoFile] = useState(true);
  const [muteAutoFile, setMuteAutoFile] = useState(true);

  const [isMicOn, setIsMicOn] = useState(false);
  const theme = useTheme();

  const key = speechResource?.key;
  const region = speechResource?.region;

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

  const [autoLanguageVoice, setAutoLanguageVoice] = useState("");

  useEffect(() => {

    if (isFocused) {
      setMuteFile(true);
      setPauseFile(false);

      setMuteAutoFile(true);
      setPauseAutoFile(false);
    }

    allLanguageData?.forEach(element => {

      const found = sourceLanguages.some(el => el.value === element.LanguageGenderName)

      if (!found) {
        sourceLanguages.push({
          key: element.key,
          value: element.LanguageGenderName,
        });
      }
    });

    allLanguageData?.forEach(element => {

      const found = targetLanguages.some(el => el.value === element.LanguageGenderName)

      if (!found) {
        targetLanguages.push({
          key: element.key,
          value: element.LanguageGenderName,
        });
      }

    });


    var RNFS = require('react-native-fs');
    var aiAudioFilepath = RNFS.DocumentDirectoryPath + '/' + aiAudioFileName;
    var aiAutoAudioFilepath = RNFS.DocumentDirectoryPath + '/' + aiAutoAudioFileName;

    checkAudioFile(aiAudioFilepath, '');
    checkAudioFile(aiAutoAudioFilepath, '');

  }, [isFocused, allLanguageData]);


  const checkAudioFile = async (path, base64String) => {

    var RNFS = require('react-native-fs');
    RNFS.exists(path)
      .then((exists) => {
        if (!exists) {
          createAudioFile(path, base64String)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createAudioFile = async (path, base64String) => {

    console.log('createAudioFile');
    console.log(path);
    var RNFS = require('react-native-fs');

    RNFS.writeFile(path, base64String, 'base64')
      .then((success) => {
        console.log('New FILE WRITTEN!', path);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

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


  const createTranslationRecognizer = async (isAuto) => {

    const sourceLanguageObj = allLanguageData.find(element => element.key === selectedSource);
    const sourcelanguage = sourceLanguageObj.LanguageCode;
    const sourceLanguageLocale47 = sourceLanguageObj.LocaleBCP47;

    const targetLanguageObj = allLanguageData.find(element => element.key === selectedTarget);
    const targetLanguage = targetLanguageObj.LanguageCode;
    const targetLanguageLocaleBCP47 = targetLanguageObj.LocaleBCP47;

    //creates a push stream system which allows new data to be pushed to the recognizer
    const pushStream = AudioInputStream.createPushStream();
    const options = { sampleRate, channels, bitsPerChannel, audioSource: 6, };

    AudioRecord.init(options);
    //everytime data is recieved from the mic, push it to the pushStream
    AudioRecord.on('data', (data) => {
      const pcmData = Buffer.from(data, 'base64');
      pushStream.write(pcmData);
    });

    AudioRecord.start();

    if (isAuto) {
      // Please replace the service region with your region (e.g. "westus").
      var v2EndpointUrl = new URL(`wss://${region}.stt.speech.microsoft.com/speech/universal/v2`);

      const speechTranslationConfig = SpeechTranslationConfig.fromEndpoint(v2EndpointUrl, key);
      speechTranslationConfig.speechRecognitionLanguage = sourceLanguageLocale47;

      speechTranslationConfig.addTargetLanguage(sourcelanguage);
      speechTranslationConfig.addTargetLanguage(targetLanguage);

      const audioConfig = AudioConfig.fromStreamInput(pushStream);
      var autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig.fromLanguages([sourceLanguageLocale47, targetLanguageLocaleBCP47]);
      autoDetectSourceLanguageConfig.mode = LanguageIdMode.Continuous;
      recognizer = new TranslationRecognizer.FromConfig(speechTranslationConfig, autoDetectSourceLanguageConfig, audioConfig);

    }
    else {
      const speechTranslationConfig = SpeechTranslationConfig.fromSubscription(key, region);
      speechTranslationConfig.speechRecognitionLanguage = sourceLanguageLocale47;
      speechTranslationConfig.addTargetLanguage(targetLanguage);

      const audioConfig = AudioConfig.fromStreamInput(pushStream);
      recognizer = new TranslationRecognizer(speechTranslationConfig, audioConfig);
    }

  };

  //sets up speechrecognizer and audio stream
  const startAudio = async (isAuto) => {

    setPauseFile(true);
    setPauseAutoFile(true);

    if (!selectedSource) {
      alert("Please select source language");
      return;
    }

    if (!selectedTarget) {
      alert("Please select target language");
      return;
    }

    await checkPermissions();

    setIsAutoSpeak(isAuto);

    if (!initializedCorrectly) {

      createTranslationRecognizer(isAuto);
      setIsMicOn(true);

      setSourceLanguagesText("");
      setTargetLanguagesText("");

      let sourceLText = "";
      let targetLText = "";

      const sourceLanguageObj = allLanguageData.find(element => element.key === selectedSource);
      const sourceLanguageGenderName = sourceLanguageObj.LanguageGenderName;

      const targetLanguageObj = allLanguageData.find(element => element.key === selectedTarget);
      const targetLanguageGenderName = targetLanguageObj.LanguageGenderName;

      recognizer.recognized = (s, e) => {

        let reason = e.result.reason;

        if (reason === ResultReason.TranslatedSpeech) {

          if (isAuto) {
            let values = JSON.parse(e?.result?.privProperties?.privValues);

            let primaryLanguage = values?.SpeechPhrase?.PrimaryLanguage?.Language;

            let primaryLanguageText = values?.SpeechPhrase?.DisplayText;

            sourceLText = sourceLText + `${primaryLanguageText}`;
            setSourceLanguagesText(sourceLText);

            for (let translation of values?.Translations) {

              if (translation?.DisplayText !== primaryLanguageText) {
                targetLText = targetLText + `${translation?.DisplayText}.`;

                const foundLanguages = allLanguageData?.find(el => el.LanguageCode === translation?.Language
                  && (el.LanguageGenderName === sourceLanguageGenderName ||
                    el.LanguageGenderName === targetLanguageGenderName));

                setAutoLanguageVoice(foundLanguages.Voice);
              }
            }

            setTargetLanguagesText(targetLText);
          }
          else {
            sourceLText = sourceLText + `${e?.result?.text}`;
            setSourceLanguagesText(sourceLText);

            for (let object of e?.result?.translations?.privMap?.privValues) {
              targetLText = targetLText + `${object}.`;
            }

            setTargetLanguagesText(targetLText);
          }
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
    setIsMicOn(false);

    if (!!recognizer) {
      recognizer.stopContinuousRecognitionAsync();
      initializedCorrectly = false;
    }

    let text = targetLanguagesText;
    let fileName = `/${aiAudioFileName}`;

    const targetLanguageObj = allLanguageData.find(element => element.key === selectedTarget);
    let targetVoice = targetLanguageObj.Voice;

    if (isAutoSpeak) {
      fileName = `/${aiAutoAudioFileName}`;
      targetVoice = autoLanguageVoice;
    }

    await synthetiseAudio(fileName, text, targetVoice);
  };


  const synthetiseAudio = async (fileName, text, targetVoice) => {

    const speechConfig = SpeechConfig.fromSubscription(key, region);

    speechConfig.speechSynthesisVoiceName = targetVoice;

    var stream = AudioOutputStream.createPullStream();
    let streamConfig = AudioConfig.fromStreamOutput(stream);

    let speechSynthesizer = new SpeechSynthesizer(speechConfig, streamConfig);

    // The event synthesis completed signals that the synthesis is completed.
    speechSynthesizer.synthesisCompleted = async function (s, e) {
      var arrayBufferData = new ArrayBuffer(320000);
      let st = await stream.read(arrayBufferData);

      var RNFS = require('react-native-fs');
      var path = RNFS.DocumentDirectoryPath + fileName;

      var bt = Buffer.from(arrayBufferData).toString('base64');

      RNFS.writeFile(path, bt, 'base64')
        .then((success) => {
          console.log('FILE WRITTEN!', path);
        })
        .catch((err) => {
          console.log(err.message);
        });

      if (!isAutoSpeak) {
        setStoredFile(path);
        setMuteFile(false);
        setPauseFile(false);
        setIsAutoSpeak(false);
      }
      else {
        setStoredAutoFile(path);
        setMuteAutoFile(false);
        setPauseAutoFile(false);
      }
    };

    speechSynthesizer.synthesisStarted = function (s, e) {
      console.log("(synthesis started)");
    };

    speechSynthesizer.SynthesisCanceled = function (s, e) {
      var cancellationDetails = CancellationDetails.fromResult(e.result);
      var str = "(cancel) Reason: " + sdk.CancellationReason[cancellationDetails.reason];
      if (cancellationDetails.reason === sdk.CancellationReason.Error) {
        str += ": " + e.result.errorDetails;
      }
      console.log(str);
    };

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

  return (<ImageBackground source={require('../assets/background.jpg')}
    style={constants.aiStyles.imageBackgroundImage}
    imageStyle={constants.aiStyles.imageBackgroundImageStyle}
    blurRadius={1}
    resizeMode="cover">

    <View style={styles.container}>
      <View style={styles.selectContainer}>
        <AISelectList data={sourceLanguages} setSelected={setSelectedSource}
          placeholderText='Select Source Language' searchPlaceholderText='Search Source Language' />
      </View>
      <View style={styles.selectContainer}>
        <AISelectList data={targetLanguages} setSelected={setTargetSelected}
          placeholderText='Select Target Language' searchPlaceholderText='Search Target Language' />
      </View>
      <View style={styles.buttonConatiner}>
        <Button style={styles.button} textColor={(isMicOn & !isAutoSpeak) ? 'red' : theme.colors.onPrimary} icon="microphone" mode="contained" onPress={() => { startAudio(false) }}>Start</Button>
        <Button style={styles.button} icon="microphone-off" mode="contained" onPress={() => { stopAudio() }}>Stop</Button>
        <Button style={styles.button} textColor={(isMicOn & isAutoSpeak) ? 'red' : theme.colors.onPrimary} icon="microphone" mode="contained" onPress={() => { startAudio(true) }}>Auto</Button>
      </View>
      <ScrollView>
        <Text style={styles.textSource} multiline={true}>{sourceLanguagesText}</Text>
        <Text style={styles.textSource} multiline={true}>{targetLanguagesText}</Text>

        <Video
          source={{ uri: `${storedFile}` }}
          shouldPlay={false}
          resizeMode="cover"
          style={{ width: 1, height: 1 }}
          muted={muteFile}
          paused={pauseFile} />

        <Video
          source={{ uri: `${storedAutoFile}` }}
          shouldPlay={true}
          resizeMode="cover"
          style={{ width: 1, height: 1 }}
          muted={muteAutoFile}
          paused={pauseAutoFile} />

      </ScrollView>
    </View>
  </ImageBackground>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectContainer: {
    margin: 10
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
    fontWeight: 'bold',
  },
  button: {
    margin: 5,
  }
});


export default SpeechAIScreen;