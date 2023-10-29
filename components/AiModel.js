import { View, Image,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { appStyles } from '../styles/appStyle';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';

const AiModel = ({title, imgUrl, screen}) => {
const navigation = useNavigation();
    return (
        <TouchableOpacity  onPress={() => { navigation.navigate(screen) }}>
            <View style = {styles.container}>
               <Image source={imgUrl} style={styles.image} />
               <Text>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
     padding :15,
     alignItems:'center',
     width:150
    },
    text:{
        fontWeight: 'bold',
        fontSize: 18
    },
    image:{
        width :140,
        height :100
    }
    
});

export default AiModel;