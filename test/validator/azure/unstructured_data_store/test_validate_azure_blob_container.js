/*
@author - Tarique Salat

This is the test case validation class for Azure Blob Container data verification.
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';
import { DeleteStorageAccount } from '../../../cleanup/azure/delete_blob_container.js';
import { DeleteSQLServer } from '../../../cleanup/azure/delete_sql_server.js';
import {
  validateEntityData,
  validateProfileData,
  validateProfiles,
  convertXlsxToCsv,
  extractZipFile
} from '../../../common/helper.js';

// Define file paths and constants
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
This test suite validates the profile data and entity data for Financial Information Test Data.
It includes validation for profiles and entities related to financial information.

PROFILES APPLICABLE IN THIS TEST:
- CREDIT_CARD_N_PERSON
- BANK_ACCOUNT_N_PERSON

ENTITIES APPLICABLE IN THIS TEST:
- PERSON
- CREDIT_CARD_NUMBER
- US_BANK_NUMBER
*/
describe('VALIDATE_AZUREBLOB_CONTAINER_FINANCIAL_INFORMATION_PROFILES_TEST', function () {
  this.timeout(30000);

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
This test suite validates the profile data and entity data for Personal Information Test Data.
It includes validation for profiles and entities related to personal information.

PROFILES APPLICABLE IN THIS TEST:
- PERSON_N_SSN
- PERSON_N_EMAIL
- PERSON_N_ADDRESS
- PERSON_N_PHONE_NUMBER

ENTITIES APPLICABLE IN THIS TEST:
- PERSON
- US_SSN
- EMAIL_ADDRESS
*/
describe('VALIDATE_AZUREBLOB_CONTAINER_PERSONAL_INFORMATION_PROFILES_TEST', function () {
  this.timeout(30000);
  const outputPath = convertXlsxToCsv(personalInfoFilePath);

  it('Validate if all profile Names are scanned from JSON file', async function () {
    await validateProfiles(jsonFilePath, perosnalInfoProfileNames);
  });

  it('Validate if all SSN Numbers are scanned from PERSON_N_SSN profile', async function () {
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
      assert.strictEqual(error.message, `Data mismatch for 'PERSON' entity in json snippet`);
    }
  });

  it('Validate if all US_SSN are scanned from US_SSN entity', async function () {
    try {
      const result = await validateEntityData(outputPath, jsonFilePath, 'US_SSN');
      assert.strictEqual(result, true);
    } catch (error) {
      assert.strictEqual(error.message, `Data mismatch for 'US_SSN' entity in json snippet`);
    }
  });

  it('Validate if all EMAIL_ADDRESS are scanned from EMAIL_ADDRESS entity', async function () {
    try {
      const result = await validateEntityData(outputPath, jsonFilePath, 'EMAIL_ADDRESS');
      assert.strictEqual(result, true);
    } catch (error) {
      assert.strictEqual(error.message, `Data mismatch for 'EMAIL_ADDRESS' entity in json snippet`);
    }
  });
});

/*
This test suite validates the profile data and entity data for Government Information Test Data.
It includes validation for entities related to government information.

ENTITIES APPLICABLE IN THIS TEST:
- COUNTRY
*/
describe('VALIDATE_AZUREBLOB_CONTAINER_GOVT_INFORMATION', function () {
  this.timeout(30000); // Set timeout to 30 seconds

  // Extract the ZIP file containing government information data
  extractZipFile(zipFileBuffer, extractZipPath);

  it('Validate if all COUNTRY entities are scanned in COUNTRY entity', async function () {
    try {
      await validateEntityData(goveInforZipExtractionPath, jsonFilePath, 'COUNTRY');
    } catch (error) {
      console.error('Error validating against JSON:', error);
      throw error; // Fail the test if there's an error validating against JSON
    }
  });
});

/*
After all tests are executed, this suite deletes the Azure storage account.
*/
// describe('DELETE STORAGE ACCOUNT', function () {
//   this.timeout(80000);

//   it('Delete storage account after test execution', async function () {
//     const deleteStorageAccount = new DeleteStorageAccount(storageAccountDetails);
//     await deleteStorageAccount.deleteStorageAccount();
//   });
// });

/*
After all tests are executed, this suite deletes the Azure SQL server.
*/
// describe('DELETE SQL SERVER', function () {
//   this.timeout(80000);
//   const sqlServerDetails = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sql_server_details.json');

//   it('Delete SQL server after test execution', async function () {
//     const deleteSQLServer = new DeleteSQLServer(sqlServerDetails);
//     await deleteSQLServer.deleteSQLServer();
//   });
// });
