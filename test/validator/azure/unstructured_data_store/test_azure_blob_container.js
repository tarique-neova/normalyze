import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';
import { DeleteBlobContainer } from '../../../cleanup/azure/delete_blob_container.js';
import { validateEntityData, validateProfileData, validateProfiles, convertXlsxToCsv, extractZipFile } from '../../../common/helper.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'snippets_data.json');
const inputDataFile = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'financial_information.csv');
const personalInfoFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'personal_information.xlsx');
const govtInfoZipFIle = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'govt_data.zip');
const goveInforZipExtractionPath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'govt_data.csv');
const zipFileBuffer = fs.readFileSync(govtInfoZipFIle);
const extractZipPath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store');
const storageAccountDetails = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'blob_container_details.json');
const financialInfoProfileNames = [
  'CREDIT_CARD_N_PERSON',
  'BANK_ACCOUNT_N_PERSON'
];
const perosnalInfoProfileNames = [
  'PERSON_N_SSN',
  'PERSON_N_EMAIL',
  'PERSON_N_ADDRESS',
  'PERSON_N_PHONE_NUMBER'
];


/*
This test validates the profile data and entity data for Financial Information Test Data
actual data = input test data
expected data = json snippet data

 * @param {string} jsonFilePath
 * @param {number} financialInfoProfileNames
 * @param {number}  inputDataFile
*/
describe('VALIDATE_AZUREBLOB_CONTAINER_FINANCIAL_INFORMATION_PROFILES_TEST', function () {
  this.timeout(30000);

  /*
  PROFILES APPLICABLE IN THIS TEST - 
   1. CREDIT_CARD_N_PERSON
   2. BANK_ACCOUNT_N_PERSON

  ENTITIES APPLICABLE IN THIS TEST
  1. PERSON
  2. CREDIT_CARD_NUMBER
  3. US_BANK_NUMBER
  */

  it('Validate if all profile Names are scanned from JSON file', async function () {
    await validateProfiles(jsonFilePath, financialInfoProfileNames);
  });

  it('Validate if all credit card numbers are scanned from CREDIT_CARD_N_PERSON profile', async function () {
    await validateProfileData(jsonFilePath, inputDataFile, 'CREDIT_CARD_N_PERSON', ['Credit Card Number']);
  });

  it('Validate if all PERSON NAMES are scanned from CREDIT_CARD_N_PERSON profile', async function () {
    await validateProfileData(jsonFilePath, inputDataFile, 'CREDIT_CARD_N_PERSON', ['Name']);
  });

  it('Validate if all PERSON NAMES are scanned from BANK_ACCOUNT_N_PERSON profile', async function () {
    await validateProfileData(jsonFilePath, inputDataFile, 'BANK_ACCOUNT_N_PERSON', ['Name']);
  });

  it('Validate if all Bank Account Numbers are scanned from BANK_ACCOUNT_N_PERSON profile', async function () {
    await validateProfileData(jsonFilePath, inputDataFile, 'BANK_ACCOUNT_N_PERSON', ['Bank Account Number']);
  });

  it('Validate if all credit card numbers are scanned from CREDIT_CARD_NUMBER entity', async function () {
    await validateEntityData(inputDataFile, jsonFilePath, 'CREDIT_CARD_NUMBER');
  });

  it('Validate if all Bank Account Numbers are scanned from BANK_ACCOUNT_NUMBER entity', async function () {
    try {
      const result = await validateEntityData(inputDataFile, jsonFilePath, 'BANK_ACCOUNT_NUMBER');
      assert.strictEqual(result, true);
    } catch (error) {
      assert.strictEqual(error.message, `Entity 'BANK_ACCOUNT_NUMBER' does not exist in JSON data`);
    }
  });

  it('Validate if all PERSON names are scanned from PERSON entity', async function () {
    try {
      const result = await validateEntityData(inputDataFile, jsonFilePath, 'PERSON');
      assert.strictEqual(result, true);
    } catch (error) {
      assert.strictEqual(error.message, `Data missing for 'PERSON' entity in json snippet`);
    }

  });
});

