import axios from 'axios'

const ImageAnalysisApi = async ({ RESOURCE_KEY, RESOURCE_REGION }) => {

  const baseUrl = `https://${RESOURCE_REGION}.api.cognitive.microsoft.com`;

  const handleRequest = async (url, base64, params) => {
    try {
      const response = await axios.post(url, base64, {
        headers: {
          "Content-Type": "application/octet-stream",
          'Ocp-Apim-Subscription-Key': RESOURCE_KEY,
        },
        params: params
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const API_VERSION = '2023-02-01-preview';
  const FEATURES = 'Tags,Objects,People';
  const LANGUAGE = 'en';
  const GENDER_NEUTRAL_CAPTION = 'False';

  const ImageAnalysisVApi = async ({ base64 }) => {
    const url = `${baseUrl}/computervision/imageanalysis:analyze`;
    const params = {
      'api-version': API_VERSION,
      'features': FEATURES,
      'language': LANGUAGE,
      'gender-neutral-caption': GENDER_NEUTRAL_CAPTION
    };

    return handleRequest(url, base64, params);
  }

  return [ImageAnalysisVApi];
};

export default ImageAnalysisApi;

