import { View, StyleSheet } from 'react-native'
import { Text, TextInput, IconButton, Avatar } from 'react-native-paper';
import React from 'react'

const AIResource = ({resourceText, firstInput, firstInputPlaceholder, firstInputChanged, 
    secondInput,secondInputPlaceholder, secondInputChanged, onPress }) => {
    return (
        <View>
            <View style={styles.innerContainer}>
                <Text style={styles.resourcetext}>{resourceText}</Text>
            </View>
            <TextInput style={styles.keyInputStyles}  value={firstInput} onChangeText={firstInputChanged} placeholder={firstInputPlaceholder} />
            <TextInput style={styles.keyInputStyles}  value={secondInput} onChangeText={secondInputChanged} placeholder={secondInputPlaceholder} />
        </View>
    )
}

export default AIResource;

const styles = StyleSheet.create({
   
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
    resourcetext: {
        fontSize: 15,
        fontWeight: 'bold',
        flex: 1,
    },
    keyInputStyles: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 5,
    }
    

});