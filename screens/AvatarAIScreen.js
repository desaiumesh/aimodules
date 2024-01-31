import { View, StyleSheet, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { appStyles } from '../styles/appStyle';
import * as constants from '../constants/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ImageBackground, ScrollView } from 'react-native';
import Loading from '../components/Loading';
import { Text, TextInput, Button, Divider, IconButton, useTheme } from 'react-native-paper';
import useAsyncStorage from '../storage/useAsyncStorage';

import WebRTCPeerConnection from './WebRTCPeerConnection';
import { RTCSessionDescription, RTCView, mediaDevices } from 'react-native-webrtc';
import ReactAvatarSynthesizer from './ReactAvatarSynthesizer';
import { AvatarConfig, CancellationDetails, ResultReason, SpeechConfig } from 'microsoft-cognitiveservices-speech-sdk';
import AISelectList from '../components/AISelectList';

const AvatarAIScreen = () => {

    const [allLanguageData] = useAsyncStorage('speakingLanguages', constants.languages);

    const [speechResource] = useAsyncStorage("speechResource", null);
    const speechKey = speechResource?.key;
    const speechRegion = speechResource?.region;

    const [avatarResource] = useAsyncStorage("avatarAIResource", null);
    const avatarStunUrl = avatarResource?.stunUrl;
    const avatarUsername = avatarResource?.username;
    const avatarCredential = avatarResource?.credential;

    const [text, setText] = useState("");
    const [remoteStream, setRemoteStream] = useState(null);

    const [avatarSynthesizer, setAvatarSynthesizer] = useState(null);

    const [sourceLanguages, setSourceLanguages] = useState([]);
    const [selectedSource, setSelectedSource] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const theme = useTheme();

    const configuration = {
        iceServers: [
            {
                urls: [
                    avatarStunUrl,
                ],
                username: avatarUsername,
                credential: avatarCredential,
                routeType: 'any'
            }
        ]
    };

    useEffect(() => {
        allLanguageData?.forEach(element => {

            const found = sourceLanguages.some(el => el.value === element.LanguageGenderName)

            if (!found) {
                sourceLanguages.push({
                    key: element.key,
                    value: element.LanguageGenderName,
                });
            }
        });
    }, [allLanguageData]);

    const createAvatarSynthesizer = () => {

        let sourceVoice = "en-US-JennyNeural";

        if (selectedSource) {
            const sourceLanguageObj = allLanguageData.find(element => element.key === selectedSource);
            sourceVoice = sourceLanguageObj.Voice;
        }

        console.log("Source Voice: ", sourceVoice);
        const speechConfig = SpeechConfig.fromSubscription(speechKey, speechRegion);
        speechConfig.speechSynthesisVoiceName = sourceVoice;

        const talkingAvatarCharacter = "lisa"
        const talkingAvatarStyle = "casual-sitting"

        const avatarConfig = new AvatarConfig(talkingAvatarCharacter, talkingAvatarStyle);
        //avatarConfig.backgroundColor = "#00FF00FF";

        let avatarSynthesizer = new ReactAvatarSynthesizer(speechConfig, avatarConfig);

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
            setRemoteStream(event.streams[0]);
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
                setIsConnected(false);
            }).catch();
        } catch (e) {
        }
    };

    const speakSelectedText = async () => {

        console.log("speakSelectedText: ", text);
        try {

            avatarSynthesizer.speakTextAsync(text).then(
                (result) => {
                    console.log("[" + (new Date()).toISOString() + "] Speak request sent.");
                    console.log(result);
                    if (result.reason === ResultReason.SynthesizingAudioCompleted) {
                        console.log("Speech and avatar synthesized to video stream.")
                    } else {
                        console.log("Unable to speak. Result ID: " + result.resultId)
                        if (result.reason === ResultReason.Canceled) {
                            let cancellationDetails = CancellationDetails.fromResult(result)
                            console.log(cancellationDetails.reason);
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

        var peerConnection = new WebRTCPeerConnection(configuration);

        peerConnection.addEventListener('track', handleOnTrack);
        peerConnection.addTransceiver('video', { direction: 'sendrecv' })
        peerConnection.addTransceiver('audio', { direction: 'sendrecv' })

        console.log("Create Avatar Synthesizer");
        let avatarSynthesizer = createAvatarSynthesizer();
        setAvatarSynthesizer(avatarSynthesizer);

        peerConnection.oniceconnectionstatechange = e => {
            console.log("WebRTC status: " + peerConnection.iceConnectionState)

            if (peerConnection.iceConnectionState === 'connected') {
                console.log("Connected to Azure Avatar service");
            }

            if (peerConnection.iceConnectionState === 'disconnected' || peerConnection.iceConnectionState === 'failed') {
                console.log("Azure Avatar service Disconnected");
            }
        }

        avatarSynthesizer.startAvatarAsync(peerConnection).then((r) => {
            console.log("[" + (new Date()).toISOString() + "] Avatar started.");
            setIsConnected(true);

        }).catch((error) => {
            console.log("startAvatar error");
            console.log(error)
            avatarSynthesizer.close()
        });

        console.log("peerConnection");
        console.log(peerConnection);
    };

    return (
        <ImageBackground source={require('../assets/background.jpg')}
            style={constants.aiStyles.imageBackgroundImage}
            imageStyle={constants.aiStyles.imageBackgroundImageStyle}
            blurRadius={1}
            resizeMode="cover">
            <View style={styles.container}>
                <AISelectList data={sourceLanguages} setSelected={setSelectedSource}
                    placeholderText='Select Language' searchPlaceholderText='Search Language' />
                <View style={styles.avatarcontainer}>
                    {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={{ flex: 1 }} objectFit={'cover'} />}
                </View>
                <Divider style={styles.divider} />
                <View style={styles.textcontainer}>
                    <TextInput placeholder="Write a text here" height={100}
                        value={text}
                        onChangeText={(text) => setText(text)}
                        style={styles.textInput} multiline={true} numberOfLines={3} ></TextInput>
                    <View style={styles.innerContainer}>
                        <IconButton icon="connection" mode="contained" iconColor={(isConnected) ? 'yellow' : theme.colors.primary} onPress={() => { startSession() }}></IconButton>
                        <IconButton icon="lan-disconnect" mode="contained" onPress={() => { stopSession() }}></IconButton>
                        <IconButton icon="play" mode="contained" onPress={() => { speakSelectedText() }}></IconButton>
                        <IconButton icon="stop" mode="contained" onPress={() => { stopSpeaking() }}></IconButton>
                    </View>
                </View>
            </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        padding: 10,
        flex: 1,
    },
    avatarcontainer: {
        alignContent: 'center',
        padding: 2,
        flex: 1
    },
    textcontainer: {
        alignContent: 'center',
        padding: 2,
        height: 150
    },
    image: {
        flex: 1,
        justifyContent: 'center'
    },
    imageStyle: {
        opacity: 0.4
    },
    languageText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    divider: {
        borderWidth: 1,
        marginBottom: 5,
        marginTop: 5
    },
    innerContainer: {
        padding: 2,
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
        borderWidth: 2,
        fontSize: 16,
        padding: 2,
        borderRadius: 10
    },
    outputContainer: {
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 2,
        marginBottom: 3
    }
})

export default AvatarAIScreen;