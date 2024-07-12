// import fs from 'fs';
// import path from 'path';
// import { ClientSecretCredential } from '@azure/identity';
// import dotenv from 'dotenv';
// import JSZip from 'jszip';
// import csv from 'csv-parser';
// import { parse } from 'json2csv';
// import ExcelJS from 'exceljs';

// await dotenv.config({ path: './.env' });

// function generateRandomName(prefix, length) {
//     const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
//     let randomString = prefix;
//     for (let i = 0; i < length - prefix.length; i++) {
//         randomString += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return randomString;
// }

// async function authenticateAzure() {
//     try {
//         const tenantId = process.env.AZURE_TENANT_ID;
//         const clientId = process.env.AZURE_SERVICE_PRINCIPAL_ID;
//         const clientSecret = process.env.AZURE_CLIENT_SECRET;
//         const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);

//         // Attempt to get a token to verify authentication
//         await credentials.getToken("https://management.azure.com/.default");
//         console.log("Azure Authentication Successful...");
//         return credentials;
//     } catch (error) {
//         console.error("Azure Authentication Failed...:", error.message);
//         throw error;
//     }
// }

// async function extractZipFile(zipFileBuffer, dir) {
//     try {
//         const zip = new JSZip();
//         const zipData = await zip.loadAsync(zipFileBuffer);
//         await Promise.all(
//             Object.entries(zipData.files).map(async ([fileName, file]) => {
//                 const filePath = path.join(dir, fileName);
//                 const fileDir = path.dirname(filePath);
//                 await fs.promises.mkdir(fileDir, { recursive: true });
//                 const fileBuffer = Buffer.from(await file.async('uint8array'));
//                 await fs.promises.writeFile(filePath, fileBuffer);
//             })
//         );
//         console.log(`Files extracted to ${dir}`);
//     } catch (err) {
//         console.error(`Error extracting zip file: ${err}`);
//     }
// }

// function writeCSVFile(filePath, data) {
//     return new Promise((resolve, reject) => {
//         try {
//             // Ensure data is an array of objects with fields 'First Name' and 'Last Name'
//             const fields = ['Full Name']; // Specify the required field
//             const opts = { fields };
//             const csv = parse(data, opts);
//             fs.writeFile(filePath, csv, (err) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });
//         } catch (err) {
//             reject(err);
//         }
//     });
// }

// function readXLSXFile(filePath, sheetName, xlsxOutputpath) {
//     try {
//         const workbook = new ExcelJS.Workbook();
//         workbook.xlsx.readFile(filePath)
//            .then(() => {
//                 const worksheet = workbook.getWorksheet(sheetName);
//                 if (!worksheet) {
//                     throw new Error(`Sheet '${sheetName}' not found in the workbook`);
//                 }

//                 const csvData = [];
//                 worksheet.eachRow((row, rowNumber) => {
//                     const rowData = [];
//                     row.eachCell((cell, colNumber) => {
//                         rowData.push(cell.text); // Use cell.text instead of cell.value
//                     });
//                     csvData.push(rowData.join(','));
//                 });
//                 const csvText = csvData.join('\n');
//                 fs.writeFileSync(xlsxOutputpath, csvText);
//             })
//            .catch((error) => {
//                 console.error(`Error reading XLSX file: ${error.message}`);
//             });
//     } catch (error) {
//         console.error(`Error reading XLSX file: ${error.message}`);
//     }
// }

// function readCSVFile(filePath, columnName) {
//     return new Promise((resolve, reject) => {
//         const expectedData = [];
//         fs.createReadStream(filePath)
//             .pipe(csv())
//             .on('data', (row) => {
//                 if (row[columnName]) {
//                     expectedData.push(row[columnName]);
//                 }
//             })
//             .on('end', () => {
//                 resolve(expectedData);
//             })
//             .on('error', (error) => {
//                 reject(error);
//             });
//     });
// }

// // Function to read and parse a text file
// function readTextFile(filePath) {
//     try {
//         return fs.readFileSync(filePath, 'utf8');
//     } catch (error) {
//         console.error(`Error reading text file: ${error.message}`);
//         throw error;  // Throw the error to ensure the test fails
//     }
// }

