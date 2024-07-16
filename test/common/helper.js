/*
@author - Tarique Salat
This is common class which acts as a helper for test automation.
This has all the common methods which needs to be used in respective tests.
*/

import fs from 'fs';
import path from 'path';
import { ClientSecretCredential } from '@azure/identity';
import dotenv from 'dotenv';
import csvParser from 'csv-parser';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import assert from 'assert';
import JSZip from 'jszip';

await dotenv.config({ path: './.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates a random name with a given prefix and length
 * @param {string} prefix
 * @param {number} length
 * @returns {string}
 */
export function generateRandomName(prefix, length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = prefix;

  for (let i = 0; i < length - prefix.length; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomString;
}

/**
 * Authenticates with Azure using client secret credentials
 * @returns {ClientSecretCredential}
 */
export async function authenticateAzure() {
  try {
    const tenantId = process.env.AZURE_TENANT_ID;
    const clientId = process.env.AZURE_SERVICE_PRINCIPAL_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;
    const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);

    // Attempt to get a token to verify authentication
    await credentials.getToken("https://management.azure.com/.default");
    console.log("Azure Authentication Successful...");
    return credentials;
  } catch (error) {
    console.error("Azure Authentication Failed...:", error.message);
    throw error;
  }
}

/**
 * Reads a JSON file and returns its contents
 * @param {string} filePath
 * @returns {Promise<object>}
 */
const readJsonFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject('Error reading JSON file:', err);
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (parseErr) {
          reject('Error parsing JSON data:', parseErr);
        }
      }
    });
  });
};

/**
 * Extracts a zip file to a given directory
 * @param {Buffer} zipFileBuffer
 * @param {string} dir
 * @returns {Promise<void>}
 */
export async function extractZipFile(zipFileBuffer, dir) {
  try {
    const zip = new JSZip();
    const zipData = await zip.loadAsync(zipFileBuffer);

    await Promise.all(
      Object.entries(zipData.files).map(async ([fileName, file]) => {
        const filePath = path.join(dir, fileName);
        const fileDir = path.dirname(filePath);

        await fs.promises.mkdir(fileDir, { recursive: true });
        const fileBuffer = Buffer.from(await file.async('uint8array'));
        await fs.promises.writeFile(filePath, fileBuffer);
      })
    );

    console.log(`Files extracted to ${dir}`);
  } catch (err) {
    console.error(`Error extracting zip file: ${err}`);
  }
}

/**
 * Reads a Input CSV file and returns its contents
 * @param {string} filePath
 * @returns {Promise<object[]>}
 */
const readInputTestData = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject('Error reading CSV file:', err));
  });
};

/**
 * Converts an XLSX file to a CSV file
 * @param {string} inputFilePath
 * @returns {string} outputFilePath
 */
