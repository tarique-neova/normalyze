import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyAgainstJson, validateData, validateProfiles, convertXlsxToCsv, extractZipFile } from './shubham_helper_copy.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, 'snippets_data.json');
const csvFilePath = path.join(__dirname, 'financial_information.csv');
const personalInfoFilePath = path.join(__dirname, 'personal_information.xlsx');
const govtInfoZipFIle = path.join(__dirname, 'govt_data.zip');
const goveInforZipExtractionPath = path.join(__dirname, 'govt_data.csv');
const zipFileBuffer = fs.readFileSync(govtInfoZipFIle);
const extractZipPath = path.join(__dirname, '');




const financialInfoProfileNames = [
  'CREDIT_CARD_N_PERSON',
  'PERSON_N_EMAIL',
  'PERSON_N_SSN',
  'BANK_ACCOUNT_N_PERSON'
];

const financialInfoEntity = [
  'CREDIT_CARD_NUMBER',
  'PERSON',
  'BANK_ACCOUNT_NUMBER'
];

const perosnalInfoProfileNames = [
  'PERSON_N_SSN',
  'PERSON_N_EMAIL',
  'PERSON_N_ADDRESS',
  'PERSON_N_PHONE_NUMBER'
];

describe('VALIDATE_AZUREBLOB_CONTAINER_FINANCIAL_INFORMATION_PROFILES_TEST', function () {
  this.timeout(30000); // Set timeout to 30 seconds

  // PROFILES APPLICABLE IN THIS TEST - 
  // 1. CREDIT_CARD_N_PERSON
  // 2. BANK_ACCOUNT_N_PERSON

  // ENTITIES APPLICABLE IN THIS TEST
  // 1. PERSON
  // 2. CREDIT_CARD_NUMBER
  // 3. US_BANK_NUMBER

  it('Validate if all profile Names are scanned from JSON file', async function () {
    await validateProfiles(jsonFilePath, financialInfoProfileNames);
  });

  it('Validate if all credit card numbers are scanned from CREDIT_CARD_N_PERSON profile', async function () {
    await validateData(jsonFilePath, csvFilePath, 'CREDIT_CARD_N_PERSON', ['Credit Card Number']);
  });

  it('Validate if all PERSON NAMES are scanned from CREDIT_CARD_N_PERSON profile', async function () {
    await validateData(jsonFilePath, csvFilePath, 'CREDIT_CARD_N_PERSON', ['Name']);
  });

  it('Validate if all PERSON NAMES are scanned from BANK_ACCOUNT_N_PERSON profile', async function () {
    await validateData(jsonFilePath, csvFilePath, 'BANK_ACCOUNT_N_PERSON', ['Name']);
  });

  it('Validate if all Bank Account Numbers are scanned from BANK_ACCOUNT_N_PERSON profile', async function () {
    await validateData(jsonFilePath, csvFilePath, 'BANK_ACCOUNT_N_PERSON', ['Bank Account Number']);
  });

  it('Validate if all Bank Account Numbers are scanned from CREDIT_CARD_NUMBER entity', async function () {
    verifyAgainstJson(csvFilePath, jsonFilePath, 'CREDIT_CARD_NUMBER');
  });

  it('Validate if all PERSON names are scanned from PERSON entity', async function () {
    verifyAgainstJson(csvFilePath, jsonFilePath, 'PERSON');
  });

  it('Validate if all Bank Account Numbers are scanned from PERSON entity', async function () {
    verifyAgainstJson(csvFilePath, jsonFilePath, 'BANK_ACCOUNT_NUMBER');
  });
});

describe('VALIDATE_AZUREBLOB_CONTAINER_PERSONAL_INFORMATION_PROFILES_TEST', function () {
  this.timeout(30000); // Set timeout to 30 seconds
  const outputPath = convertXlsxToCsv(personalInfoFilePath)
  it('Validate if all profile Names are scanned from JSON file', async function () {
    await validateProfiles(jsonFilePath, perosnalInfoProfileNames);
  });

  it('Validate if all SSN NUmbers are scanned from PERSON_N_SSN profile', async function () {
    await validateData(jsonFilePath, outputPath, 'PERSON_N_SSN', ['SSN Number']);
  });

  it('Validate if all PERSON Names are scanned from PERSON_N_SSN profile', async function () {
    await validateData(jsonFilePath, outputPath, 'PERSON_N_SSN', ['Name']);
  });

  it('Validate if all PERSON Names are scanned from PERSON_N_EMAIL profile', async function () {
    await validateData(jsonFilePath, outputPath, 'PERSON_N_EMAIL', ['Name']);
  });

  it('Validate if all Email Address are scanned from PERSON_N_EMAIL profile', async function () {
    await validateData(jsonFilePath, outputPath, 'PERSON_N_EMAIL', ['Email Address']);
  });

  it('Validate if all PERSON are scanned from PERSON entity', async function () {
    verifyAgainstJson(outputPath, jsonFilePath, 'PERSON');
  });

  it('Validate if all US_SSN are scanned from US_SSN entity', async function () {
    verifyAgainstJson(outputPath, jsonFilePath, 'US_SSN');
  });

  it('Validate if all EMAIL_ADDRESS are scanned from EMAIL_ADDRESS entity', async function () {
    verifyAgainstJson(outputPath, jsonFilePath, 'EMAIL_ADDRESS');
  });

  it('Validate if all COUNTRY are scanned from COUNTRY entity', async function () {
    verifyAgainstJson(outputPath, jsonFilePath, 'COUNTRY');
  });
});


describe('VALIDATE_AZUREBLOB_CONTAINER_GOVT_INFORMATION', function () {

        // ENTITIES APPLICABLE IN THIS TEST
        // 1. COUNTRY

  this.timeout(30000); // Set timeout to 30 seconds
  extractZipFile(zipFileBuffer, extractZipPath); 

  it('Validate if all COUNTRY are scanned in COUNTRY entity', async function () {
    try {
      await verifyAgainstJson(goveInforZipExtractionPath, jsonFilePath, 'COUNTRY');
    } catch (error) {
      console.error('Error validating against JSON:', error);
      throw error; // Fail the test if there's an error validating against JSON
    }
  });
});


