import { ImageBackground, StyleSheet, View } from 'react-native'
import React, {useState} from 'react'
import { Text, Button } from 'react-native-paper'
import { ImageAnalysisVApi } from '../api/ImageAnalysisApi';
import { TextAnalysisEntitiesApi, TextAnalysisLanguageApi, TextAnalysisSentimentApi } from '../api/TextAnalysisApi';

const VisionAIScreen = () => {
    const [text, setText] = useState("");

    const analyse = () => {
     
        try {

            ImageAnalysisVApi({ text })
                .then(resp => {
                    if (resp.status == 200) {
                        console.log(resp.data);
                    }
                    else {
                        console.log('error');
                    }
                })


        } catch (error) {
            console.log(error);
        }
        finally {

        }

    };

    return (
        <ImageBackground source={require('../assets/vision.jpg')}
            style={styles.image}
            imageStyle={styles.imageStyle}
            resizeMode="cover">

            <View style={styles.container}>
                <Text>Vision</Text>
                <Button icon="text" mode="contained" onPress={() => { analyse() }}>ANALYSE</Button>
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
        opacity: 0.3
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

export default VisionAIScreen;
