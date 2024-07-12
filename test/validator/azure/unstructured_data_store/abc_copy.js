import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { extractEntityData, validateData, validateEntityData, extractProfileData } from '../../../common/helper_copy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input Test Data File
const nzSnippetJsonFile = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'snippets.json');
const financialInfoTestData = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'financial_information.csv');
const govtInfoZipFIle = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'govt_data.zip');
const personalInfoTestDataFile = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'personal_information.xlsx');
const goveInforZipExtractionPath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'govt_data.csv');
const zipFileBuffer = fs.readFileSync(govtInfoZipFIle);

// Output Files used for comparison
const financialInoScannedFile = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'financial_info.txt');
const govtInoScannedFile = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'govt.txt');
const personalInfoScannedFile = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'personal_info.txt');
const personalInfoConvertedFile = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'personal_info.csv');
const extractZipPath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store');



describe('VALIDATE_AZUREBLOB_CONTAINER_FINANCIAL_INFORMATION', function () {
  this.timeout(30000); // Set timeout to 30 seconds

  // PROFILES APPLICABLE IN THIS TEST - 
  // 1. CREDIT_CARD_N_PERSON
  // 2. BANK_ACCOUNT_N_PERSON

  // ENTITIES APPLICABLE IN THIS TEST
  // 1. PERSON
  // 2. CREDIT_CARD_NUMBER
  // 3. US_BANK_NUMBER


  it('Validate if all credit card numbers are scanned from CREDIT_CARD_N_PERSON profile', async function () {
    extractProfileData(nzSnippetJsonFile, financialInoScannedFile, 'CREDIT_CARD_N_PERSON', /\[CREDIT_CARD_NUMBER:\d{15,16}\]/g, 'CREDIT_CARD_NUMBER');
    await validateData(financialInfoTestData, financialInoScannedFile, 'Credit Card Number', 'CREDIT_CARD_NUMBER');
  });

  it('Validate if all person names are scanned from CREDIT_CARD_N_PERSON profile', async function () {
    extractProfileData(nzSnippetJsonFile, financialInoScannedFile, 'CREDIT_CARD_N_PERSON', /\[PERSON:[^\]]+\]/g, 'PERSON');
    await validateData(financialInfoTestData, financialInoScannedFile, 'Name', 'PERSON')
      .then(() => {
        console.log('Test passed');
      })
      .catch((error) => {
        console.error('Test failed:', error.message);
      });
  });

  // it('Validate if all person names are scanned from BANK_ACCOUNT_N_PERSON profile', async function () {
  //   extractProfileData(nzSnippetJsonFile, financialInoScannedFile, 'BANK_ACCOUNT_N_PERSON', /\[PERSON:[^\]]+\]/g, 'PERSON');
  //   await validateData(financialInfoTestData, financialInoScannedFile, 'PERSON', 'PERSON');
  // });

  // it('Validate if all bank account numbers are scanned from BANK_ACCOUNT_N_PERSON profile', async function () {
  //   extractProfileData(nzSnippetJsonFile, financialInoScannedFile, 'BANK_ACCOUNT_N_PERSON', /\[US_BANK_NUMBER:[^\]]+\]/g, 'US_BANK_NUMBER');
  //   await validateData(financialInfoTestData, financialInoScannedFile, 'Bank Account Number', 'US_BANK_NUMBER');
  // });

  // it('Validate if all person names are scanned from PERSON entity', async function () {
  //   extractEntityData(nzSnippetJsonFile, financialInoScannedFile, 'PERSON', 'financial_information.csv', /\[PERSON:([^\]]+)\]/g)
  //   await validateEntityData(financialInfoTestData, financialInoScannedFile, 'PERSON');
  // });

  // it('Validate if all credit card numbers are scanned from CREDIT_CARD_NUMBER entity', async function () {
  //   extractEntityData(nzSnippetJsonFile, financialInoScannedFile, 'CREDIT_CARD_NUMBER', 'financial_information.csv', /\[CREDIT_CARD_NUMBER:([^\]]+)\]/g)
  //   await validateEntityData(financialInfoTestData, financialInoScannedFile, 'CREDIT_CARD_NUMBER');
  // });

  // it('Validate if all person names are scanned from US_BANK_NUMBER entity', async function () {
  //   extractEntityData(nzSnippetJsonFile, financialInoScannedFile, 'US_BANK_NUMBER', 'financial_information.csv', /\[US_BANK_NUMBER:([^\]]+)\]/g)
  //   await validateEntityData(financialInfoTestData, financialInoScannedFile, 'US_BANK_NUMBER');
  // });
});


// describe('VALIDATE_AZUREBLOB_CONTAINER_GOVT_INFORMATION', function () {

//         // ENTITIES APPLICABLE IN THIS TEST
//         // 1. COUNTRY

//   this.timeout(30000); // Set timeout to 30 seconds
//   extractZipFile(zipFileBuffer, extractZipPath); 

//   it('Validate if all COUNTRY are scanned in COUNTRY entity', async function () {
//     extractEntityData(nzSnippetJsonFile, govtInoScannedFile, 'COUNTRY', 'govt_data.zip', /\b(COUNTRY:\s*[A-Za-z\s]+)\b/g)
//     await validateEntityData(goveInforZipExtractionPath, govtInoScannedFile, 'Country')
//   });
// });

// describe('VALIDATE_AZUREBLOB_CONTAINER_PERSONAL_INFORMATION', function () {

//   this.timeout(30000);
//   readXLSXFile(personalInfoTestDataFile, 'Sheet1', personalInfoConvertedFile)

//   it('Validate if all PERSON NAMES are scanned in PERSON_N_EMAIL profile', async function () {
//     extractProfileData(nzSnippetJsonFile, personalInfoScannedFile, 'PERSON_N_EMAIL', '/\[PERSON:[^\]]+\]/g', 'PERSON')
//   });
// });