// // Function to extract data based on the given profile name and regex pattern
// // function extractProfileData(jsonFilePath, outputFilePath, profileName, regexPattern, matchGroup) {
// //     try {
// //         const fileContents = fs.readFileSync(jsonFilePath, 'utf8');
// //         let jsonData = JSON.parse(fileContents);

// //         // Convert jsonData to array if it's not already an array
// //         if (!Array.isArray(jsonData)) {
// //             jsonData = [jsonData];
// //         }

// //         let extractedData = new Set();
// //         jsonData.forEach(data => {
// //             data.profileSnippet.forEach(snippet => {
// //                 snippet.profileList.forEach(profile => {
// //                     if (profile.profileName === profileName) {
// //                         profile.snippetList.forEach(snippet => {
// //                             const matches = snippet.text.match(regexPattern);
// //                             if (matches) {
// //                                 matches.forEach(match => extractedData.add(match));
// //                             }
// //                         });
// //                     }
// //                 });
// //             });
// //         });

// //         // Save extracted data to text file
// //         const outputText = Array.from(extractedData).join('\n');
// //         fs.writeFileSync(outputFilePath, outputText);
// //         console.log(`${matchGroup} profiles have been saved!`);
// //     } catch (error) {
// //         console.error(`Error extracting ${matchGroup} data: ${error.message}`);
// //     }
// // }

// function extractProfileData(jsonFilePath, outputFilePath, profileName, regexPattern, matchGroup) {
//     try {
//         const fileContents = fs.readFileSync(jsonFilePath, 'utf8');
//         let jsonData = JSON.parse(fileContents);

//         // Convert jsonData to array if it's not already an array
//         if (!Array.isArray(jsonData)) {
//             jsonData = [jsonData];
//         }

//         let extractedData = [];
//         jsonData.forEach(data => {
//             data.profileSnippet.forEach(snippet => {
//                 snippet.profileList.forEach(profile => {
//                     if (profile.profileName === profileName) {
//                         profile.snippetList.forEach(snippet => {
//                             const matches = snippet.text.match(regexPattern);
//                             if (matches) {
//                                 matches.forEach(match => extractedData.push(match));
//                             }
//                         });
//                     }
//                 });
//             });
//         });

//         // Save extracted data to text file
//         const outputText = extractedData.join('\n');
//         fs.writeFileSync(outputFilePath, outputText);
//         console.log(`${matchGroup} profiles have been saved!`);
//     } catch (error) {
//         console.error(`Error extracting ${matchGroup} data: ${error.message}`);
//     }
// }



// function extractEntityData(jsonFilePath, outputFilePath, entityName, objectName, regexPattern) {
//     try {
//         const fileContents = fs.readFileSync(jsonFilePath, 'utf8');
//         const jsonData = JSON.parse(fileContents);

//         const extractedData = new Set();

//         jsonData.forEach(item => {
//             if (item.entitySnippet) {
//                 item.entitySnippet.forEach(snippet => {
//                     if (snippet.objectName === objectName && snippet.entityList) {
//                         snippet.entityList.forEach(entity => {
//                             if (entity.entityName === entityName && entity.snippetList) {
//                                 entity.snippetList.forEach(snippet => {
//                                     const matches = snippet.text.matchAll(regexPattern);
//                                     if (matches) {
//                                         for (const match of matches) {
//                                             const extractedValue = match[1];
//                                             if (extractedValue) {
//                                                 extractedData.add(extractedValue.trim());
//                                             }
//                                         }
//                                     }
//                                 });
//                             }
//                         });
//                     }
//                 });
//             }
//         });

//         const outputText = Array.from(extractedData).join('\n');
//         fs.writeFileSync(outputFilePath, outputText);
//         console.log(`${entityName} data from ${objectName} has been saved to ${outputFilePath}`);
//     } catch (error) {
//         console.error(`Error extracting ${entityName} data: ${error.message}`);
//     }
// }

// // Function to validate extracted data against CSV data
// async function validateData(csvFilePath, txtFilePath, columnName, matchGroup) {
//     try {
//         const csvData = await readCSVFile(csvFilePath, columnName);
//         const txtData = readTextFile(txtFilePath);

