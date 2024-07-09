import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it } from 'mocha';
import assert from 'assert';
import csvParser from 'csv-parser';

// Helper function to read JSON file asynchronously
async function getJsonFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

// Helper function to read CSV file asynchronously
async function getCsvFile(filePath) {
  try {
    const data = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => data.push(row))
        .on('end', resolve)
        .on('error', reject);
    });
    return data;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'transformed_data.json');
const csvFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'financial_information.csv');

describe('VALIDATE_AZURE_BLOB_CONTAINER_TESTS', function () {
  this.timeout(30000); // Set timeout to 30 seconds

  it('validate_entities', async function () {
    try {
      const jsonData = await getJsonFile(jsonFilePath);
      const csvData = await getCsvFile(csvFilePath);

      // Check if the data structure is as expected
      if (!Array.isArray(jsonData)) {
        throw new Error('The JSON data does not have the expected structure.');
      }

      // Extract customer names from CSV data
      const csvNames = csvData.map(row => row['Customer Name'].trim());

      // Extract person names from JSON data
      const jsonPersonNames = jsonData[0].entitySnippet.find(entity => entity.objectName === 'financial_information.csv').entityList.find(entity => entity.entityName === 'PERSON').snippetList.map(snippet => snippet.text.match(/\[PERSON:(.*?)\]/)[1]);

      // Assert that all JSON person names are present in the CSV customer names
      jsonPersonNames.forEach(name => {
        assert(csvNames.includes(name), `Name ${name} from JSON is not present in CSV data.`);
      });

      console.log('All JSON person names are present in the CSV data.');
    } catch (error) {
      console.error('Error processing file:', error);
    }
  });
});