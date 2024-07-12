import fs from 'fs';
import path from 'path';
import { ClientSecretCredential } from '@azure/identity';
import dotenv from 'dotenv';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import assert from 'assert';
import JSZip from 'jszip';

await dotenv.config({ path: './.env' });


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateRandomName(prefix, length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = prefix;
  for (let i = 0; i < length - prefix.length; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

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


// Function to read JSON file
const readJsonFileForProfiles = (filePath) => {
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


// Function to read CSV file
const readCsvFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject('Error reading CSV file:', err));
  });
};

export function convertXlsxToCsv(inputFilePath) {
  const workbook = XLSX.readFile(inputFilePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const outputFilePath = path.format({
    dir: path.dirname(inputFilePath),
    name: path.basename(inputFilePath, path.extname(inputFilePath)),
    ext: '.csv'
  });
  fs.writeFileSync(outputFilePath, csv);
  return outputFilePath;
}

// Function to extract profiles and entities from JSON
const extractProfilesAndEntities = (jsonData) => {
  // Ensure profileSnippet is an array
  if (!Array.isArray(jsonData.profileSnippet)) {
    jsonData.profileSnippet = [jsonData.profileSnippet];
  }

  const profiles = {
    "CREDIT_CARD_N_PERSON": [],
    "PERSON_N_EMAIL": [],
    "PERSON_N_SSN": [],
    "BANK_ACCOUNT_N_PERSON": []
  };

  jsonData.profileSnippet.forEach(profile => {
    profile.profileList.forEach(profileItem => {
      if (profiles[profileItem.profileName]) {
        profiles[profileItem.profileName].push(...profileItem.snippetList.map(snippet => snippet.text));
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

  Object.keys(profiles).forEach(profileName => {
    profiles[profileName].forEach(text => {
      extractEntities(text, 'PERSON');
      extractEntities(text, 'EMAIL_ADDRESS');
      extractEntities(text, 'CREDIT_CARD_NUMBER');
      extractEntities(text, 'US_SSN');
      extractEntities(text, 'BANK_ACCOUNT_NUMBER');
    });
  });

  return { profiles, entities };
};


// Main function to validate JSON and CSV data
// Main function to validate JSON and CSV data
export async function validateData(jsonFilePath, csvFilePath, profileName, columnNames) {
  try {
    const jsonData = await readJsonFileForProfiles(jsonFilePath);
    const csvData = await readCsvFile(csvFilePath);

    const { entities } = extractProfilesAndEntities(jsonData);

    let failedAssertions = 0;

    columnNames.forEach((columnName) => {
      const csvColumnData = csvData.map(row => row[columnName]);

      const entityType = columnName === 'Name' ? 'PERSON' :
        columnName === 'Credit Card Number' ? 'CREDIT_CARD_NUMBER' :
          columnName === 'Email Address' ? 'EMAIL_ADDRESS' :
            columnName === 'SSN Number' ? 'US_SSN' :
              columnName === 'Bank Account Number' ? 'BANK_ACCOUNT_NUMBER' :
                columnName === 'Country' ? 'COUNTRY' :
                  columnName === 'Email Address' ? 'EMAIL_ADDRESS' :
                    columnName === 'SSN Number' ? 'US_SSN' :
                      null;

      if (entityType) {
        const missingData = csvColumnData.filter(data => !entities[entityType].includes(data));

        try {
          assert.strictEqual(missingData.length, 0, `Missing ${columnName} entries in JSON output for profile ${profileName}: ${missingData.join(', ')}`);
        } catch (error) {
          console.error(error.message);
          failedAssertions++;
        }

        if (missingData.length === 0) {
          console.log(`All ${columnName} entries from the CSV are present in the JSON output for profile ${profileName}.`);
        } else {
          console.log(`Missing ${columnName} entries in JSON output for profile ${profileName}:`, missingData);
        }
      } else {
        console.error(`Invalid column name: ${columnName}`);
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

const extractProfileNames = (jsonData) => {
  const profileNames = [];

  jsonData.profileSnippet.forEach(snippet => {
    snippet.profileList.forEach(profile => {
      profileNames.push(profile.profileName);
    });
  });

  return profileNames;
};

export const validateProfiles = async (jsonFilePath, expectedProfiles) => {
  try {
    const jsonData = await readJsonFileForProfiles(jsonFilePath);
    const actualProfiles = extractProfileNames(jsonData);

    const missingProfiles = expectedProfiles.filter(profile => !actualProfiles.includes(profile));

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


// Function to read CSV and extract column data
const readCsvAndExtractColumn = async (filePath, columnName) => {
  const columnValues = [];
  const absoluteFilePath = path.resolve(__dirname, filePath); // Resolve absolute path
  return new Promise((resolve, reject) => {
    fs.createReadStream(absoluteFilePath)
      .pipe(csv())
      .on('data', (row) => {
        if (columnName in row) {
          columnValues.push(row[columnName]);
        }
      })
      .on('end', () => {
        resolve(columnValues);
      })
      .on('error', (err) => {
        reject(`Error reading CSV file: ${err.message}`);
      });
  });
};

// Function to extract and display entities from JSON
const extractAndDisplayEntities = (data) => {
  const extractedEntities = {
    PERSON: [],
    EMAIL_ADDRESS: [],
    CREDIT_CARD_NUMBER: [],
    US_SSN: [],
    BANK_ACCOUNT_NUMBER: [],
    COUNTRY: []
  };

  data.entitySnippet.forEach(snippet => {
    snippet.entityList.forEach(entity => {
      entity.snippetList.forEach(snippetItem => {
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
    const jsonData = await readJsonFileForProfiles(filePath);
    const extractedEntities = extractAndDisplayEntities(jsonData);
    return extractedEntities;
  } catch (error) {
    throw new Error(`Error reading JSON file for entities: ${error.message}`);
  }
};

// Main function to compare and log mismatches

export const verifyAgainstJson = async (csvFilePath, jsonFilePath, entityName) => {
  try {
    const entities = await readJsonFileForEntities(jsonFilePath); // Read JSON file and extract entities
    const entityValues = entities[entityName]; // Extract specific entity values

    if (!entityValues) {
      throw new Error(`Entity '${entityName}' does not exist in snippet`); // Throw error if entity is not found
    }

    // Determine CSV column name based on entity type
    const csvColumnName = entityName === 'PERSON'? 'Name' :
      entityName === 'CREDIT_CARD_NUMBER'? 'Credit Card Number' :
        entityName === 'BANK_ACCOUNT_NUMBER'? 'Bank Account Number' :
          entityName === 'EMAIL_ADDRESS'? 'Email Address' :
            entityName === 'US_SSN'? 'SSN Number' :
              entityName === 'COUNTRY'? 'Country Name' : '';

    if (!csvColumnName) {
      throw new Error(`CSV column name not defined for entity ${entityName}`);
    }

    const csvData = await readCsvAndExtractColumn(csvFilePath, csvColumnName); // Read CSV and extract column values

    // Compare CSV data against JSON entity values
    let mismatches;
    if (entityValues.length === 0) {
      mismatches = csvData;
    } else {
      mismatches = csvData.filter(csvValue =>!entityValues.includes(csvValue));
    }

    try {
      assert.strictEqual(mismatches.length, 0, `Verification failed for ${entityName}: ${mismatches.join(', ')}`);
    } catch (error) {
      console.error(error.message);
      throw error;
    }

    // Output verification result (optional)
    console.log(`All ${entityName} values verified successfully against JSON entities.`);

    return true; // Return true to indicate successful verification
  } catch (error) {
    console.error('Error:', error.message);
    return false; // Return false to indicate failure
  }
};