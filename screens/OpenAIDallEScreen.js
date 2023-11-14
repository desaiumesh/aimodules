import { View, StyleSheet, ImageBackground, Alert, Keyboard, Image, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Text, TextInput, IconButton, useTheme } from 'react-native-paper';
import useAsyncStorage from '../storage/useAsyncStorage';
import * as constants from '../constants/constants';

const OpenAIDallEScreen = () => {

    const [openAIResource] = useAsyncStorage("openAIResource", null);
    const theme = useTheme();

    var endpoint = "endpoint";
    var key = "key";

    if (openAIResource?.key) {
        key = openAIResource?.key;
    }

    if (openAIResource?.endpoint) {
        endpoint = openAIResource?.endpoint;
    }

    const [isLoading, setIsLoading] = useState(false);
    const [systemText, SetSystemText] = useState("");
    const [imageURL, SetImageURL] = useState("https://dalleproduse.blob.core.windows.net/private/images/66968d53-71d7-42cf-9e62-0219a282c5d0/generated_00.png?se=2023-11-07T06%3A09%3A01Z&sig=vsFV7Y8aabb%2BLediC%2BLEZhy1uIs5kUFnl0jzCEtu4mU%3D&ske=2023-11-08T14%3A45%3A50Z&skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&sks=b&skt=2023-11-01T14%3A45%3A50Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02");
    const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(key));

    const createImage = async () => {

        if (systemText === "") {
            Alert.alert("Please enter a description of the image you want to create.");
            return;
        }

        try {
            Keyboard.dismiss();
            setIsLoading(true);
            const response = await client.getImages(systemText);
            SetImageURL(response?.data[0].url);
        }
        catch (error) {
            console.log(error);
            Alert.alert("Error", "An error occurred while creating the image.");
        }
        finally {
            setIsLoading(false);
        }

    };

    return (
        <ImageBackground source={require('../assets/background.jpg')}
            style={constants.aiStyles.imageBackgroundImage}
            imageStyle={constants.aiStyles.imageBackgroundImageStyle}
            blurRadius={1}
            resizeMode="cover">
            <View style={styles.container}>
                <TextInput placeholder='Describe the image you want to create. For example, "watercolor painting of the Seattle skyline"'
                    multiline={true} onChangeText={(systemText) => SetSystemText(systemText)}></TextInput>
                <View style={styles.ImageContainer}>
                    <Image source={{ uri: imageURL }} style={styles.cameraImage} />
                    {isLoading && <ActivityIndicator size={50} color={theme.colors.onPrimary} />}
                </View>
                <View style={styles.innerContainer}>
                    <IconButton icon="robot" size={30} mode="contained" onPress={() => { createImage() }}></IconButton>
                </View>
                <ScrollView>
                    <Text style={styles.text} selectable={true}>Image URL: {imageURL}</Text>
                </ScrollView>
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
    cameraImage: {
        width: 320,
        height: 350,
    },
    ImageContainer: {
        marginRight: 20,
        marginLeft: 20,
        marginTop: 20,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default OpenAIDallEScreen;