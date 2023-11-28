import { StyleSheet, View, ImageBackground, KeyboardAvoidingView, Keyboard, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, Button, TextInput, IconButton, Avatar, Divider } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import AIChat from '../components/AIChat';
import useAsyncStorage from '../storage/useAsyncStorage';
import * as constants from '../constants/constants';
import AISelectList from '../components/AISelectList';
import {
    AudioConfig, AudioInputStream, ResultReason, SpeechConfig, SpeechTranslationConfig,
    TranslationRecognizer, SpeechSynthesizer, AudioOutputStream, CancellationDetails, AutoDetectSourceLanguageConfig, LanguageIdMode, SpeechRecognizer
} from 'microsoft-cognitiveservices-speech-sdk';
import AudioRecord from 'react-native-live-audio-stream';
import Video from 'react-native-video';
import { useIsFocused } from "@react-navigation/native";
import TextTranslationApi from '../api/TextTranslationApi';

const OpenAIChatScreen = () => {

    const isFocused = useIsFocused();

    const [speechResource] = useAsyncStorage("speechResource", null);
    const [allLanguageData] = useAsyncStorage('speakingLanguages', constants.languages);
    const [openAIResource] = useAsyncStorage("openAIResource", null);


    var openAIendpoint = "endpoint";
    var openAIkey = "key";
    var openAIDeploymentName = "Test";

    if (openAIResource?.key) {
        openAIkey = openAIResource?.key;
    }

    if (openAIResource?.endpoint) {
        openAIendpoint = openAIResource?.endpoint;
    }

    if (openAIResource?.deploymentName) {
        openAIDeploymentName = openAIResource?.deploymentName;
    }

    const [systemText, SetSystemText] = useState("You are an AI assistant that helps people find information.");
    const [senderText, SetSenderText] = useState("");
    const [messages, setMessages] = useState([]);

    const [sourceLanguages, setSourceLanguages] = useState([]);
    const [selectedSource, setSourceSelected] = useState("");

    let aiAudioFileName = 'openAiAudio.mp3';

    const [storedFile, setStoredFile] = useState(undefined);
    const [pauseFile, setPauseFile] = useState(true);
    const [muteFile, setMuteFile] = useState(true);

    const [isMicOn, setIsMicOn] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);

    const [translatedText, setTranslatedText] = useState("");

    const speechKey = speechResource?.key;
    const speechRegion = speechResource?.region;

    const channels = 1;
    const bitsPerChannel = 16;
    const sampleRate = 16000;

    let initializedCorrectly = false;
    let recognizer;


    const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
    const client = new OpenAIClient(openAIendpoint, new AzureKeyCredential(openAIkey));

    useEffect(() => {

        if (isFocused) {
            setMuteFile(true);
            setPauseFile(false);
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

        var RNFS = require('react-native-fs');
        var aiAudioFilepath = RNFS.DocumentDirectoryPath + '/' + aiAudioFileName;
        checkAudioFile(aiAudioFilepath, '');

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


    const createTranslationRecognizer = async () => {

        let defaultLanguageLocale47 = "en-US";
        let defaultLanguageode = "en";
        let sourcelanguageCode = "en";

        if (selectedSource) {
            const sourceLanguageObj = allLanguageData.find(element => element.key === selectedSource);
            defaultLanguageLocale47 = sourceLanguageObj.LocaleBCP47;
            sourcelanguageCode = sourceLanguageObj.LanguageCode;
        }

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

        const speechConfig = SpeechConfig.fromSubscription(speechKey, speechRegion);
        speechConfig.speechRecognitionLanguage = defaultLanguageLocale47;

        const audioConfig = AudioConfig.fromStreamInput(pushStream);
        recognizer = new SpeechRecognizer(speechConfig, audioConfig);

    };

    const startAudio = async () => {

        if (isMicOn) {
            await stopAudio();
            return;
        }

        setPauseFile(true);

        await checkPermissions();

        if (!initializedCorrectly) {

            createTranslationRecognizer();
            setIsMicOn(true);

            SetSenderText("");

            let sourceLText = "";
            let targetLText = "";

            let sourceLanguageLocale47 = "en-US";

            if (selectedSource) {
                const sourceLanguageObj = allLanguageData.find(element => element.key === selectedSource);
                sourceLanguageLocale47 = sourceLanguageObj.LocaleBCP47;
            }

            recognizer.recognized = (s, e) => {

                let reason = e.result.reason;

                if (reason === ResultReason.RecognizedSpeech) {

                    console.log(`RECOGNIZED: ${JSON.stringify(e.result.text)}`);
                    sourceLText = sourceLText + `${e?.result?.text}`;
                    SetSenderText(sourceLText);
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

    const stopAudio = async () => {

        AudioRecord.stop();
        setIsMicOn(false);

        if (!!recognizer) {
            recognizer.stopContinuousRecognitionAsync();
            initializedCorrectly = false;
        }

    };

    const volumeToggle = () => {

        setIsSpeakerOn(!isSpeakerOn);

        if (isSpeakerOn && messages?.length > 0) {
            setMuteFile(true);
            setPauseFile(false);
        } else {
            setMuteFile(false);
            setPauseFile(false);
        }

    };

    const clearChat = () => {

        if (isMicOn) {
            stopAudio();
        }
        setMessages([]);
    };

    const sendMessage = async () => {

        try {

            if (isMicOn) {
                stopAudio();
            }

            Keyboard.dismiss();

            const index = messages?.findIndex(v => v.role === "system")

            if (index > -1) {
                messages[index].content = systemText
            } else {
                messages.push({ role: "system", content: systemText })
            }

            messages.push({ role: "user", content: senderText });

            const events = await client.getChatCompletions(openAIDeploymentName, messages);

            console.log(JSON.stringify(events));
            messages.push({ role: "assistant", content: events?.choices[0].message?.content });

            setMessages([...messages]);
            SetSenderText("");

            //read out the message
            setTranslatedText("");
            let text = events?.choices[0].message?.content;
            let fileName = `/${aiAudioFileName}`;

            let targetVoice = "en-US-JennyNeural";

            if (selectedSource) {
                const sourceLanguageObj = allLanguageData?.find(element => element.key === selectedSource);
                targetVoice = sourceLanguageObj.Voice;

                console.log(targetVoice);
                await synthesiseAudio(fileName, text, targetVoice);
            }
            else
            {
                console.log(targetVoice);
                await synthesiseAudio(fileName, text, targetVoice);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const textTranslation = async (text, from, to, targetVoice,fileName ) => {

        const RESOURCE_KEY = "key";
        const RESOURCE_REGION = "Region";

        const [TranslationApi] = await TextTranslationApi({ RESOURCE_KEY, RESOURCE_REGION });

        try {
            
            const resp = await TranslationApi({ text, from, to })
            if (resp.status == 200) {
                let text = resp?.data[0]?.translations[0]?.text;
                console.log(text);
                setTranslatedText(text);
                await synthesiseAudio(fileName, text, targetVoice);
            }
            else {
                setLanguage("Error");
            }

        } catch (error) {
            console.log(error);
        }


    };

    const synthesiseAudio = async (fileName, text, targetVoice) => {

        console.log("Sysnthesise Audio")
        console.log(targetVoice);
        console.log(text);
        console.log(fileName);

        const speechConfig = SpeechConfig.fromSubscription(speechKey, speechRegion);
        speechConfig.speechSynthesisVoiceName = targetVoice;

        var stream = AudioOutputStream.createPullStream();
        let streamConfig = AudioConfig.fromStreamOutput(stream);

        let speechSynthesizer = new SpeechSynthesizer(speechConfig, streamConfig);

        // The event synthesis completed signals that the synthesis is completed.
        speechSynthesizer.synthesisCompleted = async function (s, e) {

            console.log("(synthesis completed)");

            var arrayBufferData = new ArrayBuffer(3200000);
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


            if (!isSpeakerOn) {
                setMuteFile(true);
                setPauseFile(false);
                setStoredFile(undefined);
            }
            else {
                setMuteFile(false);
                setPauseFile(false);
                setStoredFile(path);
            }
        }

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

    return (
        <ImageBackground source={require('../assets/background.jpg')}
            style={constants.aiStyles.imageBackgroundImage}
            imageStyle={constants.aiStyles.imageBackgroundImageStyle}
            blurRadius={1}
            resizeMode="cover">
            <View style={styles.container}>
                <TextInput placeholder='You are an AI assistant that helps people find information.' style={styles.textInput}
                    multiline={true} onChangeText={(systemText) => SetSystemText(systemText)}></TextInput>

                <View style={styles.chatcontainer}>
                    <IconButton icon="close" mode="contained" onPress={() => { clearChat() }}>Publish</IconButton>
                    <View width={240}>
                        <AISelectList data={sourceLanguages} setSelected={setSourceSelected}
                            placeholderText='Select Language' searchPlaceholderText='Search Language' />
                    </View>
                    <IconButton icon={isSpeakerOn ? "volume-high" : "volume-off"} mode="contained" onPress={() => { volumeToggle() }}>Publish</IconButton>
                </View>
                <Divider />
                <AIChat messages={messages} senderText={senderText} SetSenderText={SetSenderText} onPress={() => { sendMessage() }}
                    onMicPress={() => startAudio()} isMicOn={isMicOn} />
                <Video
                    source={{ uri: `${storedFile}` }}
                    shouldPlay={false}
                    resizeMode="cover"
                    style={{ width: 1, height: 1 }}
                    muted={muteFile}
                    paused={pauseFile} />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        padding: 10,
        flex: 1
    },
    receiver: {
        alignSelf: 'flex-start',
        borderRadius: 20,
        marginLeft: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative',
    },
    sender: {
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative',
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    chatcontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    image: {
        flex: 1,
        justifyContent: 'center'
    },
    imageStyle: {
        opacity: 0.2
    },
    languageText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    innerContainer: {
        padding: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 10
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        padding: 10,
    },
    textInput: {
    },
    bottomtextInput: {
        bottom: 0,
        flex: 1
    },
    outputContainer: {
        flexDirection: 'row',
        marginTop: 10
    }
})

export default OpenAIChatScreen;