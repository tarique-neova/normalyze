import { getJsonFile, createScheduler, getAllSchedulers, runScheduler, checkStatus } from '../../common/helper.js';
import { SQL_SERVER_DATA_STORE_API_TYPE, AZURE_SQL_REGION } from '../../../test/common/azureLibs/constants.js';
import { generateRandomName } from '../../../test/common/helper.js';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { fileURLToPath } from 'url';
import os from 'os';

// Define constants for file paths and environment settings
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '..', '..', '..', 'test', 'utils', 'test_data', 'sql_server_details.json');

// Read the JSON file containing SQL Server details
const resource = await getJsonFile(filePath);

// Generate a unique scheduler name and get the current timestamp and username
const schedulerName = `${generateRandomName('neova', 10)}-sql-server-scan-scheduler`;
const currentTimestamp = moment().format('x');
const currentUser = os.userInfo().username;

// Define the test suite
describe('TRIGGER_AZURESQL_SERVER_DATASTORE_SCANNER', function () {
  this.timeout(1200000); // Set timeout for the entire suite to 20 minutes
  let scheduler_id;
  let workflowId;

  // Test case to create a scan scheduler
  it('test_create_scan_schedulers', async function () {
    try {
      const sqlServerName = resource.sqlServerName;
      // Call createScheduler function and store the returned scheduler ID
      scheduler_id = await createScheduler(SQL_SERVER_DATA_STORE_API_TYPE, sqlServerName, schedulerName, currentTimestamp, currentUser);
      
      console.log('Scheduler ID:', scheduler_id);
      expect(scheduler_id).to.be.a('string'); // Check if scheduler ID is a string
    } catch (error) {
      console.error('Error creating scan scheduler:', error);
    }
  });

  // Test case to get all scan schedulers
  it('test_get_all_scan_schedulers', async function () {
    try {
      const response = await getAllSchedulers();
      // Define file path for storing the response
      const getAllFilePath = path.join(__dirname, '..', '..', '..', 'test', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'sql_server_schedulers.json');
      const expandedResponse = JSON.stringify(response, null, 2);
      fs.writeFileSync(getAllFilePath, expandedResponse, 'utf8'); // Write the response to a file
      expect(response).to.be.an('array'); // Check if the response is an array
    } catch (error) {
      console.error('Error getting all scan schedulers:', error);
    }
  });

  // Test case to trigger a scan
  it('test_trigger_scan', async function () {
    try {
      console.log("scheduler_id: ", scheduler_id);
      // Call runScheduler function and store the returned workflow ID
      workflowId = await runScheduler(scheduler_id);
      
      console.log('workflow Id:', workflowId);
      expect(workflowId).to.be.a('string'); // Check if workflow ID is a string
    } catch (error) {
      console.error('Error triggering scan:', error);
    }
  });

  // Test case to get snippets data
  // it('test_get_snippets_data', async function () {
  //   try {
  //     const sqlServerId = resource.sqlServerId;
  //     const sqlServerName = resource.sqlServerName;
  //     // Call checkStatus function and store the response
  //     const response = await checkStatus(SQL_SERVER_DATA_STORE_API_TYPE, sqlServerName, sqlServerId, AZURE_SQL_REGION, workflowId);
  
  //     if (!response) {
  //       console.log('Snippets data not available yet. Retrying...');
  //     } else {
  //       // Define file path for storing the snippets data response
  //       const getSnippetsFilePath = path.join(__dirname, '..', '..', '..', 'test', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'get_azure_sql_server_snippets.json');
  //       const expandedResponse = JSON.stringify(response, null, 2);
  //       console.log('Get Snippets Data Response:', expandedResponse);
        
  //       // Ensure the data is valid before writing to the file
  //       if (typeof expandedResponse !== 'string' || expandedResponse === 'undefined') {
  //         throw new TypeError('Invalid data type for writeFileSync');
  //       }
        
  //       fs.writeFileSync(getSnippetsFilePath, expandedResponse, 'utf8'); // Write the snippets data to a file
  //       expect(response).to.be.an('array'); // Check if the response is an array
  //     }
  //   } catch (error) {
  //     console.error('Error getting snippets data:', error);
  //   }
  // });
});
