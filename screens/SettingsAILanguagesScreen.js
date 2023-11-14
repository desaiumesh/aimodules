import { StyleSheet, View, ImageBackground, ScrollView, FlatList, SwipeView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react';
import useAsyncStorage from '../storage/useAsyncStorage';
import { Text, TextInput, IconButton, Divider, Switch } from 'react-native-paper';
import * as constants from '../constants/constants';


const SettingsAILanguagesScreen = ({ navigation }) => {

    const [speakingLanguages, setSpeakingLanguages] = useAsyncStorage('speakingLanguages', constants?.languages);

    const [languageName, setLanguageName] = useState("");
    const [voiceName, setVoiceName] = useState("");
    const [languageCode, setLanguageCode] = useState("");
    const [localeBCP47, setLocaleBCP47] = useState("");
    const [voice, setVoice] = useState("");

    const goBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        console.log("in useEffect1");
        console.log("speakingLanguages", speakingLanguages);

    }, [speakingLanguages]);

    const saveColours = () => {
        var speakingLanguageData = constants.languages;
        speakingLanguageData = speakingLanguages;

        if (languageName === "") {
            alert("Please enter language name"); return;
        }

        const namefound = speakingLanguageData?.some((item) => item.LanguageName.toLowerCase() === languageName.toLowerCase());
        if (namefound) {
            alert("Language name already exists");
            return;
        }

        if (voiceName === "") {
            alert("Please enter voice name"); return;
        }

        const voiceNamefound = speakingLanguageData?.some((item) => item.LanguageGenderName.toLowerCase() === voiceName.toLowerCase());
        if (voiceNamefound) {
            alert("Voice name already exists");
            return;
        }

        if (languageCode === "") {
            alert("Please enter language code"); return;
        }

        const languageCodefound = speakingLanguageData?.some((item) => item.LanguageCode.toLowerCase() === languageCode.toLowerCase());
        if (languageCodefound) {
            alert("Language code already exists");
            return;
        }

        if (localeBCP47 === "") {
            alert("Please enter locale BCP-47"); return;
        }

        const localeBCP47found = speakingLanguageData?.some((item) => item.LocaleBCP47.toLowerCase() === localeBCP47.toLowerCase());
        if (localeBCP47found) {
            alert("Locale BCP-47 already exists");
            return;
        }


        if (voice === "") {
            alert("Please enter voice name"); return;
        }

        const voicefound = speakingLanguageData?.some((item) => item.Voice.toLowerCase() === voice.toLowerCase());
        if (voicefound) {
            alert("Voice already exists");
            return;
        }

        try {

            var keyvalue = 1;

            speakingLanguageData.forEach(element => {
                keyvalue = Math.max(keyvalue, Number(element.key))
            });

            let key = keyvalue + 1;
            console.log("key3", key);
            var newValue = {
                key: key, value: '',
                LanguageName: languageName, LanguageGenderName: voiceName,
                LanguageCode: languageCode, LocaleBCP47: localeBCP47, Voice: voice
            };

            const data = JSON.stringify(speakingLanguages);
            const result = JSON.parse(data);
            result.push(newValue);

            setSpeakingLanguages(result);

        } catch (error) {
            console.log("error", error);
        }

    };

    const deleteItemById = (key, name) => {

        Alert.alert(
            '',
            `Are you sure you want to delete ${name} language?`,
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'OK', onPress: () => setSpeakingLanguages(speakingLanguages?.filter(item => item.key !== key)) },
            ],
            { cancelable: false }
        )
    };

    return (
        <ImageBackground source={require('../assets/background.jpg')}
            style={constants.aiStyles.imageBackgroundImage}
            imageStyle={constants.aiStyles.imageBackgroundImageStyle}
            blurRadius={1}
            resizeMode="cover">
            <View style={styles.container}>
                <View style={styles.headerInnerContainer}>
                    <IconButton icon="arrow-left-bold" mode="contained" onPress={() => { goBack() }}></IconButton>
                    <Text style={styles.biometricsText}>Back</Text>
                    <IconButton icon="content-save" mode="contained" onPress={() => { saveColours() }}></IconButton>
                </View>
                <Divider style={styles.divider} />
                <ScrollView>
                    <View style={styles.LanguageContainer}>
                        <TextInput placeholder="Language name (example: English)"
                            value={languageName}
                            onChangeText={(text) => setLanguageName(text)}
                            style={styles.textInput} ></TextInput>
                        <TextInput placeholder="Voice name (example: English (United States) Female)"
                            value={voiceName}
                            onChangeText={(text) => setVoiceName(text)}
                            style={styles.textInput} ></TextInput>
                        <TextInput placeholder="Language Code (example: en)"
                            value={languageCode}
                            onChangeText={(text) => setLanguageCode(text)}
                            style={styles.textInput} ></TextInput>
                        <TextInput placeholder="Locale BCP-47 (example: en-US)"
                            value={localeBCP47}
                            onChangeText={(text) => setLocaleBCP47(text)}
                            style={styles.textInput} ></TextInput>
                        <TextInput placeholder="Voice (example: en-US-JennyNeural)"
                            value={voice}
                            onChangeText={(text) => setVoice(text)}
                            style={styles.textInput} ></TextInput>
                    </View>
                    <Divider style={styles.divider} />
                </ScrollView>
                <Text style={styles.text}>Languages</Text>
                <Divider style={styles.divider} />
                <FlatList height={200}
                    data={speakingLanguages}
                    renderItem={({ item }) => (
                        <View>
                            <View style={styles.flatlistContainer}>
                                <Text style={styles.biometricsText}> {item.LanguageGenderName}</Text>
                                <IconButton icon="delete" mode="contained" onPress={() => { deleteItemById(item.key, item.LanguageGenderName) }}></IconButton>
                            </View>
                            <Divider style={styles.divider} />
                        </View>
                    )}
                />
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
    flatlistContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingRight: 10,
        paddingLeft: 10,
    },
    LanguageContainer: {
        paddingLeft: 10,
        paddingRight: 10,

    },
    headerInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 0,
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
    settingsText: {
        bottom: 0,
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
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
    },
    textInput: {
        borderWidth: 2,
        marginTop: 2,
        marginBottom: 2,
        fontSize: 12,
        borderRadius: 10
    },
});


export default SettingsAILanguagesScreen;