import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'get_azure_blob_storage_snippets.json');
const csvFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'financial_information.csv');

const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

describe('Verify All credit card numbers are highlighted', function () {
  it('Verify All credit card numbers are highlighted', async function () {
    let allCreditCardNumbersPresent = true;
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const creditCardNumber = row['Credit Card Number'];
        if (creditCardNumber) {
          const creditCardProfile = jsonData[0].profileSnippet.find(profile => profile.profileName === 'CREDIT_CARD_N_PERSON');
          const creditCardList = creditCardProfile.snippetList.map(snippet => snippet.text.split('\n').find(line => line.includes(creditCardNumber.trim())));
          const isPresent = creditCardList.some(line => line !== undefined);
          if (!isPresent) {
            allCreditCardNumbersPresent = false;
            console.log(`Credit card number ${creditCardNumber} is not present in the JSON data.`);
          }
        }
      })
      .on('end', () => {
        if (allCreditCardNumbersPresent) {
          console.log('All credit card numbers are present in the JSON data.');
        }
      });
  });
});