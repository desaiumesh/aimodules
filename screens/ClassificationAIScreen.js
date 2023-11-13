import { StyleSheet, View, ImageBackground, Image, PermissionsAndroid, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Text, IconButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomVisionApi from '../api/CustomVisionApi';
import { SelectList } from 'react-native-dropdown-select-list'
import { appStyles } from '../styles/appStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAsyncStorage from '../storage/useAsyncStorage';
import uuid from 'react-native-uuid';

const ClassificationAIScreen = () => {

  const [customVisionResource] = useAsyncStorage("customVisionResource", null);

  const projectId = customVisionResource?.projectId;
  const trainingKey = customVisionResource?.trainingKey;
  const trainingUrl = customVisionResource?.trainingUrl;

  const predictionKey = customVisionResource?.predictionKey;
  const predictionUrl = customVisionResource?.predictionUrl;
  const publicationPredictionKey = customVisionResource?.publicationPredictionKey;


  const [base64Data, setBase64Data] = useState();
  const [selectedIteration, setSelectedIteration] = useState();
  const [iterations, setIterations] = useState([]);
  const [predictions, setPredictions] = useState();

  const [, CustomVisionGetIterationsApi, , , , , , CustomVisionTestApi] =
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
      includeBase64: true
    };

    try {

      const result = await launchImageLibrary(options);
      setBase64Data(result?.assets[0].base64);

      console.log('result');
      console.log(result?.assets[0].base64);

    } catch (error) {
      console.log(error);

    }
  };

  const getAndSetupIterations = async () => {

    const resp = await CustomVisionGetIterationsApi();

    console.log('resp');
    console.log(resp.data);

    if (resp.status == 200) {

      setIterations([]);
      var iterationsArray = [];
      resp.data.map((item) => {

        if (item.publishName !== null) {
          iterationsArray.push({
            key: item.id,
            value: item.publishName,
          });
        }

      });

      setIterations(iterationsArray);
    }
    else {
      alert('Error in getting tags');

    }
  };

  const testImage = async () => {

    if (!selectedIteration) {
      alert('Please select iteration');
      return;
    }

    if (!base64Data) {
      alert('Please select image');
      return;
    }

    try {
      console.log("starts here");

      console.log(selectedIteration);
      var iterationData = iterations.filter((item) => item.key === selectedIteration);
      var iteration = iterationData[0].value;

      var base64 = Buffer.from(base64Data, 'base64');
      const resp = await CustomVisionTestApi({ base64, iteration });

      if (resp.status == 200) {
        setPredictions(resp.data.predictions);
      }
      else {
        alert('Error occured');
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
        <View style={styles.ImageContainer}>
          <Image source={{ uri: 'data:image/jpeg;base64,' + base64Data }} style={styles.cameraImage} />
        </View>
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
        <View style={styles.innerContainer}>
          <IconButton icon="refresh" mode="contained" onPress={() => { getAndSetupIterations() }}>Add Tags</IconButton>
          <IconButton icon="image-multiple" mode="contained" onPress={() => { OpenGallery() }}></IconButton>
          <IconButton icon="robot" mode="contained" onPress={() => { testImage() }}>ANALYSE</IconButton>
        </View>
        <ScrollView>
          {
            predictions?.map((item) => {
              return (
                <View style={styles.predictionContainer} key={uuid.v4()}>
                  <Text style={styles.predictionText}>{item.tagName} :</Text>
                  <Text style={styles.predictionText}>{(item.probability * 100).toFixed(4)} %</Text>
                </View>
              );
            })
          }
        </ScrollView>
      </View>
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
    gap: 10,
  },
  predictionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginRight: 80,
    marginLeft: 80,
    fontWeight: 'bold',
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
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    padding: 10,
  },
  predictionText: {
    fontSize: 15,
    fontWeight: 'bold',
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
    width: 320,
    height: 350,
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


export default ClassificationAIScreen;