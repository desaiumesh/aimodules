import { Image, ImageBackground, StyleSheet, View, PermissionsAndroid, ScrollView, Image as RNimage } from 'react-native'
import React, { useRef, useState } from 'react'
import { Text, Button, Checkbox, IconButton, useTheme } from 'react-native-paper'
import ImageAnalysisApi from '../api/ImageAnalysisApi';
import { launchCamera, launchImageLibrary, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
import Slider from '@react-native-community/slider';
import useAsyncStorage from '../storage/useAsyncStorage';
import * as constants from '../constants/constants';

const VisionAIScreen = () => {

    const [computerResource] = useAsyncStorage("computerResource", null);
    const [base64Data, setBase64Data] = useState();
    const [imageFile, setImageFile] = useState();
    const [tags, setTags] = useState();
    const [boundingBoxes, setBoundingBoxes] = useState([]);
    const [objectBoundingBoxes, setObjectBoundingBoxes] = useState([]);
    const [imageWidth, setImageWidth] = useState();
    const [imageHeight, setImageHeight] = useState();
    const [checked, setChecked] = React.useState(false);
    const [objectConfidence, setObjectConfidence] = React.useState(0.50);
    const [personConfidence, setPersonConfidence] = React.useState(0.70);
    const [readText, setReadText] = useState();
    const theme = useTheme();

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
            setImageFile(result?.assets[0].uri);
            setImageWidth(result?.assets[0].width);
            setImageHeight(result?.assets[0].height);
            Reset();

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
            setImageWidth(result?.assets[0].width);
            setImageHeight(result?.assets[0].height);
            Reset();

        } catch (error) {
            console.log(error);

        }
    };

    const Reset = () => {
        setTags([]);
        setBoundingBoxes([]);
        setObjectBoundingBoxes([]);
        setChecked(false);
    };

    const analyse = async () => {

        const RESOURCE_KEY = computerResource?.key;
        const RESOURCE_REGION = computerResource?.region;

        const [ImageAnalysisVApi] = await ImageAnalysisApi({ RESOURCE_KEY, RESOURCE_REGION });

        try {

            if (base64Data == undefined) {
                alert('Please select an image');
                return;
            }

            var base64 = Buffer.from(base64Data, 'base64');
            const resp = await ImageAnalysisVApi({ base64 });

            setReadText(resp?.data?.readResult?.content);
            const tags = resp?.data?.tagsResult?.values?.map((item) => item.name);
            setTags(tags);

            const boundingBoxes = resp?.data?.peopleResult?.values;

            if (boundingBoxes?.length == 0) {
                setBoundingBoxes([]);
            }
            else {
                setBoundingBoxes(boundingBoxes);
            }

            const filteredObjectBoundingBoxes = resp?.data?.objectsResult?.values;
            const objectBoundingBoxes = filteredObjectBoundingBoxes?.filter((item) => item.tags[0].name != "person");

            if (objectBoundingBoxes?.length == 0) {
                setObjectBoundingBoxes([]);
            }
            else {
                setObjectBoundingBoxes(objectBoundingBoxes);
            }

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

        if (base64Data == undefined) {
            image2.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
        }
        else {
            image2.src = 'data:image/jpeg;base64,' + base64Data;
        }

        image2.addEventListener('load', () => {
            context.drawImage(image2, 0, 0, canvas.width, canvas.height);

            if (!boundingBoxes?.length == 0) {

                const pBoundingBoxes = boundingBoxes?.filter((item) => item.confidence >= personConfidence);

                const personboundingBoxes = pBoundingBoxes?.map((item) => item.boundingBox);

                personboundingBoxes.forEach(element => {

                    let percentBx = (100 * (element.x / imageWidth)),
                        percentBy = (100 * (element.y / imageHeight)),
                        percentBw = (element.w * 100) / imageWidth,
                        percentBh = (element.h * 100) / imageHeight;

                    let finalBx = (percentBx * canvas.width) / 100,
                        finalBy = (percentBy * canvas.height) / 100,

                        finalBw = (percentBw * canvas.width) / 100,
                        finalBh = (percentBh * canvas.height) / 100;

                    context.strokeStyle = "purple";
                    context.lineWidth = 2;
                    context.beginPath();
                    context.rect(finalBx, finalBy, finalBw, finalBh);
                    context.closePath();
                    context.stroke();

                });
            }

            if (!objectBoundingBoxes?.length == 0 && checked == false) {

                const objBoundingBoxes = objectBoundingBoxes?.filter((item) => item.tags[0].confidence >= objectConfidence);

                objBoundingBoxes.forEach(element => {

                    let percentBx = (100 * (element.boundingBox.x / imageWidth)),
                        percentBy = (100 * (element.boundingBox.y / imageHeight)),
                        percentBw = (element.boundingBox.w * 100) / imageWidth,
                        percentBh = (element.boundingBox.h * 100) / imageHeight;

                    let finalBx = (percentBx * canvas.width) / 100,
                        finalBy = (percentBy * canvas.height) / 100,

                        finalBw = (percentBw * canvas.width) / 100,
                        finalBh = (percentBh * canvas.height) / 100;

                    context.strokeStyle = "green";
                    context.fillStyle = "blue";
                    context.font = "bold 12px Mozer";
                    context.lineWidth = 2;
                    context.beginPath();
                    context.rect(finalBx, finalBy, finalBw, finalBh);
                    context.fillText(element.tags[0].name, finalBx, finalBy);
                    context.closePath();
                    context.stroke();

                });
            }
        })

    };


    return (
        <ImageBackground source={require('../assets/background.jpg')}
            style={constants.aiStyles.imageBackgroundImage}
            imageStyle={constants.aiStyles.imageBackgroundImageStyle}
            blurRadius={1}
            resizeMode="cover">

            <View style={styles.container}>
                <Canvas ref={_handleCanvas} />
                <View style={styles.innerContainer}>
                    <IconButton icon="camera" mode="contained" onPress={() => { OpenCamera() }}></IconButton>
                    <IconButton icon="image-multiple" mode="contained" onPress={() => { OpenGallery() }}></IconButton>
                    <IconButton icon="robot" mode="contained" onPress={() => { analyse() }}>ANALYSE</IconButton>
                    <Checkbox.Item label="People" status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setChecked(!checked);
                    }}
                />
                </View>

                <View style={styles.innerSliderContainer} >
                    <Text style={styles.imageText}>Object:</Text>
                    <Text style={styles.imageText}>{objectConfidence.toFixed(3)}</Text>
                    <Slider
                        style={{ width: 200, height: 40 }}
                        step={0.1}
                        minimumValue={0}
                        maximumValue={1}
                        value={objectConfidence}
                        minimumTrackTintColor={theme.colors.onPrimary}
                        maximumTrackTintColor={theme.colors.onPrimary}
                        thumbTintColor={theme.colors.primary}
                        onValueChange={(value) => { setObjectConfidence(value) }}
                    />
                </View>

                <View style={styles.innerSliderContainer} >
                    <Text style={styles.imageText}>Person:</Text>
                    <Text style={styles.imageText}>{personConfidence.toFixed(3)}</Text>
                    <Slider
                        style={{ width: 200, height: 40 }}
                        step={0.1}
                        minimumValue={0}
                        maximumValue={1}
                        value={personConfidence}
                        minimumTrackTintColor={theme.colors.onPrimary}
                        maximumTrackTintColor={theme.colors.onPrimary}
                        thumbTintColor={theme.colors.primary}
                        onValueChange={(value) => { setPersonConfidence(value) }}
                    />
                </View>
                <ScrollView>
                    <Text style={styles.imageText}>{tags?.map(u => u).join(", ")}</Text>
                    <Text style={styles.imageText}>{readText}</Text>
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
    imageText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    innerContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5,
    },
    innerSliderContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
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
