import { View, Image } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import AiModels from '../components/AiModels'
import { Text } from 'react-native-paper';

const HomeAIScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text} >Welcome to AI</Text>
      <Text style={styles.subtext} >Access high-quality text, speech, vision, and open AI models</Text>
      <Image style={styles.image} resizeMode="cover" source={require('../assets/AIImage.jpg')} />
      <AiModels></AiModels>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  image: {
    height:'63%',
    alignSelf:'center'
  },
  text: {
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'justify'
  },
  subtext: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    padding: 10
  },
  aiModulecontainer: {
    flexGrow: 1,
  },
  footer: {
    height: 100
  }
})

export default HomeAIScreen;
