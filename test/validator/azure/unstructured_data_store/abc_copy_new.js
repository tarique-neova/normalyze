import { fileURLToPath } from 'url';
import path from 'path';
import { extractData, validateData } from '../../../common/helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'get_azure_blob_storage_snippets.json');
const csvFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'financial_information.csv');
const txtFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'credit_card_numbers.txt');
const personFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'person_names.txt');

describe('VALIDATE_AZUREBLOB_CONTAINER_FINANCIAL_INFORMATION', function () {
    this.timeout(30000); // Set timeout to 30 seconds

    it('Validate if all credit card profiles are scanned', async function () {
        extractData(jsonFilePath, txtFilePath, 'CREDIT_CARD_N_PERSON', /\[CREDIT_CARD_NUMBER:\d{16}\]/g, 'CREDIT_CARD_NUMBER');
        await validateData(csvFilePath, txtFilePath, 'credit card number', 'CREDIT_CARD_NUMBER');
    });

    it('Validate if all person names are scanned', async function () {
        extractData(jsonFilePath, personFilePath, 'CREDIT_CARD_N_PERSON', /\[PERSON:[^\]]+\]/g, 'PERSON');
        await validateData(csvFilePath, personFilePath, 'person', 'PERSON');
    });
});
