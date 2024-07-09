// blob_container.js

const axios = require('axios');
const createStorageAccountAndContainer = require('../../../generator/azure/unstructred_data_store/blob_container');
const createRequestBody = require('../../../../api/config/request_body/blob_container_scan');
const {
    SCAN_PROFILE
} = require('../../../../api/config/apiLinks');
const scan_api_url = SCAN_PROFILE;

async function performAPIAutomation() {
    try {
        // Create storage account and container
        const storageAccountName = await createStorageAccountAndContainer();
        console.log(`Storage account name returned: ${storageAccountName}`);

        // Prepare the request body with the updated storage account name
        const requestBody = createRequestBody(storageAccountName);

        // Perform POST request using Axios
        const apiUrl = scan_api_url;
        const headers = {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'authorization': 'Bearer token',
            'content-type': 'application/json',
            'origin': 'https://webui.normalyze.link',
            'priority': 'u=1, i',
            'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'x-called-by': 'webapp'
        };

        const response = await axios.post(apiUrl, requestBody, { headers });

        console.log('API response:', response.data);
    } catch (error) {
        console.error('Error performing API automation:', error.message);
    }
}

performAPIAutomation();