//         // Validate if all CSV data are present in the text file
//         const missingData = csvData.filter(item => !txtData.includes(`[${matchGroup}:${item}]`));

//         if (txtData.length === 0) {
//             console.error(`No ${matchGroup.toLowerCase()} data found in the extracted data file.`);
//         }

//         if (missingData.length === 0) {
//             console.log(`All ${matchGroup.toLowerCase()} data from the input CSV are scanned under the respective profile.`);
//         } else {
//             const errorMessage = `Missing ${matchGroup.toLowerCase()} data from the scanned snippet:\n${missingData.join('\n')}`;
//             throw new Error(errorMessage);
//         }
//     } catch (error) {
//         console.error(`Error validating ${matchGroup} data: ${error.message}`);
//         throw error;  // Throw the error to ensure the test fails
//     }
// }


// async function validateEntityData(csvFilePath, txtFilePath, columnName) {
//     try {
//         const csvData = await readCSVFile(csvFilePath, columnName);
//         const txtData = await readTextFile(txtFilePath);

//         // Normalize the data by trimming and converting to lowercase
//         const normalizedCsvData = csvData.map(item => item.trim().toLowerCase());
//         const normalizedTxtData = txtData.toLowerCase();

//         // Validate if all CSV data are present in the text file
//         const missingData = normalizedCsvData.filter(item => !normalizedTxtData.includes(item));

//         if (txtData.length === 0) {
//             console.error(`No ${columnName.toLowerCase()} data is scanned`);
//             throw new Error(`No ${columnName.toLowerCase()} data is scanned`);
//         }

//         if (missingData.length > 0) {
//             const errorMessage = `Missing ${columnName.toLowerCase()} data from the scanned snippet:\n${missingData.join('\n')}`;
//             console.error(errorMessage);
//             throw new Error(errorMessage);
//         }

//         console.log(`All ${columnName.toLowerCase()} data from the input CSV are scanned under the respective profile.`);
//     } catch (error) {
//         console.error(`Error validating ${columnName} data: ${error.message}`);
//         throw error;
//     }
// }


// export {
//     generateRandomName,
//     authenticateAzure,
//     extractProfileData,
//     extractEntityData,
//     validateData,
//     validateEntityData,
//     extractZipFile,
//     readCSVFile,
//     writeCSVFile,
//     readXLSXFile
// };



import fs from 'fs';
import path from 'path';
import { ClientSecretCredential } from '@azure/identity';
import dotenv from 'dotenv';
import JSZip from 'jszip';
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

async function extractZipFile(zipFileBuffer, dir) {
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



function readCSVFile(filePath, columnName) {
    return new Promise((resolve, reject) => {
        const expectedData = [];
        console.log(`Reading CSV file from: ${filePath}`); // Debugging line
        fs.createReadStream(filePath)
            .on('error', (error) => {
                console.error('Error opening CSV file:', error.message); // Debugging line
                reject(error);
            })
            .pipe(csv())
            .on('data', (row) => {
                console.log('CSV Row:', row); // Debugging line
                // Check if the row object has the key exactly matching the columnName
                if (Object.prototype.hasOwnProperty.call(row, columnName)) {
                    expectedData.push(row[columnName]);
                    console.log(`Added ${row[columnName]} to expectedData`); // Debugging line
                } else {
                    console.log(`Column ${columnName} not found in row`); // Debugging line
                }
            })
            .on('end', () => {
                console.log('CSV Reading Completed:', expectedData); // Debugging line
                resolve(expectedData);
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error.message); // Debugging line
                reject(error);
            });
    });
}



// Function to read and parse a text file
function readTextFile(filePath) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return fileContents.split('\n').filter(line => line.trim() !== '');
}

