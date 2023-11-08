import axios from 'axios'

const CustomVisionApi = ({projectId, trainingKey, trainingUrl, predictionKey, predictionUrl,publicationPredictionKey}) => {
  
 const CustomVisionGetTagsApi = async () => {

    const url = `${trainingUrl}/customvision/v3.0/Training` +
        `/projects/${projectId}/tags`;

        console.log(url);

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                'Training-key': trainingKey,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}

const CustomVisionGetIterationsApi = async () => {

    console.log('CustomVisionGetIterationsApi');

    const url = `${trainingUrl}/customvision/v3.0/Training` +
        `/projects/${projectId}/iterations`;

    console.log(url);

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                'Training-key': trainingKey,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}

const CustomVisionGetIterationApi = async ({ iterationId }) => {

    const url = `${trainingUrl}/customvision/v3.0/Training` +
        `/projects/${projectId}/iterations/${iterationId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                'Training-key': trainingKey,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}


const CustomVisionCreateTagApi = async ({ name }) => {

    const url = `${trainingUrl}/customvision/v3.0/Training` +
        `/projects/${projectId}/tags?name=${name}`;

    try {
        const response = await axios.post(url, '', {
            headers: {
                "Content-Type": "application/json",
                'Training-key': trainingKey,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}

const CustomVisionUploadImagesApi = async ({ tagArray, base64 }) => {

    const url = `${trainingUrl}/customvision/v3.0/Training` +
        `/projects/${projectId}/images?tagIds=${tagArray}`;

    try {
        const response = await axios.post(url, base64, {
            headers: {
                "Content-Type": "application/octet-stream",
                'Training-key': trainingKey,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}

const CustomVisionTrainApi = async () => {

    const url = `${trainingUrl}/customvision/v3.0/Training` +
        `/projects/${projectId}/train`;

        console.log(url);

    try {
        const response = await axios.post(url, '', {
            headers: {
                "Content-Type": "application/json",
                'Training-key': trainingKey,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}

const CustomVisionPublishIterationApi = async ({iterationId, publishName }) => {

    const url = `${trainingUrl}/customvision/v3.0/training/projects/` +
        `${projectId}/iterations/${iterationId}/publish?predictionId=${publicationPredictionKey}&publishName=${publishName}`;

    try {
        const response = await axios.post(url,'', {
            headers: {
                "Content-Type": "application/json",
                'Training-key': trainingKey,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}

const CustomVisionTestApi = async ({ base64, iteration }) => {

    const url = `${predictionUrl}/customvision/v3.0/Prediction/` +
        `${projectId}/classify/iterations/${iteration}/image`;

        console.log(url);

    try {
        const response = await axios.post(url, base64, {
            headers: {
                "Content-Type": "application/octet-stream",
                'Prediction-Key': predictionKey,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}


return [CustomVisionGetTagsApi,CustomVisionGetIterationsApi,CustomVisionGetIterationApi,
     CustomVisionCreateTagApi, CustomVisionUploadImagesApi,CustomVisionTrainApi,CustomVisionPublishIterationApi, CustomVisionTestApi ];

};

export default CustomVisionApi;