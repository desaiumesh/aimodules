import { View, StyleSheet, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { appStyles } from '../styles/appStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ImageBackground, ScrollView } from 'react-native';
import Loading from '../components/Loading';
import { Text, TextInput, Button, Divider, IconButton } from 'react-native-paper';
import TextAnalysisApi from '../api/TextAnalysisApi';
import useAsyncStorage from '../storage/useAsyncStorage';
import * as constants from '../constants/constants';
import uuid from 'react-native-uuid';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import AISelectList from '../components/AISelectList';
import TextTranslationApi from '../api/TextTranslationApi';

const TextAIScreen = () => {
  const [allLanguageData] = useAsyncStorage('speakingLanguages', constants.languages);

  const [textResource] = useAsyncStorage("textResource", null);
  const [translationResource] = useAsyncStorage("translationResource", null);
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [sentenceSentiment, setSentenceSentiment] = useState([]);
  const [entities, setEntities] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [targetLanguages, setTargetLanguages] = useState([]);
  const [selectedTarget, setTargetSelected] = useState("");

  useEffect(() => {

    allLanguageData?.forEach(element => {

      const found = targetLanguages.some(el => el.value === element.LanguageName)

      if (!found) {
        targetLanguages.push({
          key: element.key,
          value: element.LanguageName,
        });
      }

    });

  }, [allLanguageData]);


  const openDocument = async () => {

    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.plainText],
      });

      const fileContent = await RNFS.readFile(res.uri, 'utf8');

      setText("");
      setText(fileContent);

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.log(err);
      }
    }
  };

  const analyseText = () => {

    if (text == "") {
      alert("Please enter a Text");
      return;
    }

    Keyboard.dismiss();

    const RESOURCE_KEY = textResource?.key;
    const RESOURCE_REGION = textResource?.region;

    const [TextAnalysisLanguageApi, TextAnalysisSentimentApi, TextAnalysisEntitiesApi] = TextAnalysisApi({ RESOURCE_KEY, RESOURCE_REGION })

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

            setSentiment(resp?.data?.documents[0]?.sentiment);

            let sentenceSentiments = resp?.data?.documents[0]?.sentences;

            sentenceSentiments?.map((obj) => ({ ...obj, translatedText: '' }))
            setSentenceSentiment(sentenceSentiments)
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
              ent += `${element.text} ,`;
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

  const translateText = async () => {

    if (text == "") {
      alert("Please enter a Text");
      return;
    }

    if (selectedTarget == "") {
      alert("Please select a Target Language");
      return;
    }

    const RESOURCE_KEY = translationResource?.key;
    const RESOURCE_REGION = translationResource?.region;

    const [TranslationApi] = await TextTranslationApi({ RESOURCE_KEY, RESOURCE_REGION })

    try {

      setIsLoading(true);
      const targetLanguageObj = allLanguageData?.find(element => element.key === selectedTarget);

      sentenceSentiment?.forEach(async element => {

        var dataArray = [{ 'text': `${element?.text}`}];
        const resp = await TranslationApi({ dataArray, to: targetLanguageObj?.LanguageCode })
        if (resp.status == 200) {
          element.translatedText ='';
          element.translatedText = resp?.data[0]?.translations[0]?.text;
        }
        else {
          console.log("Error");
        }
      });

    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Loading></Loading>
    );
  }
  else {
    return (
      <ImageBackground source={require('../assets/background.jpg')}
        style={constants.aiStyles.imageBackgroundImage}
        imageStyle={constants.aiStyles.imageBackgroundImageStyle}
        blurRadius={1}
        resizeMode="cover">
        <View style={styles.container}>
          <TextInput placeholder="Write a text here"
            value={text}
            onChangeText={(text) => setText(text)}
            style={styles.textInput} multiline={true} numberOfLines={3} ></TextInput>
          <AISelectList data={targetLanguages} setSelected={setTargetSelected}
            placeholderText='Select Target Language' searchPlaceholderText='Search Target Language' />

          <View style={styles.innerContainer}>
            <IconButton icon="file" mode="contained" onPress={() => { openDocument() }}></IconButton>
            <IconButton icon="text" mode="contained" onPress={() => { analyseText() }}></IconButton>
            <IconButton icon="translate" mode="contained" onPress={() => { translateText() }}></IconButton>
          </View>
          <Divider style={styles.divider} />
          <View>
            <View style={styles.outputContainer}>
              <Text style={styles.languageText}>Language: </Text>
              <Text style={styles.languageText}>{language} </Text>
            </View>
            <Divider style={styles.divider} />
            <View>
              <Text style={styles.languageText} >Entities: </Text>
              <Text style={styles.languageText} multiline={true}>{entities}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.outputContainer}>
              <Text style={styles.languageText}>Overall Sentiment: </Text>
              <Text style={styles.languageText}>{sentiment} </Text>
            </View>
          </View>
          <ScrollView>
            {
              sentenceSentiment?.map(({ sentiment, text, translatedText }) => {
                return (<View style={styles.outputContainer} key={uuid.v4()}>
                  <View>
                    <Text style={styles.languageText}>{sentiment} : </Text>
                    <Text style={styles.languageText} multiline={true}>{text}</Text>
                    <Text style={styles.languageText} multiline={true}>{translatedText}</Text>
                  </View>
                </View>)
              })
            }
          </ScrollView>
          <Divider style={styles.divider} />

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
  languageText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  divider: {
    borderWidth: 1,
    marginBottom: 5,
    marginTop: 5
  },
  innerContainer: {
    padding: 2,
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
    borderWidth: 2,
    fontSize: 16,
    padding: 2,
    borderRadius: 10
  },
  outputContainer: {
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 2,
    marginBottom: 3
  }
})

export default TextAIScreen;