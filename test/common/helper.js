import fs from 'fs';
import path from 'path';
import { ClientSecretCredential } from '@azure/identity';
import dotenv from 'dotenv';
import csv from 'csv-parser';

await dotenv.config({ path: './.env' });

function generateRandomName(prefix, length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = prefix;
    for (let i = 0; i < length - prefix.length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}

async function authenticateAzure() {
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


function extractData(jsonFilePath, outputFilePath, profileName, regexPattern, matchGroup) {
    try {
        const fileContents = fs.readFileSync(jsonFilePath, 'utf8');
        let jsonData = JSON.parse(fileContents);

        // Convert jsonData to array if it's not already an array
        if (!Array.isArray(jsonData)) {
            jsonData = [jsonData];
        }

        let extractedData = [];
        jsonData.forEach(data => {
            data.profileSnippet.forEach(snippet => {
                snippet.profileList.forEach(profile => {
                    if (profile.profileName === profileName) {
                        profile.snippetList.forEach(snippet => {
                            const matches = snippet.text.match(regexPattern);
                            if (matches) {
                                extractedData.push(...matches);
                            }
                        });
                    }
                });
            });
        });

        // Save extracted data to text file
        const outputText = extractedData.join('\n');
        fs.writeFileSync(outputFilePath, outputText);
        console.log(`${matchGroup} profiles have been saved!`);
    } catch (error) {
        console.error(`Error extracting ${matchGroup} data: ${error.message}`);
    }
}

function readCSVFile(filePath, columnName) {
    return new Promise((resolve, reject) => {
        try {
            const expectedData = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    if (row[columnName]) {
                        expectedData.push(row[columnName]);
                    }
                })
                .on('end', () => {
                    resolve(expectedData);
                })
                .on('error', (error) => {
                    reject(error);
                });
        } catch (error) {
            reject(`Error reading CSV file: ${error.message}`);
        }
    });
}

function readTextFile(filePath) {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return fileContents.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
        console.error(`Error reading text file: ${error.message}`);
        return [];
    }
}

async function validateData(csvFilePath, txtFilePath, columnName, matchGroup) {
    try {
        const csvData = await readCSVFile(csvFilePath, columnName);
        const txtData = readTextFile(txtFilePath);

        // Validate if all CSV data are present in the text file
        const missingData = csvData.filter(item => !txtData.includes(`[${matchGroup}:${item}]`));

        if (missingData.length === 0) {
            console.log(`All ${matchGroup.toLowerCase()} data from the input CSV are scanned under the respective profile.`);
        } else {
            console.log(`Missing ${matchGroup.toLowerCase()} data from the text file:`);
            console.log(missingData.join('\n'));
        }
    } catch (error) {
        console.error(`Error validating ${matchGroup} data: ${error.message}`);
    }
}


export {
    generateRandomName,
    authenticateAzure,
    extractData,
    validateData,
};
