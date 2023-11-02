import axios from 'axios'

const baseTrainingUrl = `https://customaiimage.cognitiveservices.azure.com`;
const TRAININGKEY = "263c89ff01984f109a6f9b8b040e1a20";
const PROJECTID = "ba91a0bb-1f42-4777-8ce3-897692e71d5f";

const basePredictionUrl = `https://customaiimage-prediction.cognitiveservices.azure.com`;
const PREDICTIONKEY = "fb92bb0d21b74cdfbeb9076b6b9d4b1c";

const PUBLICATIONPREDICTIONKEY =`/subscriptions/bccebad9-cd2c-4d0b-83e5-0f0d6747cecc/resourceGroups/AI-102-ResourceGroup/providers/Microsoft.CognitiveServices/accounts/CustomAIImage-Prediction`

const CustomVisionGetTagsApi = async () => {

    const url = `${baseTrainingUrl}/customvision/v3.0/Training` +
        `/projects/${PROJECTID}/tags`;

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                'Training-key': TRAININGKEY,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}

const CustomVisionGetIterationsApi = async () => {

    const url = `${baseTrainingUrl}/customvision/v3.0/Training` +
        `/projects/${PROJECTID}/iterations`;

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                'Training-key': TRAININGKEY,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}

const CustomVisionGetIterationApi = async ({ iterationId }) => {

    const url = `${baseTrainingUrl}/customvision/v3.0/Training` +
        `/projects/${PROJECTID}/iterations/${iterationId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                'Training-key': TRAININGKEY,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}


const CustomVisionCreateTagApi = async ({ name }) => {

    const url = `${baseTrainingUrl}/customvision/v3.0/Training` +
        `/projects/${PROJECTID}/tags?name=${name}`;

    try {
        const response = await axios.post(url, '', {
            headers: {
                "Content-Type": "application/json",
                'Training-key': TRAININGKEY,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}

const CustomVisionUploadImagesApi = async ({ tagArray, base64 }) => {

    const url = `${baseTrainingUrl}/customvision/v3.0/Training` +
        `/projects/${PROJECTID}/images?tagIds=${tagArray}`;

    try {
        const response = await axios.post(url, base64, {
            headers: {
                "Content-Type": "application/octet-stream",
                'Training-key': TRAININGKEY,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}

const CustomVisionTrainApi = async () => {

    const url = `${baseTrainingUrl}/customvision/v3.0/Training` +
        `/projects/${PROJECTID}/train`;

        console.log(url);

    try {
        const response = await axios.post(url, '', {
            headers: {
                "Content-Type": "application/json",
                'Training-key': TRAININGKEY,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}

const CustomVisionPublishIterationApi = async ({iterationId, publishName }) => {

    const url = `${baseTrainingUrl}/customvision/v3.0/training/projects/` +
        `${PROJECTID}/iterations/${iterationId}/publish?predictionId=${PUBLICATIONPREDICTIONKEY}&publishName=${publishName}`;

    try {
        const response = await axios.post(url,'', {
            headers: {
                "Content-Type": "application/json",
                'Training-key': TRAININGKEY,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}

const CustomVisionTestApi = async ({ base64, iteration }) => {

    const url = `${basePredictionUrl}/customvision/v3.0/Prediction/` +
        `${PROJECTID}/classify/iterations/${iteration}/image`;

        console.log(url);

    try {
        const response = await axios.post(url, base64, {
            headers: {
                "Content-Type": "application/octet-stream",
                'Prediction-Key': PREDICTIONKEY,
            },
        });
        return response;
    } catch (error) {
        return error;
    }
}


export {CustomVisionGetTagsApi,CustomVisionGetIterationsApi,CustomVisionGetIterationApi,
     CustomVisionCreateTagApi, CustomVisionUploadImagesApi,CustomVisionTrainApi,CustomVisionPublishIterationApi, CustomVisionTestApi };