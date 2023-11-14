import { View, Text, ImageBackground,StyleSheet } from 'react-native'
import React from 'react'

const AIImageBackground = () => {
  return (
    <ImageBackground source={require('../assets/AI2.jpg')}
        style={styles.image}
        imageStyle={styles.imageStyle} blurRadius={1}
        resizeMode="cover"/>
  )
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: 'center'
      },
      imageStyle: {
        opacity: 0.4
      },
});

export default AIImageBackground;