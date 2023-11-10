import axios from 'axios'

const TextAnalysisApi = ({ RESOURCE_KEY, RESOURCE_REGION }) => {

  const baseUrl = `https://${RESOURCE_REGION}.api.cognitive.microsoft.com`;

  const makeRequest = async (text, endpoint) => {
    const dataObject = {
      documents: [
        {
          id: "1",
          text: text
        }
      ]
    };

    const configurationObject = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': RESOURCE_KEY,
      },
      data: JSON.stringify(dataObject),
      url: `${baseUrl}${endpoint}`,
    };

    try {
      const res = await axios(configurationObject);
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const TextAnalysisLanguageApi = async ({ text }) => {
    return makeRequest(text, '/text/analytics/v3.0/languages/');
  }

  const TextAnalysisSentimentApi = async ({ text }) => {
    return makeRequest(text, '/text/analytics/v3.0/sentiment/');
  }

  const TextAnalysisEntitiesApi = async ({ text }) => {
    return makeRequest(text, '/text/analytics/v3.0/entities/recognition/general/');
  }

  return [TextAnalysisLanguageApi, TextAnalysisSentimentApi, TextAnalysisEntitiesApi];

};

export default TextAnalysisApi;