// Function to extract data based on the given profile name and regex pattern
function extractProfileData(jsonFilePath, outputFilePath, profileName, regexPattern, matchGroup) {
    try {
      const fileContents = fs.readFileSync(jsonFilePath, 'utf8');
      let jsonData = JSON.parse(fileContents);
  
      // Convert jsonData to array if it's not already an array
      if (!Array.isArray(jsonData)) {
        jsonData = [jsonData];
      }
  
      let extractedData = new Set();
      jsonData.forEach(data => {
        data.profileSnippet.forEach(snippet => {
          snippet.profileList.forEach(profile => {
            if (profile.profileName === profileName) {
              profile.snippetList.forEach(snippet => {
                const matches = snippet.text.match(regexPattern);
                if (matches) {
                  matches.forEach(match => extractedData.add(match));
                }
              });
            }
          });
        });
      });
  
      // Save extracted data to text file
    //   const outputText = Array.from(extractedData).join('\n');
      fs.writeFileSync(outputFilePath, outputText);
      console.log(`${matchGroup} profiles have been saved!`);
    } catch (error) {
      console.error(`Error extracting ${matchGroup} data: ${error.message}`);
    }
  }


function extractEntityData(jsonFilePath, outputFilePath, entityName, objectName, regexPattern) {
    try {
        const fileContents = fs.readFileSync(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(fileContents);

        const extractedData = new Set();

        jsonData.forEach(item => {
            if (item.entitySnippet) {
                item.entitySnippet.forEach(snippet => {
                    if (snippet.objectName === objectName && snippet.entityList) {
                        snippet.entityList.forEach(entity => {
                            if (entity.entityName === entityName && entity.snippetList) {
                                entity.snippetList.forEach(snippet => {
                                    const matches = snippet.text.matchAll(regexPattern);
                                    if (matches) {
                                        for (const match of matches) {
                                            const extractedValue = match[1];
                                            if (extractedValue) {
                                                extractedData.add(extractedValue.trim());
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        const outputText = Array.from(extractedData).join('\n');
        fs.writeFileSync(outputFilePath, outputText);
        console.log(`${entityName} data from ${objectName} has been saved to ${outputFilePath}`);
    } catch (error) {
        console.error(`Error extracting ${entityName} data: ${error.message}`);
    }
}

// Function to validate extracted data against CSV data
async function validateData(csvFilePath, txtFilePath, columnName, matchGroup) {
    try {
      const csvData = await readCSVFile(csvFilePath, columnName);
      const txtData = readTextFile(txtFilePath);
  
      // Log the read CSV data
      console.log('CSV Data:', csvData);
  
      // Log the read text data
      console.log('Text Data:', txtData);
  
      // Validate if all CSV data are present in the text file
      const missingData = csvData.filter(item => !txtData.some(line => line.includes(`[${matchGroup}:${item}]`)));
  
      // Log the missing data
      console.log('Missing Data:', missingData);
  
      if (txtData.length === 0) {
        console.error(`No ${matchGroup.toLowerCase()} data found in the extracted data file.`);
        throw new Error(`No ${matchGroup.toLowerCase()} data found in the extracted data file.`);
      }
  
      if (missingData.length > 0) {
        const errorMessage = `Missing ${matchGroup.toLowerCase()} data from the text file:\n${missingData.join('\n')}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
  
      console.log(`All ${matchGroup.toLowerCase()} data from the input CSV are scanned under the respective profile.`);
    } catch (error) {
      console.error(`Error validating ${matchGroup} data: ${error.message}`);
      throw error;  // Throw the error to ensure the test fails
    }
  }




async function validateEntityData(csvFilePath, txtFilePath, columnName) {
    try {
        const csvData = await readCSVFile(csvFilePath, columnName);
        const txtData = await readTextFile(txtFilePath);

        // Validate if all CSV data are present in the text file
        const missingData = csvData.filter(item => !txtData.includes(item));

        if (txtData.length === 0) {
            console.error(`No ${columnName.toLowerCase()} data is scanned`);
            throw new Error(`No ${columnName.toLowerCase()} data fis scanned`);
        }

        if (missingData.length > 0) {
            const errorMessage = `Missing ${columnName.toLowerCase()} data from the text file:\n${missingData.join('\n')}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }

        console.log(`All ${columnName.toLowerCase()} data from the input CSV are scanned under the respective profile.`);
    } catch (error) {
        console.error(`Error validating ${columnName} data: ${error.message}`);
        throw error;
    }
}


export {
    generateRandomName,
    authenticateAzure,
    extractProfileData,
    extractEntityData,
    validateData,
    validateEntityData,
    extractZipFile,
    readCSVFile
};