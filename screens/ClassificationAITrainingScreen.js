import { StyleSheet, View, ImageBackground, Image, PermissionsAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text, IconButton, TextInput } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import { CustomVisionApi, CustomVisionCreateTagApi, CustomVisionGetIterationApi, CustomVisionGetIterationPerformanceApi, CustomVisionGetIterationsApi, CustomVisionGetTagsApi, CustomVisionPublishIterationApi, CustomVisionTagsApi, CustomVisionTestApi, CustomVisionTrainApi, CustomVisionUploadImagesApi } from '../api/CustomVisionApi';
import { appStyles } from '../styles/appStyle';

const ClassificationAITrainingScreen = () => {
    const [base64Data, setBase64Data] = useState();
    const [text, setText] = useState();

    const [selectedTag, setSelectedTag] = useState();
    const [tags, setTags] = useState([]);
    const [Images, setImages] = useState([]);
    const [iteration, setIteration] = useState();
    const [publishName, setPublishName] = useState();
    const [publishedResponse, setPublishedResponse] = useState();

    const [selectedIteration, setSelectedIteration] = useState();
    const [iterations, setIterations] = useState([]);

    const [iterationData, setIterationData] = useState([]);

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


    const OpenGallery = async () => {

        await checkPermissions();

        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            includeBase64: true,
            selectionLimit: 20
        };

        try {

            const result = await launchImageLibrary(options);
            setImages(result?.assets);

        } catch (error) {
            console.log(error);

        }
    };


    const addTags = async () => {

        if (!text) {
            alert('Please enter tag name');
            return;
        }

        try {

            const name = text;
            const resp = await CustomVisionCreateTagApi({ name });

            if (resp.status == 200) {
                await getAndSetupTags();
                setText();
                alert('Tag created successfully');
            }
            else {
                alert('Error in creating tag');
            }

        } catch (error) {
            console.log(error);
        }
        finally {

        }

    };

    const getAndSetupTags = async () => {

        const resp = await CustomVisionGetTagsApi();

        if (resp.status == 200) {

            setTags([]);
            var tagsArray = [];
            resp.data.map((item) => {
                tagsArray.push({
                    key: item.id,
                    value: item.name,
                });
            });

            setTags(tagsArray);
        }
        else {
            alert('Error in getting tags');
        }
    };

    const getAndSetupIterations = async () => {

        const resp = await CustomVisionGetIterationsApi();

        if (resp.status == 200) {

            setIterations([]);
            var iterationsArray = [];
            resp.data.map((item) => {
                iterationsArray.push({
                    key: item.id,
                    value: item.name,
                });
            });

            setIterations(iterationsArray);
            console.log(iterationsArray);
        }
        else {
            alert('Error in getting tags');
        }
    };

    const getIterationPerformance = async () => {

        if (!selectedIteration) {
            alert('Please select iteration');
            return;
        }

        var iterationId = selectedIteration;

        const resp = await CustomVisionGetIterationApi({iterationId});

        if (resp.status == 200) {
            setIterationData(resp.data);
        }
        else {
            alert('Error in getting iteration data');
        }
    };

    const uploadImage = async () => {

        if (!selectedTag) {
            alert('Please select tag');
            return;
        }

        try {


            Images.forEach(async element => {
                var tagArray = selectedTag;
                var base64 = Buffer.from(element.base64, 'base64');
                const resp = await CustomVisionUploadImagesApi({ tagArray, base64 });
                console.log(JSON.stringify(resp.data));
            });

            alert('Images uploaded successfully');

        } catch (error) {
            console.log(error);
        }
        finally {

        }

    };

    const train = async () => {

        try {

            const resp = await CustomVisionTrainApi();
            console.log(JSON.stringify(resp));

            if (resp.status == 200) {
                setIteration(resp.data);
                alert('Training started successfully');
            }

        } catch (error) {
            console.log(error);
        }
        finally {

        }

    };

    const publish = async () => {

        if (!selectedIteration) {
            alert('Please train first');
            return;
        }

        if (!publishName) {
            alert('Please enter publish name');
            return;
        }

        try {

            var iterationId = selectedIteration;
            console.log(selectedIteration);
            const resp = await CustomVisionPublishIterationApi({ iterationId, publishName });
            console.log(JSON.stringify(resp));

            if (resp.status == 200) {
                setPublishedResponse(resp.data);
                console.log(resp.data);
                alert('published successfully');
            }

        } catch (error) {
            console.log(error);
        }
        finally {

        }

    };

    return (
        <ImageBackground source={require('../assets/speech.jpg')}
            style={styles.image}
            imageStyle={styles.imageStyle}
            resizeMode="cover">

            <View style={styles.container}>
                <View>
                    <View style={styles.innerTagContainer}>
                        <TextInput placeholder="Type tag name"
                            onChangeText={(text) => setText(text)} ></TextInput>
                        <IconButton icon="plus" mode="contained" onPress={() => { addTags() }}>Add Tags</IconButton>
                    </View>
                    <View style={styles.innerTagContainer}>
                        <SelectList
                            setSelected={setSelectedTag}
                            data={tags}
                            arrowicon={<Ionicons name="chevron-down" size={20} color={'white'} />}
                            searchicon={<Ionicons name="search" size={20} color={'white'} />}
                            closeicon={<Ionicons name="close" size={20} color={'white'} />}
                            search={true}
                            placeholder="Select Image Tag"
                            searchPlaceholder='Search Image Tag'
                            boxStyles={styles.boxStyles}
                            inputStyles={styles.inputStyles}
                            dropdownStyles={styles.dropdownStyles}
                        />
                        <IconButton icon="refresh" mode="contained" onPress={() => { getAndSetupTags() }}>Add Tags</IconButton>

                    </View>

                </View>
                <View style={styles.innerContainer}>
                    <IconButton icon="image-multiple" mode="contained" onPress={() => { OpenGallery() }}></IconButton>
                    <IconButton icon="upload" mode="contained" onPress={() => { uploadImage() }}>Upload Image</IconButton>
                    <IconButton icon="cog" mode="contained" onPress={() => { train() }}>Train</IconButton>
                </View>
                <Text>Latest Iteration :{iteration?.name}</Text>

                <View style={styles.innerContainer}>
                    <SelectList
                        setSelected={setSelectedIteration}
                        data={iterations}
                        arrowicon={<Ionicons name="chevron-down" size={20} color={'white'} />}
                        searchicon={<Ionicons name="search" size={20} color={'white'} />}
                        closeicon={<Ionicons name="close" size={20} color={'white'} />}
                        search={true}
                        placeholder="Select Iteration"
                        searchPlaceholder='Search Iteration'
                        boxStyles={styles.boxStyles}
                        inputStyles={styles.inputStyles}
                        dropdownStyles={styles.dropdownStyles}

                    />
                    <IconButton icon="refresh" mode="contained" onPress={() => { getAndSetupIterations() }}>Add Tags</IconButton>
                </View>
                <View style={styles.innerContainer}>
                    <Text>Status :{iterationData.status}</Text>
                    <IconButton icon="refresh" mode="contained" onPress={() => { getIterationPerformance() }}>Train</IconButton>
                </View>
                <View style={styles.innerTagContainer}>
                    <TextInput placeholder="Type publish name"
                        onChangeText={(text) => setPublishName(text)} ></TextInput>
                    <IconButton icon="web" mode="contained" onPress={() => { publish() }}>Publish</IconButton>
                </View>
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
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        marginRight: 20,
        marginLeft: 20,
    },
    innerTagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        padding: 10,
    },
    image: {
        flex: 1,
        justifyContent: 'center'
    },
    imageStyle: {
        opacity: 0.5
    },
    boxStyles: {
        borderRadius: 10,
        margin: 10,
        opacity: 0.7,
        textAlign: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    },
    cameraImage: {
        width: 300,
        height: 400,
    },
    inputStyles: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    dropdownStyles: {
        opacity: 0.7,
        borderRadius: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 15
    },
    buttonConatiner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    textSource: {
        height: 150,
        borderWidth: 2,
        margin: 10,
        fontSize: 16,
        borderRadius: 10,
        padding: 5,
    },
    button: {
        margin: 20,
    },
    boxStyles: {
        borderRadius: 10,
        margin: 10,
        opacity: 0.7,
        textAlign: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    },
    inputStyles: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    dropdownStyles: {
        opacity: 0.7,
        borderRadius: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        backgroundColor: appStyles.whiteColor,
    },
});


export default ClassificationAITrainingScreen;