export function convertXlsxToCsv(inputFilePath) {
  try {
    const workbook = XLSX.readFile(inputFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const outputFilePath = `${path.dirname(inputFilePath)}/${path.basename(inputFilePath, path.extname(inputFilePath))}.csv`;
    fs.writeFileSync(outputFilePath, csv);
    return outputFilePath;
  } catch (error) {
    console.error(`Error converting XLSX to CSV: ${error.message}`);
    throw error;
  }
}

/**
 * Extracts profiles and entities from JSON data
 * @param {object} jsonData
 * @returns {object} An object containing profiles and entities
 */
const extractProfilesFromSnippet = (jsonData) => {
  // Ensure profileSnippet is an array
  jsonData.profileSnippet = Array.isArray(jsonData.profileSnippet) ? jsonData.profileSnippet : [jsonData.profileSnippet];

  const profiles = {
    CREDIT_CARD_N_PERSON: [],
    PERSON_N_EMAIL: [],
    PERSON_N_SSN: [],
    BANK_ACCOUNT_N_PERSON: []
  };

  jsonData.profileSnippet.forEach((profile) => {
    profile.profileList.forEach((profileItem) => {
      if (profiles[profileItem.profileName]) {
        profiles[profileItem.profileName].push(...profileItem.snippetList.map((snippet) => snippet.text));
      }
    });
  });

  const entities = {
    PERSON: [],
    EMAIL_ADDRESS: [],
    CREDIT_CARD_NUMBER: [],
    US_SSN: [],
    BANK_ACCOUNT_NUMBER: []
  };

  const extractEntities = (text, entity) => {
    const regex = new RegExp(`\\[${entity}:([^\\]]+)\\]`, 'g');
    let match;
    while ((match = regex.exec(text)) !== null) {
      entities[entity].push(match[1]);
    }
  };

  Object.keys(profiles).forEach((profileName) => {
    profiles[profileName].forEach((text) => {
      extractEntities(text, 'PERSON');
      extractEntities(text, 'EMAIL_ADDRESS');
      extractEntities(text, 'CREDIT_CARD_NUMBER');
      extractEntities(text, 'US_SSN');
      extractEntities(text, 'BANK_ACCOUNT_NUMBER');
    });
  });

  return { profiles, entities };
};

/**
 * Validates expected JSON and actual input test data
 * @param {string} jsonFilePath
 * @param {string} testDataFilePath
 * @param {string} expectedProfileName
 * @param {string[]} columnNames
 * @returns {Promise<void>}
 */
export async function validateProfileData(jsonFilePath, testDataFilePath, expectedProfileName, actualProfileNames) {
  try {
    const jsonData = await readJsonFile(jsonFilePath);
    const actualData = await readInputTestData(testDataFilePath);

    const { entities } = extractProfilesFromSnippet(jsonData);

    let failedAssertions = 0;

    actualProfileNames.forEach((actualProfileName) => {
      const profileData = actualData.map((row) => row[actualProfileName]);

      let entityType;
      switch (actualProfileName) {
        case 'Name':
          entityType = 'PERSON';
          break;
        case 'Credit Card Number':
          entityType = 'CREDIT_CARD_NUMBER';
          break;
        case 'Email Address':
          entityType = 'EMAIL_ADDRESS';
          break;
        case 'SSN Number':
          entityType = 'US_SSN';
          break;
        case 'Bank Account Number':
          entityType = 'BANK_ACCOUNT_NUMBER';
          break;
        case 'Country':
          entityType = 'COUNTRY';
          break;
        default:
          console.error(`Invalid column name: ${actualProfileName}`);
          return;
      }

      const missingData = profileData.filter((data) => !entities[entityType].includes(data));

      try {
        assert.strictEqual(missingData.length, 0, `Missing ${actualProfileName} entries in JSON output for profile ${expectedProfileName}: ${missingData.join(', ')}`);
      } catch (error) {
        console.error(error.message);
        failedAssertions++;
      }

      if (missingData.length === 0) {
        console.log(`All ${actualProfileName} entries from the actual test data are not present in the JSON output for profile ${expectedProfileName}.`);
      } else {
        console.log(`Missing ${actualProfileName} entries in JSON output for profile ${expectedProfileName}:`, missingData);
      }
    });

    if (failedAssertions > 0) {
      throw new Error(`Failed assertions: ${failedAssertions}`);
    }
  } catch (error) {
    console.error('Error during validation:', error);
    throw error;
  }
}

const expectedProfiles = [
  "CREDIT_CARD_N_PERSON",
  "PERSON_N_EMAIL",
  "PERSON_N_SSN",
  "BANK_ACCOUNT_N_PERSON"
];

/**
 * Extracts profile names from JSON data
 * @param {object} jsonData
 * @returns {string[]} An array of profile names
 */
const extractProfileNames = (jsonData) => {
  const profileNames = [];

  jsonData.profileSnippet.forEach((snippet) => {
    snippet.profileList.forEach((profile) => {
      profileNames.push(profile.profileName);
    });
  });

  return profileNames;
};

/**
 * Validates profiles in JSON data
 * @param {string} jsonFilePath
 * @param {string[]} expectedProfiles
 * @returns {Promise<void>}
 */
export const validateProfiles = async (jsonFilePath, expectedProfiles) => {
  try {
    const jsonData = await readJsonFile(jsonFilePath);
    const actualProfiles = extractProfileNames(jsonData);

    const missingProfiles = expectedProfiles.filter((profile) => !actualProfiles.includes(profile));

    try {
      assert.strictEqual(missingProfiles.length, 0, `Missing profiles in JSON data: ${missingProfiles.join(', ')}`);
    } catch (error) {
      console.error(error.message);
      throw error;
    }

    if (missingProfiles.length === 0) {
      console.log('All expected profiles are present in the JSON data:', expectedProfiles);
    } else {
      console.error('Missing profiles in JSON data:', missingProfiles);
    }
  } catch (error) {
    console.error('Error during profile validation:', error);
    throw error; // Rethrow the error to ensure the test fails
  }
};

/**
 * Reads a input file file and extracts a actual data
 * @param {string} filePath
 * @param {string} actualEntityName
 * @returns {Promise<string[]>}
 */
const readTestDataAndExtractActualEntity = async (filePath, actualEntityName) => {
  const columnValues = [];
  const absoluteFilePath = path.resolve(__dirname, filePath); // Resolve absolute path
  return new Promise((resolve, reject) => {
    fs.createReadStream(absoluteFilePath)
      .pipe(csv())
      .on('data', (row) => {
        if (actualEntityName in row) {
          columnValues.push(row[actualEntityName]);
        }
      })
      .on('end', () => {
        resolve(columnValues);
      })
      .on('error', (err) => {
        reject(`Error reading test data file: ${err.message}`);
      });
  });
};

/**
 * Extracts and displays entities from JSON data
 * @param {object} data
 * @returns {object}
 */
const extractEntitiesFromSnippet = (data) => {
  const extractedEntities = {
    PERSON: [],
    EMAIL_ADDRESS: [],
    CREDIT_CARD_NUMBER: [],
    US_SSN: [],
    BANK_ACCOUNT_NUMBER: [],
    COUNTRY: []
  };

  data.entitySnippet.forEach((snippet) => {
    snippet.entityList.forEach((entity) => {
      entity.snippetList.forEach((snippetItem) => {
        let matchResult;
        switch (entity.entityName) {
          case "PERSON":
            matchResult = snippetItem.text.match(/\[PERSON:(.*?)\]/);
            if (matchResult && matchResult[1]) {
              extractedEntities.PERSON.push(matchResult[1]);
            }
            break;
          case "EMAIL_ADDRESS":
            matchResult = snippetItem.text.match(/\[EMAIL_ADDRESS:(.*?)\]/);
            if (matchResult && matchResult[1]) {
              extractedEntities.EMAIL_ADDRESS.push(matchResult[1]);
            }
            break;
          case "CREDIT_CARD_NUMBER":
            matchResult = snippetItem.text.match(/\[CREDIT_CARD_NUMBER:(.*?)\]/);
            if (matchResult && matchResult[1]) {
              extractedEntities.CREDIT_CARD_NUMBER.push(matchResult[1]);
            }
            break;
          case "US_SSN":
            matchResult = snippetItem.text.match(/\[US_SSN:(.*?)\]/);
            if (matchResult && matchResult[1]) {
              extractedEntities.US_SSN.push(matchResult[1]);
            }
            break;
          case "COUNTRY":
            matchResult = snippetItem.text.match(/\[COUNTRY:(.*?)\]/);
            if (matchResult && matchResult[1]) {
              extractedEntities.COUNTRY.push(matchResult[1]);
            }
            break;
          case "BANK_ACCOUNT_NUMBER":
            matchResult = snippetItem.text.match(/\[BANK_ACCOUNT_NUMBER:(.*?)\]/);
            if (matchResult && matchResult[1]) {
              extractedEntities.BANK_ACCOUNT_NUMBER.push(matchResult[1]);
            }
            break;
          default:
            break;
        }
      });
    });
  });

  return extractedEntities;
};

const readJsonFileForEntities = async (filePath) => {
  try {
    const jsonData = await readJsonFile(filePath);
    const extractedEntities = extractEntitiesFromSnippet(jsonData);
    return extractedEntities;
  } catch (error) {
    throw new Error(`Error reading JSON file for entities: ${error.message}`);
  }
};

/**
 * Validates entity data against CSV data
 * @param {string} testDataFilePath
 * @param {string} jsonFilePath
 * @param {string} entityName
 * @returns {Promise<boolean>}
 */
export const validateEntityData = async (testDataFilePath, jsonFilePath, entityName) => {
  try {
    const entities = await readJsonFileForEntities(jsonFilePath);
    const entityValues = entities[entityName];

    if (!entityValues) {
      throw new Error(`Entity '${entityName}' does not exist in JSON data`);
    }

    const actualEntity = mapActualAndExpectedEntities(entityName);
    if (!actualEntity) {
      throw new Error(`Actual Entity not defined for entity '${entityName}`);
    }

    const inputData = await readTestDataAndExtractActualEntity(testDataFilePath, actualEntity);

    const missingValues = entityValues.filter(value => !inputData.includes(value));
    const extraValues = inputData.filter(value => !entityValues.includes(value));

    if (missingValues.length > 0 || extraValues.length > 0) {
      const errorMessage = `Verification failed for ${entityName}: Missing values - ${extraValues.join(', ')}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    console.log(`All ${entityName} values verified successfully against JSON snippet entities.`);

    return true;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

/**
 * Determines input test data based on entity type
 * @param {string} entityName
 * @returns {string|null}
 */
const mapActualAndExpectedEntities = (entityName) => {
  switch (entityName) {
    case "PERSON":
      return "Name";
    case "CREDIT_CARD_NUMBER":
      return "Credit Card Number";
    case "BANK_ACCOUNT_NUMBER":
      return "Bank Account Number";
    case "EMAIL_ADDRESS":
      return "Email Address";
    case "US_SSN":
      return "SSN Number";
    case "COUNTRY":
      return "Country Name";
    default:
      return null;
  }
};
