import fs from 'fs';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import path from 'path';
import JSZip from 'jszip';

export async function verifyFields(csvPath, fileName, jsonFieldToCompare, jsonFieldToCompareWith, profilesToScan = []) {
  try {
    console.log(fileName);

    const combinedEntities = await readJsonFile(fileName, profilesToScan);
    console.log("Combined entities after reading JSON:", combinedEntities);

    await validateFields(csvPath, combinedEntities.profileEntities, combinedEntities.entityEntities, jsonFieldToCompare, jsonFieldToCompareWith, profilesToScan);
  } catch (error) {
    console.error('Error in test:', error);
    throw error; // Ensure Mocha detects and handles the error
  }
}

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

function readJsonFile(fileName, profilesToScan = []) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, jsonString) => {
      if (err) {
        console.error('Error reading file:', err);
        reject(err);
        return;
      }

      try {
        const dataArray = JSON.parse(jsonString);
        // Convert to array if not already an array
        const checkDataArray = Array.isArray(dataArray) ? dataArray : [dataArray];

        let profileSnippets = [];
        let entitySnippets = [];

        checkDataArray.forEach(data => {
          if (data.profileSnippet && Array.isArray(data.profileSnippet)) {
            profileSnippets = profileSnippets.concat(data.profileSnippet);
          } else {
            throw new Error('profileSnippet is missing or not an array in one of the JSON objects');
          }

          if (data.entitySnippet && Array.isArray(data.entitySnippet)) {
            entitySnippets = entitySnippets.concat(data.entitySnippet);
          } else {
            throw new Error('entitySnippet is missing or not an array in one of the JSON objects');
          }
        });

        const profileEntities = extractEntitiesFromProfiles(profileSnippets, profilesToScan);
        const entityEntities = extractEntitiesFromEntities(entitySnippets);

        resolve({ profileEntities, entityEntities });
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        reject(parseError);
      }
    });
  });
}

function extractEntitiesFromProfiles(profileSnippets, profilesToScan = []) {
  let profileEntities = {};

  profilesToScan.forEach(profileName => {
    profileEntities[profileName] = {
      CREDIT_CARD_N_PERSON: [],
      PERSON_N_EMAIL: [],
      PERSON_N_SSN: []
    };
  });

  profileSnippets.forEach(profile => {
    const profileName = profile.profileName;
    if (profilesToScan.includes(profileName)) {
      const snippetList = profile.snippetList;

      if (snippetList && Array.isArray(snippetList)) {
        snippetList.forEach(snippetItem => {
          const text = snippetItem.text;
          const matches = text.match(/\[(PERSON):[^\]]+\]/g);
          if (matches) {
            matches.forEach(match => {
              const [type, value] = match.slice(1, -1).split(':');
              if (!profileEntities[profileName][type].includes(value)) {
                profileEntities[profileName][type].push(value);
              }
            });
          }
        });
      } else {
        console.error('snippetList is missing or not an array in one of the profile objects:', profile);
        throw new Error('snippetList is missing or not an array in one of the profile objects');
      }
    }
  });

  return profileEntities;
}

function extractEntitiesFromEntities(entitySnippets) {
  let entityEntities = {
    COUNTRY: [],
    PERSON: [],
    CREDIT_CARD_NUMBER: [],
    US_SSN: [],
    EMAIL_ADDRESS: [],
    US_BANK_NUMBER: []
  };

  entitySnippets.forEach(entity => {
    const snippetList = entity.snippetList;

    if (snippetList && Array.isArray(snippetList)) {
      snippetList.forEach(snippetItem => {
        const text = snippetItem.text;
        const matches = text.match(/\[(US_BANK_NUMBER|CREDIT_CARD_NUMBER):[^\]]+\]/g);
        if (matches) {
          matches.forEach(match => {
            const [type, value] = match.slice(1, -1).split(':');
            if (!entityEntities[type].includes(value)) {
              entityEntities[type].push(value);
            }
          });
        }
      });
    } else {
      console.error('snippetList is missing or not an array in one of the entity objects:', entity);
      // Skip this entity instead of throwing an error
      return;
    }
  });

  return entityEntities;
}

async function validateFields(csvPath, profileEntities, entityEntities, jsonFieldToCompare, jsonFieldToCompareWith, profilesToScan = []) {
  try {
    const csvFilePath = csvPath;
    const personColumnData = [];

    const csvStream = fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const value = row[jsonFieldToCompareWith];
        if (value) {
          personColumnData.push(value);
        }
      });

    await new Promise((resolve, reject) => {
      csvStream.on('end', () => {
        console.log('CSV file successfully processed.');

        if (jsonFieldToCompare.startsWith('PROFILE_')) {
          const profileName = jsonFieldToCompare.replace('PROFILE_', '');
          if (profilesToScan.includes(profileName)) {
            if (!profileEntities || !profileEntities[profileName] || !profileEntities[profileName][jsonFieldToCompareWith]) {
              console.error(`No entities found for ${jsonFieldToCompare}`);
              reject(`No entities found for ${jsonFieldToCompare}`);
            } else {
              const verificationResults = verifyValues(profileEntities[profileName][jsonFieldToCompareWith], personColumnData);
              const failedResults = verificationResults.filter(result => !result.isPresent);

              if (failedResults.length > 0) {
                console.error(`${failedResults.length} entities not found in the snippets file:`, failedResults.map(r => r.value));
                reject(`${failedResults.length} entities not found in the snippets file`);
              } else {
                resolve();
              }
            }
          } else {
            console.error(`Profile ${profileName} not found in the list of profiles to scan`);
            reject(`Profile ${profileName} not found in the list of profiles to scan`);
          }
        } else {
          if (!entityEntities || !entityEntities[jsonFieldToCompare]) {
            console.error(`No entities found for ${jsonFieldToCompare}`);
            reject(`No entities found for ${jsonFieldToCompare}`);
          } else {
            const verificationResults = verifyValues(entityEntities[jsonFieldToCompare], personColumnData);
            const failedResults = verificationResults.filter(result => !result.isPresent);

            if (failedResults.length > 0) {
              console.error(`${failedResults.length} entities not found in the snippets file:`, failedResults.map(r => r.value));
              reject(`${failedResults.length} entities not found in the snippets file`);
            } else {
              resolve();
            }
          }
        }
      });
    });
  } catch (error) {
    console.error('Error processing CSV file:', error);
    throw error;
  }
}

function verifyValues(columnData, valuesToCheck) {
  return valuesToCheck.map(value => ({
    value,
    isPresent: columnData.includes(value)
  }));
}
