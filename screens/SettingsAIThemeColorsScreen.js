import { StyleSheet, View, ImageBackground, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react';
import useAsyncStorage from '../storage/useAsyncStorage';
import { Text, TextInput, IconButton, Divider, Switch } from 'react-native-paper';
import * as constants from '../constants/constants';

const SettingsAIThemeColorsScreen = ({ navigation }) => {
    const [isDefaultThemeColours, setIsDefaultThemeColours] = useAsyncStorage('isDefaultThemeColours', true);

    const [darkColours, setDarkColours] = useAsyncStorage('darkColours');
    const [lightColours, setLightColours] = useAsyncStorage('lightColours');

    const [lightColorsText, setLightColorsText] = useState();
    const [darkColorsText, setDarkColorsText] = useState();

    const goBack = () => {
        navigation.goBack();
    };

    const toggleDarkTheme = () => {
        setIsDefaultThemeColours(!isDefaultThemeColours);
    };

    useEffect(() => {

        setLightColorsText(JSON.stringify(lightColours));
        setDarkColorsText(JSON.stringify(darkColours));

    }, [isDefaultThemeColours, darkColours, lightColours,]);

    const saveColours = () => {

        if (lightColorsText == null || lightColorsText == undefined || lightColorsText == "") {
            alert("Please enter light colours");
            return;
        }

        if (darkColorsText == null || darkColorsText == undefined || darkColorsText == "") {
            alert("Please enter dark colours");
            return;
        }

        const lightColors = JSON.parse(lightColorsText);
        const darkColors = JSON.parse(darkColorsText);

        setLightColours(lightColors);
        setDarkColours(darkColors);
        console.log("done: ");
    };

    return (
        <ImageBackground source={require('../assets/AI2.jpg')}
            style={styles.image}
            imageStyle={styles.imageStyle}
            resizeMode="cover">
            <View style={styles.container}>
                <View style={styles.headerInnerContainer}>
                    <IconButton icon="arrow-left-bold" mode="contained" onPress={() => { goBack() }}></IconButton>
                    <Text style={styles.biometricsText}>Back</Text>
                    <IconButton icon="content-save" mode="contained" onPress={() => { saveColours() }}></IconButton>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.innerContainer}>
                    <Text style={styles.settingsText}>Enable default colours</Text>
                    <Switch
                        value={isDefaultThemeColours}
                        onValueChange={toggleDarkTheme} />
                </View>
                <Divider style={styles.divider} />
                <ScrollView>
                    <View style={styles.coloursContainer}>
                        <Text style={styles.settingsText}>Light Colours</Text>
                        <TextInput placeholder="Light color theme from https://callstack.github.io/react-native-paper/docs/guides/theming"
                            value={lightColorsText}
                            onChangeText={(text) => setLightColorsText(text)}
                            multiline={true}
                            style={styles.textInput} ></TextInput>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.coloursContainer}>
                        <Text style={styles.settingsText}>Dark Colours</Text>
                        <TextInput placeholder="Dark color theme from https://callstack.github.io/react-native-paper/docs/guides/theming"
                            value={darkColorsText}
                            onChangeText={(text) => setDarkColorsText(text)}
                            multiline={true}
                            style={styles.textInput} ></TextInput>
                    </View>
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
    coloursContainer: {
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
        marginBottom: 20,
        fontSize: 8,
        padding: 10,
        borderRadius: 10
    },
});


export default SettingsAIThemeColorsScreen;