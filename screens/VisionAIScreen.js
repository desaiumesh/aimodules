import { Image, ImageBackground, StyleSheet, View, PermissionsAndroid, ScrollView, Image as RNimage } from 'react-native'
import React, { useRef, useState } from 'react'
import { Text, Button, Checkbox, IconButton } from 'react-native-paper'
import { ImageAnalysisVApi } from '../api/ImageAnalysisApi';
import { launchCamera, launchImageLibrary, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';

const VisionAIScreen = () => {
    const [base64Data, setBase64Data] = useState();
    const [imageFile, setImageFile] = useState();
    const [tags, setTags] = useState();
    const [boundingBoxes, setBoundingBoxes] = useState([]);
    const [objectBoundingBoxes, setObjectBoundingBoxes] = useState([]);
    const [imageWidth, setImageWidth] = useState();
    const [imageHeight, setImageHeight] = useState();
    const [checked, setChecked] = React.useState(false);

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

        try {

            var base64 = Buffer.from(base64Data, 'base64');
            const resp = await ImageAnalysisVApi({ base64 });
            console.log(JSON.stringify(resp?.data));

            const tags = resp?.data?.tagsResult?.values?.map((item) => item.name);
            setTags(tags);

            const filteredBoundingBoxes = resp?.data?.peopleResult?.values?.filter(st => st.confidence > 0.70);
            const boundingBoxes = filteredBoundingBoxes?.map((item) => item.boundingBox);

            if (boundingBoxes?.length == 0) {
                setBoundingBoxes([]);
            }
            else {
                setBoundingBoxes(boundingBoxes);
            }

            const filteredObjectBoundingBoxes = resp?.data?.objectsResult?.values;
            const objectBoundingBoxes = filteredObjectBoundingBoxes?.filter((item) => item.tags[0].confidence > 0.5 && item.tags[0].name != "person");

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
        image2.src = 'data:image/jpeg;base64,' + base64Data;

        image2.addEventListener('load', () => {
            context.drawImage(image2, 0, 0, canvas.width, canvas.height);

            if (!boundingBoxes?.length == 0) {

                boundingBoxes.forEach(element => {

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

                objectBoundingBoxes.forEach(element => {

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
        <ImageBackground source={require('../assets/vision.jpg')}
            style={styles.image}
            imageStyle={styles.imageStyle}
            resizeMode="cover">

            <View style={styles.container}>
                <Canvas ref={_handleCanvas} />

                <View style={styles.innerContainer}>
                    <IconButton icon="camera" mode="contained" onPress={() => { OpenCamera() }}></IconButton>
                    <IconButton icon="image-multiple" mode="contained" onPress={() => { OpenGallery() }}></IconButton>
                    <IconButton icon="robot" mode="contained" onPress={() => { analyse() }}>ANALYSE</IconButton>
                </View>
                <ScrollView>
                    <Text style={styles.text}>{tags?.map(u => u).join(", ")}</Text>
                </ScrollView>
                <Checkbox.Item label="People only" status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setChecked(!checked);
                    }}
                />
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
        justifyContent: 'space-between',
        gap: 20,
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
