import { StyleSheet, View, ImageBackground, Image, PermissionsAndroid, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Text, IconButton, TextInput, Modal, Portal, List } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomVisionApi from '../api/CustomVisionApi';
import { appStyles } from '../styles/appStyle';
import Carousel from 'react-native-reanimated-carousel';
import useAsyncStorage from '../storage/useAsyncStorage';
import * as constants from '../constants/constants';
import AISelectList from '../components/AISelectList';

const ClassificationAITrainingScreen = () => {

    const [customVisionResource] = useAsyncStorage("customVisionResource", null);
    const projectId = customVisionResource?.projectId;
    const trainingKey = customVisionResource?.trainingKey;
    const trainingUrl = customVisionResource?.trainingUrl;

    const predictionKey = customVisionResource?.predictionKey;
    const predictionUrl = customVisionResource?.predictionUrl;
    const publicationPredictionKey = customVisionResource?.publicationPredictionKey;

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

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [visibleIteration, setVisibleIteration] = React.useState(false);
    const showIterationModal = () => setVisibleIteration(true);
    const hideIterationModal = () => setVisibleIteration(false);

    const [CustomVisionGetTagsApi, CustomVisionGetIterationsApi, CustomVisionGetIterationApi,
        CustomVisionCreateTagApi, CustomVisionUploadImagesApi, CustomVisionTrainApi,
        CustomVisionPublishIterationApi] =
        CustomVisionApi({
            projectId, trainingKey, trainingUrl,
            predictionKey, predictionUrl, publicationPredictionKey
        });

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

        const resp = await CustomVisionGetIterationApi({ iterationId });

        if (resp.status == 200) {
            setIterationData(resp.data);
            showIterationModal();
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
        <ImageBackground source={require('../assets/background.jpg')}
            style={constants.aiStyles.imageBackgroundImage}
            imageStyle={constants.aiStyles.imageBackgroundImageStyle}
            blurRadius={1}
            resizeMode="cover">
            <ScrollView>
                <List.Accordion title="1: Tag">
                    <Portal>
                        <Modal theme={{ colors: { backdrop: 'rgba(0, 0, 0, 0.6)' } }} visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modelContainerStyle}>
                            <View>
                                <View style={styles.innerTagContainer}>
                                    <Text style={styles.text}>Tag : </Text>
                                    <TextInput style={styles.textInput} placeholder="Type tag name"
                                        onChangeText={(text) => setText(text)} ></TextInput>
                                    <IconButton icon="plus" mode="contained" onPress={() => { addTags() }}>Add Tags</IconButton>
                                </View>
                            </View>
                        </Modal>
                    </Portal>
                    <View style={styles.innerContainer}>
                        <IconButton icon="refresh" mode="contained" onPress={() => { getAndSetupTags() }}>Add Tags</IconButton>
                        <View style={styles.innerSelectContainer}>
                            <AISelectList setSelected={setSelectedTag} data={tags}
                                placeholderText="Select Image Tag"
                                searchPlaceholderText='Search Image Tag' />
                        </View>
                        <IconButton icon="plus" mode="contained" onPress={showModal}>Add Tags</IconButton>
                    </View>
                </List.Accordion>

                <List.Accordion title="2: Train">
                    <View style={styles.ImageContainer}>
                        <Carousel
                            loop
                            width={300}
                            height={150}
                            autoPlay={false}
                            data={Images}
                            scrollAnimationDuration={1000}
                            mode='parallax'
                            renderItem={({ item }) => (
                                <View
                                    style={{
                                        flex: 1,
                                        borderWidth: 1,
                                        justifyContent: 'center',
                                    }} >
                                    <Image resizeMode='contain' source={{ uri: 'data:image/jpeg;base64,' + item['base64'] }} width={300} height={180} />
                                </View>
                            )}
                        />
                    </View>
                    <View style={styles.innerContainer}>
                        <IconButton icon="image-multiple" mode="contained" onPress={() => { OpenGallery() }}></IconButton>
                        <IconButton icon="upload" mode="contained" onPress={() => { uploadImage() }}>Upload Image</IconButton>
                        <IconButton icon="cog" mode="contained" onPress={() => { train() }}>Train</IconButton>
                    </View>
                </List.Accordion>

                <List.Accordion title="3: Iteration">
                    <View style={styles.innerContainer}>
                        <IconButton icon="refresh" mode="contained" onPress={() => { getAndSetupIterations() }}>Add Tags</IconButton>
                        <View style={styles.innerSelectContainer}>
                            <AISelectList setSelected={setSelectedIteration} data={iterations}
                                placeholderText="Select Iteration" searchPlaceholderText='Search Iteration' />
                        </View>
                        <IconButton icon="progress-check" mode="contained" onPress={() => { getIterationPerformance() }}>Train</IconButton>
                    </View>
                    <Portal>
                        <Modal theme={{ colors: { backdrop: 'rgba(0, 0, 0, 0.7)' } }} visible={visibleIteration} onDismiss={hideIterationModal} contentContainerStyle={styles.modelContainer1Style}>
                            <View style={styles.innerContainer}>
                                <Text>Iteration Status :{iterationData.status}</Text>
                            </View>
                        </Modal>
                    </Portal>
                </List.Accordion>

                <List.Accordion title="4: Publish">
                    <View style={styles.innerTagContainer}>
                        <TextInput style={styles.inputPublishStyles} placeholder="Type publish name"
                            onChangeText={(text) => setPublishName(text)} ></TextInput>
                    </View>
                    <View style={styles.IconButton} >
                        <IconButton icon="web" mode="contained" onPress={() => { publish() }}>Publish</IconButton>
                    </View>
                </List.Accordion>
            </ScrollView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 10,
        marginRight: 20,
        marginLeft: 20,
    },
    innerSelectContainer: {
        flex: 1
    },
    textInput: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1
    },
    innerTagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    innerDropdownContainer: {
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        padding: 10,
    },
    textButllet: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingTop: 10,
    },
    image: {
        flex: 1
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
        height: 150,
    },
    inputStyles: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    inputPublishStyles: {
        fontSize: 15,
        fontWeight: 'bold',
        width: 230
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
        width: 230,
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
    modelContainerStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        padding: 20,
        margin: 10,

    },
    modelContainer1Style: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        padding: 20,
        margin: 10,

    },
    ImageContainer: {
        marginRight: 20,
        marginLeft: 20,
        marginTop: 20,
        borderColor: 'red',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    IconButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        bold: 'true'
    },
});


export default ClassificationAITrainingScreen;