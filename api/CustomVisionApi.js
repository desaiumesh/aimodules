import axios from 'axios'

const CustomVisionApi = ({ projectId, trainingKey, trainingUrl, predictionKey, predictionUrl, publicationPredictionKey }) => {

    const axiosTrainingConfig = {
        headers: {
            "Content-Type": "application/json",
            'Training-key': trainingKey,
        },
    };

    const axiosTrainingImageConfig = {
        headers: {
            "Content-Type": "application/octet-stream",
            'Training-key': trainingKey,
        },
    };

    const axiosPredictionConfig = {
        headers: {
            "Content-Type": "application/octet-stream",
            'Prediction-Key': predictionKey,
        },
    };

    const handleRequest = async (requestType, url, config, data ) => {
        try {
          let response;
          if (requestType === 'get') {
            response = await axios.get(url, config);
          } else if (requestType === 'post') {
            response = await axios.post(url, data, config);
          }
          return response;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

    const CustomVisionGetTagsApi = async () => {
        const url = `${trainingUrl}/customvision/v3.0/Training/projects/${projectId}/tags`;
        return handleRequest('get', url, axiosTrainingConfig, null);
    }

    const CustomVisionGetIterationsApi = async () => {
        const url = `${trainingUrl}/customvision/v3.0/Training/projects/${projectId}/iterations`;
        return handleRequest('get', url, axiosTrainingConfig, null);
    }

    const CustomVisionGetIterationApi = async ({ iterationId }) => {
        const url = `${trainingUrl}/customvision/v3.0/Training/projects/${projectId}/iterations/${iterationId}`;
        return handleRequest('get', url, axiosTrainingConfig, null);
    }


    const CustomVisionCreateTagApi = async ({ name }) => {
        const url = `${trainingUrl}/customvision/v3.0/Training/projects/${projectId}/tags?name=${name}`;
        return handleRequest('post', url, axiosTrainingConfig, null);
    }

    const CustomVisionUploadImagesApi = async ({ tagArray, base64 }) => {
        const url = `${trainingUrl}/customvision/v3.0/Training/projects/${projectId}/images?tagIds=${tagArray}`;
        return handleRequest('post',url, axiosTrainingImageConfig, base64);
    }

    const CustomVisionTrainApi = async () => {
        const url = `${trainingUrl}/customvision/v3.0/Training/projects/${projectId}/train`;
        return handleRequest('post',url, axiosTrainingConfig, '');
    }

    const CustomVisionPublishIterationApi = async ({ iterationId, publishName }) => {
        const url = `${trainingUrl}/customvision/v3.0/training/projects/` +
            `${projectId}/iterations/${iterationId}/publish?predictionId=${publicationPredictionKey}&publishName=${publishName}`;
        return handleRequest('post',url, axiosTrainingConfig, '');
    }

    const CustomVisionTestApi = async ({ base64, iteration }) => {
        const url = `${predictionUrl}/customvision/v3.0/Prediction/${projectId}/classify/iterations/${iteration}/image`;
        return handleRequest('post',url, axiosPredictionConfig, base64);
    }

    return [CustomVisionGetTagsApi, CustomVisionGetIterationsApi, CustomVisionGetIterationApi,
        CustomVisionCreateTagApi, CustomVisionUploadImagesApi, CustomVisionTrainApi, CustomVisionPublishIterationApi, CustomVisionTestApi];

};

export default CustomVisionApi;