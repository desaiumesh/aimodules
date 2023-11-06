import { View, Text } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native';
import AiModel from './AiModel';

 const AiModels = () =>{
  return (
    <ScrollView contentContainerStyle={{
        paddingHorizontal: 15
      }}
     horizontal showsHorizontalScrollIndicator={false}>
      <AiModel title ="Text" imgUrl={require('../assets/text.jpg')} screen="Text"></AiModel>
      <AiModel title ="Speech" imgUrl={require('../assets/speech.jpg')} screen="Speech"></AiModel>
      <AiModel title ="Vision" imgUrl={require('../assets/vision.jpg')} screen="Vision"></AiModel>
      <AiModel title ="Classify" imgUrl={require('../assets/language.jpg')} screen="Classify"></AiModel>
      <AiModel title ="Chat" imgUrl={require('../assets/AI2.jpg')} screen="Chat"></AiModel>
      <AiModel title ="Image" imgUrl={require('../assets/AI1.jpg')} screen="Image"></AiModel>
    </ScrollView>
  )
}

export default AiModels;