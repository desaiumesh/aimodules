import axios from 'axios'

const RESOURCE_KEY="8b2ccf3a18f44b1182d976b6329d68ad";
const RESOURCE_REGION="australiaeast";

const baseUrl = `https://${RESOURCE_REGION}.api.cognitive.microsoft.com`;

const TextAnalysisLanguageApi = ({text}) => {
  
    const configurationObject = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': RESOURCE_KEY,
        },
        data: `{
            "documents": [
              {
                "id": "1",
                "text": "${text}"
              }
            ]
          }`,
        url: `${baseUrl}/text/analytics/v3.0/languages/`,
    };

    return axios(configurationObject)
    .then(res => res) 
    .catch(error => error) 
}

const TextAnalysisSentimentApi = ({text}) => {
    
  const configurationObject = {
      method: 'post',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': RESOURCE_KEY,
      },
      data: `{
          "documents": [
            {
              "id": "1",
              "text": "${text}"
            }
          ]
        }`,
      url: `${baseUrl}/text/analytics/v3.0/sentiment/`,
  };

  return axios(configurationObject)
  .then(res => res) 
  .catch(error => error) 
}

const TextAnalysisEntitiesApi = ({text}) => {
    
  const configurationObject = {
      method: 'post',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': RESOURCE_KEY,
      },
      data: `{
          "documents": [
            {
              "id": "1",
              "text": "${text}"
            }
          ]
        }`,
      url: `${baseUrl}/text/analytics/v3.0/entities/recognition/general/`,
  };

  return axios(configurationObject)
  .then(res => res) 
  .catch(error => error) 
}

export {TextAnalysisLanguageApi, TextAnalysisSentimentApi, TextAnalysisEntitiesApi};