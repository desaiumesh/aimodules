import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { useEffect } from 'react';

const TextAnalysisApi = ({RESOURCE_KEY, RESOURCE_REGION}) => {

  const baseUrl = `https://${RESOURCE_REGION}.api.cognitive.microsoft.com`;

  const TextAnalysisLanguageApi = async ({ text }) => {

    console.log(RESOURCE_KEY);

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

    try {
      const res = await axios(configurationObject);
      return res;
    } catch (error) {
      return error;
    }
  }

  const TextAnalysisSentimentApi = async ({ text }) => {

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

    try {
      const res = await axios(configurationObject);
      return res;
    } catch (error) {
      return error;
    }
  }

  const TextAnalysisEntitiesApi = async ({ text }) => {

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

    try {
      const res = await axios(configurationObject);
      return res;
    } catch (error) {
      return error;
    }
  }

  return [TextAnalysisLanguageApi, TextAnalysisSentimentApi, TextAnalysisEntitiesApi];

};

export default TextAnalysisApi;