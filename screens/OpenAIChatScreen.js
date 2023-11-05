import { StyleSheet, View, ImageBackground, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, Button, TextInput, IconButton, Avatar, Divider } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

const endpoint = "https://openaimodules102.openai.azure.com/";
const key = "064e47e4ffce44678ac1fda5522f8f81";

const OpenAIChatScreen = () => {
    const [systemText, SetSystemText] = useState("You are an AI assistant that helps people find information.");
    const [senderText, SetSenderText] = useState("");
    const [messages, setMessages] = useState([]);

    const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

    const client = new OpenAIClient(endpoint,  new AzureKeyCredential(key));

    const clearChat = () => {
        setMessages([]);
    };

    const sendMessage = async () => {

        try {

            Keyboard.dismiss();

            const index = messages?.findIndex(v => v.role === "system")

            if (index > -1) {
                messages[index].content = systemText
            } else {
                messages.push({ role: "system", content: systemText })
            }

            messages.push({ role: "user", content: senderText });

            const events = await client.getChatCompletions("TestChat", messages, { maxTokens: 300 });

            messages.push({ role: "assistant", content: events?.choices[0].message?.content });

            setMessages([...messages]);
            SetSenderText("");

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
                <TextInput placeholder='You are an AI assistant that helps people find information.' style={styles.textInput} multiline={true} onChangeText={(systemText) => SetSystemText(systemText)}></TextInput>

                <View style= {styles.chatcontainer}>
                    <Text style={styles.text}>Chat session</Text>
                    <IconButton icon="close" mode="contained" onPress={() => { clearChat() }}>Publish</IconButton>
                </View>
                <Divider/>
                <KeyboardAvoidingView keyboardVerticalOffset={90} style={styles.container} >
                    <ScrollView ref={ref => { this.scrollView = ref }}
                        onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}>
                        {
                            messages?.map(({ role, content }) => {

                                if (role === "assistant") {
                                    return (<View style={styles.receiver}>
                                        <Avatar.Icon size={30} icon="robot" />
                                        <Text>{content}</Text>
                                    </View>)
                                }
                                else if (role === "user") {
                                    return (<View style={styles.sender}>
                                        <Avatar.Icon size={30} icon="account" />
                                        <Text>{content}</Text>
                                    </View>)
                                }
                            })
                        }

                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput style={styles.bottomtextInput} value={senderText} onChangeText={(senderText) => SetSenderText(senderText)}></TextInput>
                        <IconButton icon="send" mode="contained" disabled={senderText === ""} onPress={() => { sendMessage() }}>Publish</IconButton>
                    </View>
                </KeyboardAvoidingView>
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
    chatcontainer:{
        flexDirection: 'row',
        alignItems: 'center',
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