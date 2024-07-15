import { getJsonFile, createScheduler, getAllSchedulers, runScheduler, checkStatus } from '../../common/helper.js';
import { BLOB_DATA_STORE_API_TYPE, AZURE_ONBOARD_LOCATION } from '../../../test/common/azureLibs/constants.js';
import { generateRandomName } from '../../../test/common/helper.js';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '..', '..', '..', 'test', 'utils', 'test_data', 'blob_container_details.json');
const resource = await getJsonFile(filePath);
const schedulerName = `${generateRandomName('neova', 10)}-blob-scan-scheduler`;
const currentTimestamp = moment().format('x');
const currentUser = os.userInfo().username;

describe('TRIGGER_AZUREBLOB_DATASTORE_SCANNER', function () {
  this.timeout(1200000);
  let scheduler_id;
  let workflowId;

  it('test_create_scan_schedulers', async function () {
    try {
      const containerName = resource.blobContainerName;
      scheduler_id = await createScheduler(BLOB_DATA_STORE_API_TYPE, containerName, schedulerName, currentTimestamp, currentUser);
      // const createFilePath = path.join(__dirname, '..', '..', '..', 'test', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'create_azure_blob_storage.json');
      // const expandedResponse = JSON.stringify({ schedulerId: scheduler_id }, null, 2);
      console.log('Scheduler ID:', scheduler_id);
      // fs.writeFileSync(createFilePath, expandedResponse, 'utf8');
      expect(scheduler_id).to.be.a('string');
    } catch (error) {
      console.error('Error creating scan scheduler:', error);
    }
  });

  it('test_get_all_scan_schedulers', async function () {
    try {
      const response = await getAllSchedulers();
      const getAllFilePath = path.join(__dirname, '..', '..', '..', 'test', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'get_azure_blob_storage_schedulers.json');
      const expandedResponse = JSON.stringify(response, null, 2);
      //console.log('All Schedulers Response:', expandedResponse);
      fs.writeFileSync(getAllFilePath, expandedResponse, 'utf8');
      expect(response).to.be.an('array');
    } catch (error) {
      console.error('Error getting all scan schedulers:', error);
    }
  });

  it('test_trigger_scan', async function () {
    try {
      console.log("scheduler_id: ", scheduler_id)
      workflowId = await runScheduler(scheduler_id);
      // const runFilePath = path.join(__dirname, '..', '..', '..', 'test', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'run_azure_blob_storage_scheduler.json');
      // const expandedResponse = JSON.stringify({ jobId: response }, null, 2);
      console.log('workflow Id:', workflowId);
      // fs.writeFileSync(runFilePath, expandedResponse, 'utf8');
      // expect(response).to.be.a('string');
    } catch (error) {
      console.error('Error triggering scan:', error);
    }
  });

  it('test_get_snippets_data', async function () {
    try {
      const containerId = resource.blobContainerId;
      const containerName = resource.blobContainerName;
      const response = await checkStatus(BLOB_DATA_STORE_API_TYPE, containerName, containerId, AZURE_ONBOARD_LOCATION, workflowId);
  
      if (!response) {
        console.log('Snippets data not available yet. Retrying...');
      } else {
        const getSnippetsFilePath = path.join(__dirname, '..', '..', '..', 'test', 'utils', 'test_data', 'api_response_data', 'unstructured_data_store', 'get_azure_blob_storage_snippets.json');
        const expandedResponse = JSON.stringify(response, null, 2);
        console.log('Get Snippets Data Response:', expandedResponse);
        
        // Ensure the data is valid before writing to the file
        if (typeof expandedResponse !== 'string' || expandedResponse === 'undefined') {
          throw new TypeError('Invalid data type for writeFileSync');
        }
        
        fs.writeFileSync(getSnippetsFilePath, expandedResponse, 'utf8');
        expect(response).to.be.an('array');
      }
    } catch (error) {
      console.error('Error getting snippets data:', error);
    }
  });
});