/*
This test validates the profile data and entity data for Personal Information Test Data
actual data = input test data
expected data = json snippet data

 * @param {string} jsonFilePath
 * @param {number} perosnalInfoProfileNames
 * @param {number}  outputPath
*/

describe('VALIDATE_AZUREBLOB_CONTAINER_PERSONAL_INFORMATION_PROFILES_TEST', function () {
  this.timeout(30000);
  const outputPath = convertXlsxToCsv(personalInfoFilePath)


  it('Validate if all profile Names are scanned from JSON file', async function () {
    await validateProfiles(jsonFilePath, perosnalInfoProfileNames);
  });

  it('Validate if all SSN NUmbers are scanned from PERSON_N_SSN profile', async function () {
    await validateProfileData(jsonFilePath, outputPath, 'PERSON_N_SSN', ['SSN Number']);
  });

  it('Validate if all PERSON Names are scanned from PERSON_N_SSN profile', async function () {
    await validateProfileData(jsonFilePath, outputPath, 'PERSON_N_SSN', ['Name']);
  });

  it('Validate if all PERSON Names are scanned from PERSON_N_EMAIL profile', async function () {
    await validateProfileData(jsonFilePath, outputPath, 'PERSON_N_EMAIL', ['Name']);
  });

  it('Validate if all Email Address are scanned from PERSON_N_EMAIL profile', async function () {
    await validateProfileData(jsonFilePath, outputPath, 'PERSON_N_EMAIL', ['Email Address']);
  });

  it('Validate if all PERSON are scanned from PERSON entity', async function () {

    try {
      const result = await validateEntityData(outputPath, jsonFilePath, 'PERSON');
      assert.strictEqual(result, true);
    } catch (error) {
      assert.strictEqual(error.message, `Data mistmatch for 'PERSON' entity in json snippet`);
    }
  });

  it('Validate if all US_SSN are scanned from US_SSN entity', async function () {

    try {
      const result = await validateEntityData(outputPath, jsonFilePath, 'US_SSN');
      assert.strictEqual(result, true);
    } catch (error) {
      assert.strictEqual(error.message, `Data mistmatch for 'US_SSN' entity in json snippet`);
    }
  });

  it('Validate if all EMAIL_ADDRESS are scanned from EMAIL_ADDRESS entity', async function () {

    try {
      const result = await validateEntityData(outputPath, jsonFilePath, 'EMAIL_ADDRESS');
      assert.strictEqual(result, true);
    } catch (error) {
      assert.strictEqual(error.message, `Data mistmatch for 'EMAIL_ADDRESS' entity in json snippet`);
    }
  });
});

/*
This test validates the profile data and entity data for Government Information Test Data
actual data = input test data
expected data = json snippet data

 * @param {string} jsonFilePath
 * @param {number} goveInforZipExtractionPath
*/

describe('VALIDATE_AZUREBLOB_CONTAINER_GOVT_INFORMATION', function () {

  // ENTITIES APPLICABLE IN THIS TEST
  // 1. COUNTRY

  this.timeout(30000); // Set timeout to 30 seconds
  extractZipFile(zipFileBuffer, extractZipPath);

  it('Validate if all COUNTRY are scanned in COUNTRY entity', async function () {
    try {
      await validateEntityData(goveInforZipExtractionPath, jsonFilePath, 'COUNTRY');
    } catch (error) {
      console.error('Error validating against JSON:', error);
      throw error; // Fail the test if there's an error validating against JSON
    }
  });
});

/*
Once all tests are executed, this wil delete the storage container with blob container from respective azure account
*/

describe('DELETE STORAGE ACCOUNT', function () {
  this.timeout(80000);
  it('Delete storage account after execution is completed', async function () {
    const deleteBlobContainer = new DeleteBlobContainer(storageAccountDetails);
    await deleteBlobContainer.deleteStorageAccount();
  });
});
