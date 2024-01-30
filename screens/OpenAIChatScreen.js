import { StyleSheet, View, ImageBackground, KeyboardAvoidingView, Keyboard, PermissionsAndroid } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Text, Button, TextInput, IconButton, Avatar, Divider } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import AIChat from '../components/AIChat';
import useAsyncStorage from '../storage/useAsyncStorage';
import * as constants from '../constants/constants';
import AISelectList from '../components/AISelectList';
import {
    AudioConfig, AudioInputStream, ResultReason, SpeechConfig, SpeechTranslationConfig,
    TranslationRecognizer, SpeechSynthesizer, AudioOutputStream, CancellationDetails, AutoDetectSourceLanguageConfig, LanguageIdMode, SpeechRecognizer, AvatarConfig, AvatarSynthesizer, AvatarVideoFormat, Coordinate
} from 'microsoft-cognitiveservices-speech-sdk';
import AudioRecord from 'react-native-live-audio-stream';
import Video, { VideoRef } from 'react-native-video';
import { useIsFocused } from "@react-navigation/native";
import TextTranslationApi from '../api/TextTranslationApi';
import WebRTCPeerConnection from './WebRTCPeerConnection';
import { RTCSessionDescription, RTCView, mediaDevices } from 'react-native-webrtc';

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
    const [lastAIText, setLastAIText] = useState("");

    const myAvatarVideoEleRef = useRef(null);

    const speechKey = speechResource?.key;
    const speechRegion = speechResource?.region;

    const channels = 1;
    const bitsPerChannel = 16;
    const sampleRate = 16000;

    let initializedCorrectly = false;
    let recognizer;


    const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
    const client = new OpenAIClient(openAIendpoint, new AzureKeyCredential(openAIkey));

    const [avatarSynthesizer, setAvatarSynthesizer] = useState(null);

    const [peerConnection, setPeerConnection] = useState(null);
    const [desc, setDesc] = useState(null);

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const configuration = {
        iceServers: [
            {
                urls: [
                    'stun:relay.communication.microsoft.com:3478',
                    'turn:relay.communication.microsoft.com:3478'
                ],
                username: 'BQAASFvei4AB2lUQMklNpQvMTGgCelW9yurLpdlT93QAAAAMARCUzqi03fRJI7bu+4soZwU4AhAAAAAd+mHjlS/4lToNAE/P5vxzfBrxyPAhd/kqTl7U/ewRi3Y=',
                credential: 'rf6iuNvgPHd3jdVYMu6PlSWVhnw=',
                routeType: 'any'
            },
            {
                urls: [
                    'stun:20.202.255.225:3478',
                    'turn:20.202.255.225:3478'
                ],
                username: 'BQAASFvei4AB2lUQMklNpQvMTGgCelW9yurLpdlT93QAAAAMARCUzqi03fRJI7bu+4soZwU4AhAAAAAd+mHjlS/4lToNAE/P5vxzfBrxyPAhd/kqTl7U/ewRi3Y=',
                credential: 'rf6iuNvgPHd3jdVYMu6PlSWVhnw=',
                routeType: 'nearest'
            }
        ]
    };

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

        const startLocalStream = async () => {
            const stream = await mediaDevices.getUserMedia({ audio: true, video: true });
            setLocalStream(stream);
        };

        startLocalStream();

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
            setLastAIText(text);

            if (selectedSource) {
                const sourceLanguageObj = allLanguageData?.find(element => element.key === selectedSource);
                targetVoice = sourceLanguageObj.Voice;

                console.log(targetVoice);
                await synthesiseAudio(fileName, text, targetVoice);
            }
            else {
                console.log(targetVoice);
                await synthesiseAudio(fileName, text, targetVoice);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const textTranslation = async (text, from, to, targetVoice, fileName) => {

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


    const createAvatarSynthesizer = () => {

        const speechConfig = SpeechConfig.fromSubscription(speechKey, speechRegion);
        speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

        const talkingAvatarCharacter = "lisa"
        const talkingAvatarStyle = "casual-sitting"

        const avatarConfig = new AvatarConfig(talkingAvatarCharacter, talkingAvatarStyle);

        let avatarSynthesizer = new AvatarSynthesizer(speechConfig, avatarConfig);

        avatarSynthesizer.avatarEventReceived = function (s, e) {
            var offsetMessage = ", offset from session start: " + e.offset / 10000 + "ms."
            if (e.offset === 0) {
                offsetMessage = ""
            }
            console.log("[" + (new Date()).toISOString() + "] Event received: " + e.description + offsetMessage)
        }
        return avatarSynthesizer;
    };

    const handleOnTrack = (event) => {

        console.log("handleOnTrack");
        console.log("[" + (new Date()).toISOString() + "] Handle Track data.")

        console.log(event);

        if (event.track.kind === "audio") {
            console.log("audio track");
            console.log(event.track);
        }
        else if (event.track.kind === "video") {
            console.log("video track");
            console.log(event.track);
            console.log("Video Streams");
            console.log(event.streams[0]._tracks);

            /*
            const mediaPlayer = myAvatarVideoEleRef.current;
            mediaPlayer.id = event.track.kind;
            mediaPlayer.srcObject = event.streams[0];
            mediaPlayer.autoplay = true;
            mediaPlayer.playsInline = true;
            mediaPlayer.addEventListener('play', () => {
                console.log("[" + (new Date()).toISOString() + "] Video play event received.")
                window.requestAnimationFrame(() => { });
            });
            */
        }
    };


    const stopSpeaking = () => {
        console.log("stopsSpeaking");
        avatarSynthesizer.stopSpeakingAsync().then(() => {
            console.log("[" + (new Date()).toISOString() + "] Stop speaking request sent.")

        }).catch();
    };

    const stopSession = () => {
        try {
            //Stop speaking
            console.log("stopSession");
            avatarSynthesizer.stopSpeakingAsync().then(() => {
                console.log("[" + (new Date()).toISOString() + "] Stop speaking session request sent.")
                // Close the synthesizer
                avatarSynthesizer.close();
            }).catch();
        } catch (e) {
        }
    };

    const startAvatar = async () => {

        // Set remote description and create answer
        const localPC = peerConnection;


    };

    const speakSelectedText = async () => {

        console.log("speakSelectedText: ", lastAIText);

        try {

            avatarSynthesizer.speakTextAsync(lastAIText).then(
                (result) => {
                    console.log("[" + (new Date()).toISOString() + "] Speak request sent.");
                    console.log(result);
                    if (result.reason === ResultReason.SynthesizingAudioCompleted) {
                        console.log("Speech and avatar synthesized to video stream.")
                    } else {
                        console.log("Unable to speak. Result ID: " + result.resultId)
                        if (result.reason === ResultReason.Canceled) {
                            let cancellationDetails = CancellationDetails.fromResult(result)
                            console.log(cancellationDetails.reason)

                        }
                    }
                }).catch((error) => {
                    console.log(error)
                    avatarSynthesizer.close()
                });
        } catch (error) {
            console.log("speakSelectedText error");
            console.log(error);
        }
    };


    const startSession = async () => {
        
        var pc = new WebRTCPeerConnection(configuration);
        var pc2 = new WebRTCPeerConnection(configuration);

        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
                    videoSourceId = sourceInfo.deviceId;
                }
            }
            mediaDevices.getUserMedia({
                audio: true,
                video: {
                    mandatory: {
                        minWidth: 500, // Provide your own width, height and frame rate here
                        minHeight: 300,
                        minFrameRate: 30
                    },
                    facingMode: (isFront ? "user" : "environment"),
                    optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
                }
            })
                .then(stream => {
                    console.log("ADDING STREAMS!");
                    
                    const audioTracks = stream.getAudioTracks();
                    
                    pc.addTrack(audioTracks[0], stream);
                    pc2.addTrack(audioTracks[0], stream);

                    pc.createOffer().then(desc => {
                        pc.setLocalDescription(desc).then(() => {
                            console.log("DESC1 --> " + JSON.stringify(desc))
                            pc2.setRemoteDescription(desc);
                            pc2.createAnswer().then(desc2 => {
                                pc2.setLocalDescription(desc2).then(() => {
                                    console.log(" DESC2 --> " + JSON.stringify(desc2))
                                    pc.setRemoteDescription(desc2);
                                });
                            });
                        });
                    });
                })
                .catch(error => {
                    // Log error
                    console.log("Create Offer error : ", error);
                });
        });
        
        pc.addEventListener('track', handleOnTrack);
        pc.addTransceiver("video", { direction: "sendrecv" });
        pc.addTransceiver("audio", { direction: "sendrecv" });

        pc.oniceconnectionstatechange = e => {
            console.log("WebRTC status: " + pc.iceConnectionState)

            if (pc.iceConnectionState === 'connected') {
                console.log("Connected to Azure Avatar service");
            }

            if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
                console.log("Azure Avatar service Disconnected");
            }
        };

        pc.addEventListener("icecandidate", (e) => {
            if (!e.candidate) {
                console.log("Got final candidate!");
                return;
            }
        });



        console.log("Create Avatar Synthesizer");
        let avatarSynthesizer = createAvatarSynthesizer();
        setAvatarSynthesizer(avatarSynthesizer);

        avatarSynthesizer.startAvatarAsync(pc).then((r) => {

            console.log("[" + (new Date()).toISOString() + "] Start avatar request sent.")
            console.log(r);
            console.log("Avatar started");

        }).catch((error) => {
            console.log("startAvatar error");
            console.log(error)
            avatarSynthesizer.close()
        });

        console.log("peerConnection");
        console.log(pc);
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
                <View style={styles.chatcontainer}>
                    <IconButton icon="connection" mode="contained" onPress={() => { startSession() }}></IconButton>
                    <IconButton icon="lan-disconnect" mode="contained" onPress={() => { stopSession() }}></IconButton>
                    <IconButton icon="play" mode="contained" onPress={() => { startAvatar() }}></IconButton>
                    <IconButton icon="microphone" mode="contained" onPress={() => { speakSelectedText() }}></IconButton>
                    <IconButton icon="microphone-off" mode="contained" onPress={() => { stopSpeaking() }}></IconButton>

                </View>
                <View style={styles.container}>
                    {localStream && <RTCView streamURL={localStream.toURL()} />}
                    {remoteStream && <RTCView streamURL={remoteStream.toURL()} />}
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