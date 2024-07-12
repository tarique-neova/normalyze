import { verifyFields, convertXlsxToCsv, extractZipFile } from '../../../common/shubham_helper.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const personalInfoTestDataFile = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'personal_information.xlsx');
const personalInfoConvertedFile = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'personal_information.csv');
const nzSnippetJsonFile = path.join(__dirname, '..', '..', '..', '..', 'snippets_data.json');
const financialInfoTestData = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'financial_information.csv');
const goveInforZipExtractionPath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'govt_data.csv');
const govtInfoZipFIle = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'govt_data.zip');
const zipFileBuffer = fs.readFileSync(govtInfoZipFIle);
const extractZipPath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive',);


describe('VALIDATE_AZUREBLOB_CONTAINER_FINANCIAL_INFORMATION', function () {
  this.timeout(30000); // Set timeout to 30 seconds

  it('Validate if all credit card numbers are scanned from CREDIT_CARD_N_PERSON profile', async function () {
    await verifyFields(financialInfoTestData, nzSnippetJsonFile, 'CREDIT_CARD_NUMBER', 'Credit Card Number', ['CREDIT_CARD_N_PERSON'])
      .then(() => console.log('Validation successful'))
      .catch(error => console.error('Validation failed:', error.message));
  });


  it('Validate if all person names are scanned from CREDIT_CARD_N_PERSON profile', async function () {
    verifyFields(financialInfoTestData, nzSnippetJsonFile, 'PERSON', 'Name')
  });

  it('Validate if all person names are scanned from BANK_ACCOUNT_N_PERSON profile', async function () {
    await verifyFields(financialInfoTestData, nzSnippetJsonFile, 'Name', 'BANK_ACCOUNT_N_PERSON');

  });

  it('Validate if all bank account numbers are scanned from BANK_ACCOUNT_N_PERSON profile', async function () {
    await verifyFields(financialInfoTestData, nzSnippetJsonFile, 'Bank Account Number', 'BANK_ACCOUNT_N_PERSON');
  });

  it('Validate if all person names are scanned from PERSON entity', async function () {
    await verifyFields(financialInfoTestData, nzSnippetJsonFile, 'Name');
  });

  it('Validate if all credit card numbers are scanned from CREDIT_CARD_NUMBER entity', async function () {
    await verifyFields(financialInfoTestData, nzSnippetJsonFile, 'Credit Card Number');
  });

  it('Validate if all person names are scanned from US_BANK_NUMBER entity', async function () {
    await verifyFields(financialInfoTestData, nzSnippetJsonFile, 'Name');
  });
});

// describe('VALIDATE_AZUREBLOB_CONTAINER_GOVT_INFORMATION', function () {

//   // ENTITIES APPLICABLE IN THIS TEST
//   // 1. COUNTRY

//   extractZipFile(zipFileBuffer, extractZipPath);

//   it('Validate if all COUNTRY are scanned in COUNTRY entity', async function () {
//     await verifyFields(goveInforZipExtractionPath, nzSnippetJsonFile, 'COUNTRY', 'Country Name');
//   });
// });



// describe('VALIDATE_AZUREBLOB_CONTAINER_PERSONAL_INFORMATION', function () {
//   // PROFILES APPLICABLE IN THIS TEST - 
//   // 1. PERSON_N_SSN
//   // 2. PERSON_N_EMAIL
//   // 3. PERSON_N_ADDRESS
//   // 4. PERSON_N_PHONE_NUMBER

//   // ENTITIES APPLICABLE IN THIS TEST
//   // 1. EMAIL_ADDRESS
//   // 2. US_SSN
//   // 3. PHONE_NUMBER
//   // 4. US_ADDRESS
//   // 5. PERSON

//   this.timeout(30000);
//   const outputPath = convertXlsxToCsv(personalInfoTestDataFile)
//   it('Validate if all PERSON NAMES are scanned from PERSON_N_EMAIL profile', async function () {
//     await verifyFields(outputPath, nzSnippetJsonFile, 'PERSON', 'Name');
//   });

//   it('Validate if all EMAIL_ADDRESS are scanned from PERSON_N_EMAIL profile', async function () {
//     await verifyFields(outputPath, nzSnippetJsonFile, 'EMAIL_ADDRESS', 'Email Address');
//   });

//   it('Validate if all US_SSN are scanned from PERSON_N_SSN profile', async function () {
//     await verifyFields(outputPath, nzSnippetJsonFile, 'US_SSN', 'SSN Number');
//   });

//   it('Validate if all PHONE_NUMBER are scanned from PERSON_N_PHONE_NUMBER profile', async function () {
//     await verifyFields(outputPath, nzSnippetJsonFile, 'PHONE_NUMBER', 'Phone Number');
//   });

//   it('Validate if all PERSON NAMES are scanned from PERSON entity', async function () {
//     await verifyFields(outputPath, nzSnippetJsonFile, 'PERSON', 'Name');
//   });

//   it('Validate if all EMAIL_ADDRESS are scanned from EMAIL_ADDRESS entity', async function () {
//     await verifyFields(outputPath, nzSnippetJsonFile, 'EMAIL_ADDRESS', 'Email Address');
//   });

//   it('Validate if all US_SSN are scanned from US_SSN entity', async function () {
//     await verifyFields(outputPath, nzSnippetJsonFile, 'US_SSN', 'SSN Number');
//   });

//   it('Validate if all PHONE_NUMBER are scanned from PHONE_NUMBER entity', async function () {
//     await verifyFields(outputPath, nzSnippetJsonFile, 'PHONE_NUMBER', 'Phone Number');
//   });  
// });



