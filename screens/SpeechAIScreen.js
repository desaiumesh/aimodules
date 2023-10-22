import { View, Text, Button } from 'react-native'
import React from 'react'
import LiveAudioStream from 'react-native-live-audio-stream';
import {PermissionsAndroid, Platform} from 'react-native';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']); 
LogBox.ignoreAllLogs();

const options = {
  sampleRate: 32000,  // default is 44100 but 32000 is adequate for accurate voice recognition
  channels: 1,        // 1 or 2, default 1
  bitsPerSample: 16,  // 8 or 16, default 16
  audioSource: 6,     // android only (see below)
  bufferSize: 4096    // default is 2048
};

const SpeechAIScreen = () => {

  const requestMicrophone = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for record audio',
            message: 'Give permission to your device to record audio',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('permission granted');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  }


  const start = () => {

    console.log('start');
    LiveAudioStream.init(options);
    console.log('start1');
    LiveAudioStream.on('data', data => {
      // base64-encoded audio data chunks
    });

    LiveAudioStream.start();

  }

  const stop = () => {

    console.log('stop');
    LiveAudioStream.stop();
  }


  return (
    <View>
      <Text>Speech AI Screen</Text>
      <Button title='Permission' onPress={requestMicrophone}></Button>
      <Button title='Start' onPress={start}></Button>
      <Button title='stop' onPress={stop}></Button>
    </View>
  )
}

export default SpeechAIScreen;