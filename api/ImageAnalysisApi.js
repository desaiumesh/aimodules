import axios from 'axios'

const RESOURCE_KEY="8b2ccf3a18f44b1182d976b6329d68ad";
const RESOURCE_REGION="australiaeast";

const baseUrl = `https://${RESOURCE_REGION}.api.cognitive.microsoft.com`;

const ImageAnalysisVApi = ({text}) => {
  
    const configurationObject = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': RESOURCE_KEY,
        },
        data: `{
            "url": "https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png"
          }`,
        url: `${baseUrl}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=Tags&language=en&gender-neutral-caption=False`,
    };

    try {
        const res = axios(configurationObject);
        return res;
    } catch (error) {
        return error;
    } 
}


export {ImageAnalysisVApi};