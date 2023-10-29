import { View, StyleSheet, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { appStyles } from '../styles/appStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ImageBackground } from 'react-native';
import { TextAnalysisEntitiesApi, TextAnalysisLanguageApi, TextAnalysisSentimentApi } from '../api/TextAnalysisApi';
import Loading from '../components/Loading';
import { Text , TextInput, Button} from 'react-native-paper';

const TextAIScreen = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [entities, setEntities] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const analyseText = () => {

    if (text == "") {
      alert("Please enter a Text");
      return;
    }

    Keyboard.dismiss();

    try {

      setIsLoading(true);

      TextAnalysisLanguageApi({ text })
        .then(resp => {
          if (resp.status == 200) {
            setLanguage(`${resp.data.documents[0].detectedLanguage.name} (${(resp.data.documents[0].detectedLanguage.confidenceScore * 100).toFixed(2)}%)`);
          }
          else {
            setLanguage("Error");
          }
        })

      TextAnalysisSentimentApi({ text })
        .then(resp => {
          if (resp.status == 200) {
            setSentiment(resp.data.documents[0].sentiment);
          }
          else {
            setSentiment("Error");
          }
        })

      TextAnalysisEntitiesApi({ text })
        .then(resp => {
          if (resp.status == 200) {

            let ent = '';
            resp.data.documents[0].entities.forEach(element => {
              ent += `${element.text} \n`;
            });

            setEntities(ent);
          }
          else {
            setEntities("Error");
          }
        })

    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
     <Loading></Loading>
    );
  }
  else {
    return (
      <ImageBackground source={require('../assets/AI2.jpg')}
        style={styles.image}
        imageStyle={styles.imageStyle}
        resizeMode="cover">

        <View style={styles.container}>
          <TextInput placeholder="Write a text here"
            onChangeText={(text) => setText(text)}
            style={styles.textInput} multiline={true} ></TextInput>
          <Button icon="text" mode="contained" onPress={() => { analyseText() }}>ANALYSE</Button>
          <View>
            <View style={styles.outputContainer}>
              <Text> Language: </Text>
              <Text>{language} </Text>
            </View>
            <View style={styles.outputContainer}>
              <Text>Sentiment: </Text>
              <Text>{sentiment} </Text>
            </View>
            <View style={styles.outputContainer}>
              <Text >Entities: </Text>
              <Text multiline={true}>{entities} </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    )
  }

};

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

export default TextAIScreen;