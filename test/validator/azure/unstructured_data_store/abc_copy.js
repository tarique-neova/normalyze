import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import { expect } from 'chai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'new_snippet.json');
const csvFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'sensitive', 'financial_information.csv');


it('csv_person_validation', function (done) {
  fs.readFile(jsonFilePath, 'utf8', (err, jsonString) => {
    if (err) {
      console.error('Error reading file:', err);
      done(err);
      return;
    }

    try {
      // Parse the JSON data
      const data = JSON.parse(jsonString);

      // Function to extract entities from snippets
      const extractEntities = (snippets) => {
        let entities = {
          PERSON: new Set(),
          CREDIT_CARD_NUMBER: new Set(),
          DATE: new Set(),
          PHONE_NUMBER: new Set(),
          US_STATE: new Set(),
          GENDER: new Set(),
          COUNTRY: new Set(),
          US_SSN: new Set()
        };
     

        snippets.forEach(snippet => {
          const extractFromSnippetList = (snippetList) => {
            snippetList.forEach(snippetItem => {
              const text = snippetItem.text;
              const matches = text.match(/\[(PERSON|CREDIT_CARD_NUMBER|DATE|PHONE_NUMBER|US_STATE|GENDER|COUNTRY|US_SSN):[^\]]+\]/g);
              if (matches) {
                matches.forEach(match => {
                  const [type, value] = match.slice(1, -1).split(':');
                  entities[type].add(value);
                });
              }
            });
          };

          if (snippet.profileList) {
            snippet.profileList.forEach(profile => extractFromSnippetList(profile.snippetList));
          }

          if (snippet.entityList) {
            snippet.entityList.forEach(entity => extractFromSnippetList(entity.snippetList));
          }
        });

        // Convert sets to arrays
        for (let key in entities) {
          entities[key] = Array.from(entities[key]);
        }

        return entities;
      };

      // Ensure profileSnippet and entitySnippet exist in the data
      if (!data.data.profileSnippet || !Array.isArray(data.data.profileSnippet)) {
        console.error('profileSnippet is missing or not an array in the JSON data');
        done(new Error('profileSnippet is missing or not an array in the JSON data'));
        return;
      }

      if (!data.data.entitySnippet || !Array.isArray(data.data.entitySnippet)) {
        console.error('entitySnippet is missing or not an array in the JSON data');
        done(new Error('entitySnippet is missing or not an array in the JSON data'));
        return;
      }

      // Extract entities from profileSnippet and entitySnippet
      const profileEntities = extractEntities(data.data.profileSnippet);
      const entityEntities = extractEntities(data.data.entitySnippet);

      // Combine profileEntities and entityEntities
      let combinedEntities = {
        PERSON: new Set([...profileEntities.PERSON, ...entityEntities.PERSON]),
        CREDIT_CARD_NUMBER: new Set([...profileEntities.CREDIT_CARD_NUMBER, ...entityEntities.CREDIT_CARD_NUMBER]),
        DATE: new Set([...profileEntities.DATE, ...entityEntities.DATE]),
        PHONE_NUMBER: new Set([...profileEntities.PHONE_NUMBER, ...entityEntities.PHONE_NUMBER]),
        US_STATE: new Set([...profileEntities.US_STATE, ...entityEntities.US_STATE]),
        GENDER: new Set([...profileEntities.GENDER, ...entityEntities.GENDER]),
        COUNTRY: new Set([...profileEntities.COUNTRY, ...entityEntities.COUNTRY]),
        US_SSN: new Set([...profileEntities.US_SSN, ...entityEntities.US_SSN])
      };

      // Convert sets to arrays
      for (let key in combinedEntities) {
        combinedEntities[key] = Array.from(combinedEntities[key]);
      }

      console.log('Combined unique entities:', combinedEntities);

      const personColumnData = [];

      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          personColumnData.push(row.PERSON);
        })
        .on('end', () => {
          console.log('CSV file successfully processed.');
          const verificationResults = verifyPersonValues(combinedEntities.PERSON, personColumnData);
          const failedResults = verificationResults.filter(result => !result.isPresent);

          if (failedResults.length > 0) {
            console.error(`${failedResults.length} PERSON entities not found in the CSV file:`, failedResults.map(r => r.person));
          }

          expect(failedResults.length, `${failedResults.length} PERSON entities not found in the CSV file`).to.equal(0);
          done();
        });

      function verifyPersonValues(personColumnData, personValuesToCheck) {
        return personValuesToCheck.map(person => ({
          person,
          isPresent: personColumnData.includes(person)
        }));
      }
    } catch (err) {
      console.error('Error parsing JSON:', err);
      done(err);
    }
  });
});