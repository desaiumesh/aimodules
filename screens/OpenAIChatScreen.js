import { StyleSheet, View, ImageBackground } from 'react-native'
import React from 'react'
import { Text, Button } from 'react-native-paper';

const OpenAIChatScreen = () => {

    const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");


    const analyseText = async () => {

        try {
            console.log("1");

            const client = new OpenAIClient(
                "https://openaimodules102.openai.azure.com/",
                new AzureKeyCredential("064e47e4ffce44678ac1fda5522f8f81"));

            console.log("2");

            const messages = [
                { role: "system", content: "You are an AI assistant that helps people find information." },
                { role: "user", content: "How are you?" },
                { role: "assistant", content: "As an AI, I don't have feelings in the same way that humans do, but I'm functioning properly and ready to assist you with any questions or information you need. How can I help you today?" },
                { role: "user", content: "What is AI?" },
                { role: "assistant", content: "AI stands for artificial intelligence. It refers to the ability of machines or computer programs to perform tasks that would normally require human intelligence. AI encompasses a wide range of technologies, including machine learning, natural language processing, expert systems, and robotics. These technologies allow machines to learn from experience, adapt to new inputs, and perform tasks that would normally require human intervention. AI is becoming increasingly important in a variety of industries, including healthcare, manufacturing, and finance, among others." },
                { role: "user", content: "can you please elaborate?" },
              ];
            
              const events = await client.getChatCompletions("TestChat", messages, { maxTokens: 128 });

              console.log(events.choices);

            console.log("3");
            


        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ImageBackground source={require('../assets/AI2.jpg')}
            style={styles.image}
            imageStyle={styles.imageStyle}
            resizeMode="cover">
            <View style={styles.container}>
                <Text>OpenAIChatScreen</Text>
                <Button icon="chat" mode="contained" onPress={() => { analyseText() }}>ANALYSE</Button>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        padding: 10,
        flex: 1,
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
        height: 250,
        borderWidth: 2,
        marginBottom: 20,
        fontSize: 16,
        padding: 10,
        borderRadius: 10
    },
    outputContainer: {
        flexDirection: 'row',
        marginTop: 10
    }
})

export default OpenAIChatScreen;