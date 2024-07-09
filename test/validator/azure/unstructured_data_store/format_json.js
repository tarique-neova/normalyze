// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Helper function to read JSON file asynchronously
// async function getJsonFile(filePath) {
//   try {
//     const data = await fs.readFile(filePath, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     console.error('Error reading file:', error);
//     throw error;
//   }
// }

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const filePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'get_azure_blob_storage_snippets.json');
// const transformedDataFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'transformed_data.json');

// // Read the JSON file
// const jsonData = await getJsonFile(filePath);

// // Transform the data
// const transformedData = jsonData.map(entry => {
//   return {
//     accountId: entry.accountId,
//     dataStoreType: entry.dataStoreType,
//     dataStoreId: entry.dataStoreId,
//     profileSnippet: entry.profileSnippet.map(profile => {
//       return {
//         objectName: profile.objectName,
//         profileList: profile.profileList.map(profileDetail => {
//           return {
//             profileName: profileDetail.profileName,
//             profileCount: profileDetail.profileCount,
//             snippetList: profileDetail.snippetList.map(snippet => {
//               return {
//                 offset: snippet.offset,
//                 text: snippet.text
//               };
//             })
//           };
//         })
//       };
//     }),
//     entitySnippet: entry.entitySnippet.map(entity => {
//       return {
//         objectName: entity.objectName,
//         entityList: entity.entityList.map(entityDetail => {
//           return {
//             entityName: entityDetail.entityName,
//             entityCount: entityDetail.entityCount,
//             snippetList: entityDetail.snippetList.map(snippet => {
//               return {
//                 offset: snippet.offset,
//                 text: snippet.text
//               };
//             })
//           };
//         })
//       };
//     })
//   };
// });

// // Save the transformed data to a new file
// await fs.writeFile(transformedDataFilePath, JSON.stringify(transformedData, null, 2))
//   .then(() => {
//     console.log('Data transformation complete.');
//   })
//   .catch((error) => {
//     console.error('Error writing file:', error);
//   });



import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper function to read JSON file asynchronously
async function getJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'get_azure_blob_storage_snippets.json');
const transformedDataFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'financial_information.json');

// Read the JSON file
const jsonData = await getJsonFile(filePath);

// Function to find object by name in a nested JSON object
function findObjectByName(obj, name) {
  if (obj.objectName === name) {
    return obj;
  }
  if (obj.profileSnippet) {
    for (const profile of obj.profileSnippet) {
      const found = findObjectByName(profile, name);
      if (found) {
        return found;
      }
    }
  }
  if (obj.entitySnippet) {
    for (const entity of obj.entitySnippet) {
      const found = findObjectByName(entity, name);
      if (found) {
        return found;
      }
    }
  }
  // If the current object doesn't have the "objectName" property, return the object itself
  return obj;
}

// Find the financial information object
const financialData = findObjectByName(jsonData, 'financial_information.csv');

if (financialData) {
  // Transform the data
  const transformedData = {
    accountId: financialData.accountId,
    dataStoreType: financialData.dataStoreType,
    dataStoreId: financialData.dataStoreId,
    profileSnippet: financialData.profileSnippet ? financialData.profileSnippet.map(profile => {
      return {
        objectName: profile.objectName,
        profileList: profile.profileList.map(profileDetail => {
          return {
            profileName: profileDetail.profileName,
            profileCount: profileDetail.profileCount,
            snippetList: profileDetail.snippetList.map(snippet => {
              return {
                offset: snippet.offset,
                text: snippet.text
              };
            })
          };
        })
      };
    }) : [],
    entitySnippet: financialData.entitySnippet ? financialData.entitySnippet.map(entity => {
      return {
        objectName: entity.objectName,
        entityList: entity.entityList.map(entityDetail => {
          return {
            entityName: entityDetail.entityName,
            entityCount: entityDetail.entityCount,
            snippetList: entityDetail.snippetList.map(snippet => {
              return {
                offset: snippet.offset,
                text: snippet.text
              };
            })
          };
        })
      };
    }) : []
  };

  // Save the transformed data to a new file
  await fs.writeFile(transformedDataFilePath, JSON.stringify(transformedData, null, 2))
    .then(() => {
      console.log('Financial_information.csv data extraction complete.');
    })
    .catch((error) => {
      console.error('Error writing file:', error);
    });
} else {
  console.error('Financial_information.csv data not found in the input JSON.');
}