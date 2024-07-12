import { fileURLToPath } from 'url';
import path from 'path';
import { extractDataFromJSON, extractDataFromPDF, validateData, extractEntityNamesFromJSON } from '../../../common/helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'get_azure_blob_storage_snippets.json');
const csvFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'financial_information.csv');
const pdfFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'personal_information.pdf');
const financialInfoFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'financial_info.txt');
const personalInfoFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'personal_info.txt');

describe('VALIDATE_AZUREBLOB_CONTAINER_FINANCIAL_INFORMATION', function () {
    this.timeout(30000); // Set timeout to 30 seconds

    it('Validate if all credit card numbers are scanned from CREDIT_CARD_N_PERSON profile', async function () {
        extractDataFromJSON(jsonFilePath, financialInfoFilePath, 'CREDIT_CARD_N_PERSON', /\[CREDIT_CARD_NUMBER:\d{15,16}\]/g, 'CREDIT_CARD_NUMBER');
        await validateData(csvFilePath, financialInfoFilePath, 'Credit Card Number', 'CREDIT_CARD_NUMBER');
    });

    it('Validate if all person names are scanned from CREDIT_CARD_N_PERSON profile', async function () {
        extractDataFromJSON(jsonFilePath, financialInfoFilePath, 'CREDIT_CARD_N_PERSON', /\[PERSON:[^\]]+\]/g, 'PERSON');
        await validateData(csvFilePath, financialInfoFilePath, 'PERSON', 'PERSON');
    });

    it('Validate if all person names are scanned from BANK_ACCOUNT_N_PERSON profile', async function () {
        extractDataFromJSON(jsonFilePath, financialInfoFilePath, 'BANK_ACCOUNT_N_PERSON', /\[PERSON:[^\]]+\]/g, 'PERSON');
        await validateData(csvFilePath, financialInfoFilePath, 'PERSON', 'PERSON');
    });

    it('Validate if all bank account numbers are scanned from BANK_ACCOUNT_N_PERSON profile', async function () {
        extractDataFromJSON(jsonFilePath, financialInfoFilePath, 'BANK_ACCOUNT_N_PERSON', /\[US_BANK_NUMBER:[^\]]+\]/g, 'US_BANK_NUMBER');
        await validateData(csvFilePath, financialInfoFilePath, 'Bank Account Number', 'US_BANK_NUMBER');
    });      

    it('Validate if all email address are scanned from EMAIL_ADDRESS entity', async function () {
        extractEntityNamesFromJSON(jsonFilePath, personalInfoFilePath, 'EMAIL_ADDRESS', /\[EMAIL_ADDRESS:[^\]]+\]/g, 'EMAIL_ADDRESS');
        await validateData(pdfFilePath, personalInfoFilePath, 'Email Address', 'EMAIL_ADDRESS');
    });

    // it('Validate if all person names are scanned from PDF', async function () {
    //     await extractDataFromPDF(pdfFilePath, personalInfoFilePath, /\[PERSON:[^\]]+\]/g, 'PERSON');
    //     await validateData(csvFilePath, personalInfoFilePath, 'PERSON', 'PERSON');
    // });
});
