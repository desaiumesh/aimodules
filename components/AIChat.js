import { StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { Text, TextInput, IconButton, Avatar } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

const AIChat = ({ messages, senderText, SetSenderText, onPress }) => {

    return (
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
                <IconButton icon="send" mode="contained" disabled={senderText === ""} onPress={onPress}></IconButton>
            </View>
        </KeyboardAvoidingView>
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
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        padding: 10,
    },
    bottomtextInput: {
        bottom: 0,
        flex: 1
    }
})

export default AIChat;