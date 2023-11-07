import axios from 'axios'

const RESOURCE_KEY="5e4cd7027f1d46a69fb9d21492b0d1bd";
const RESOURCE_REGION="australiaeast";

const baseUrl = `https://${RESOURCE_REGION}.api.cognitive.microsoft.com`;

const ImageAnalysisVApi = async ({base64}) => {

    const url= `${baseUrl}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&`+
    `features=Tags,Objects,People&language=en&gender-neutral-caption=False`;

    try {
        const response = await axios.post(url, base64, {
            headers: {
              "Content-Type": "application/octet-stream",
              'Ocp-Apim-Subscription-Key': RESOURCE_KEY,
            },
          });
        return response;
    } catch (error) {
        return error;
    } 
}


export {ImageAnalysisVApi};