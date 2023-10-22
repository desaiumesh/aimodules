import React from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import { appStyles } from '../styles/appStyle';

const Loading = () => {
    return (
        <ImageBackground source={require('../assets/loading_doc.gif')}
            style={styles.image}
            imageStyle={styles.imageStyle}>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: appStyles.primaryColor,
    },
    imageStyle: {
        opacity: 0.5,
    },
});

export default Loading;
