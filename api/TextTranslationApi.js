import axios from 'axios'

const TextTranslationApi = async ({ RESOURCE_KEY, RESOURCE_REGION }) => {

    const baseUrl = 'https://api.cognitive.microsofttranslator.com';

    const makeRequest = async (text, endpoint, from, to) => {

        const configurationObject = {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                'Ocp-Apim-Subscription-Key': RESOURCE_KEY,
                'Ocp-Apim-Subscription-Region': RESOURCE_REGION,
            },
            data: [{
                'text': `${text}`
            }],
            url: `${baseUrl}${endpoint}`,
            params: {
                'api-version': '3.0',
                'from': from,
                'to': to
            }
        };

        try {

            const res = await axios(configurationObject);
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    const TranslationApi = async ({ text, from, to }) => {
        return makeRequest(text, `/translate`, from, to);
    }

    return [TranslationApi];
};

export default TextTranslationApi;

