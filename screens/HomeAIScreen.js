import { View, Image } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import AiModels from '../components/AiModels'
import { Text } from 'react-native-paper';

const HomeAIScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text} >Welcome to AI</Text>
      <Text style={styles.subtext} >Access high-quality vision, speech, language, and text AI models</Text>
      <Image source={require('../assets/AIImage.jpg')} style={styles.image} />
      <AiModels></AiModels>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent:'center',
    flex: 1,
    marginBottom :0
  },
  image: {
  },
  text: {
    fontWeight: 'bold',
    fontSize: 30,
    paddingBottom: 2,
    textAlign: 'justify'
  },
  subtext: {
    fontWeight: 'bold',
    fontSize: 15,
    padding: 10,
    textAlign: 'center'
  }

})

export default HomeAIScreen;
