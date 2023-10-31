import { Image, ImageBackground, StyleSheet, View, PermissionsAndroid, ScrollView, Image as RNimage } from 'react-native'
import React, { useState } from 'react'
import { Text, Button } from 'react-native-paper'
import { ImageAnalysisVApi } from '../api/ImageAnalysisApi';
import { launchCamera, launchImageLibrary, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';

const VisionAIScreen = () => {
    const [base64Data, setBase64Data] = useState();
    const [imageFile, setImageFile] = useState();
    const [tags, setTags] = useState();

    const checkPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                ]);

                if (
                    grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.READ_EXTERNAL_STORAGE'] ===
                    PermissionsAndroid.RESULTS.GRANTED &&
                    grants['android.permission.CAMERA'] ===
                    PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('Permissions granted');
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                    console.log('All required permissions not granted');
                    return;
                }
            } catch (err) {
                console.warn(err);
                return;
            }
        }
    };

    const OpenCamera = async () => {

        await checkPermissions();

        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            includeBase64: true
        };

        try {
            const result = await launchCamera(options);
            setBase64Data(result?.assets[0].base64);

        } catch (error) {
            console.log(error);
        }
    };

    const OpenGallery = async () => {

        await checkPermissions();

        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            includeBase64: true
        };

        try {

            const result = await launchImageLibrary(options);
            setBase64Data(result?.assets[0].base64);
            setImageFile(result?.assets[0].uri);

        } catch (error) {
            console.log(error);

        }
    };

    const analyse = async () => {

        try {

            var base64 = Buffer.from(base64Data, 'base64');

            const resp = await ImageAnalysisVApi({ base64 });

            const tags = resp?.data?.tagsResult?.values?.map((item) => item.name);
            setTags(tags);
            console.log(JSON.stringify(resp?.data));

            console.log(tags);

        } catch (error) {
            console.log(error);
        }
        finally {

        }

    };

    const _handleCanvas = (canvas) => {

        if (!(canvas instanceof Canvas)) {
            return;
          }

          canvas.width = 300;
          canvas.height = 400;

          const context = canvas.getContext('2d');
          const image2 = new CanvasImage(canvas);
          image2.src ='data:image/jpeg;base64,'+base64Data;
          image2.addEventListener('load', () => {

            context.drawImage(image2,0,0,canvas.width,canvas.height);
            context.fillStyle = 'purple';
            context.lineWidth = 3;
            context.beginPath();
            context.rect(150, 70, 50, 50);  
            context.closePath();
            context.stroke();
    
         })
      
    };


    return (
        <ImageBackground source={require('../assets/vision.jpg')}
            style={styles.image}
            imageStyle={styles.imageStyle}
            resizeMode="cover">

            <View style={styles.container}>
                   <Canvas ref={_handleCanvas}/>
                   <View style={styles.innerContainer}>
                    <Button icon="camera" mode="contained" onPress={() => { OpenCamera() }}>Camera</Button>
                    <Button icon="view-gallery" mode="contained" onPress={() => { OpenGallery() }}>Gallery</Button>
                </View>
                <Button icon="text" mode="contained" onPress={() => { analyse() }}>ANALYSE</Button>
                <ScrollView>
                    <Text style={styles.text}>{tags?.map(u => u).join(", ")}</Text>
                </ScrollView>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        alignItems: 'center',
        padding: 10,
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    cameraImage: {
        width: 300,
        height: 400,
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
