import { fileURLToPath } from 'url';
import axios from 'axios';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { NORMALYZE_BASE_URL } from '../../../../api/config/apiLinks.js';
import { generateRandomName } from '../../../common/helper.js';

const BearerToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL25vcm1hbHl6ZS92ZXJzaW9uIjozLCJodHRwczovL25vcm1hbHl6ZS9wZXJtaXNzaW9ucyI6eyJ0ZWFtcyI6WyJsaXN0IiwiZ2V0IiwiY3JlYXRlIiwiZGVzdHJveSIsImRlc3Ryb3lBbGwiLCJ1cGRhdGUiLCJyZXBsYWNlIl0sImFjY291bnRzIjpbImxpc3QiLCJnZXQiLCJjcmVhdGUiLCJkZXN0cm95IiwiZGVzdHJveUFsbCIsInVwZGF0ZSIsInJlcGxhY2UiXSwiZGF0YXN0b3JlcyI6WyJsaXN0IiwiZ2V0IiwiY3JlYXRlIiwiZGVzdHJveSIsImRlc3Ryb3lBbGwiLCJ1cGRhdGUiLCJyZXBsYWNlIl0sImFzc2V0cyI6WyJsaXN0IiwiZ2V0IiwiY3JlYXRlIiwiZGVzdHJveSIsImRlc3Ryb3lBbGwiLCJ1cGRhdGUiLCJyZXBsYWNlIl0sImlkZW50aXRpZXMiOlsibGlzdCIsImdldCIsImNyZWF0ZSIsImRlc3Ryb3kiLCJkZXN0cm95QWxsIiwidXBkYXRlIiwicmVwbGFjZSJdLCJwYWNrYWdlcyI6WyJsaXN0IiwiZ2V0IiwiY3JlYXRlIiwiZGVzdHJveSIsImRlc3Ryb3lBbGwiLCJ1cGRhdGUiLCJyZXBsYWNlIl0sInJpc2tzIjpbImxpc3QiLCJnZXQiLCJjcmVhdGUiLCJkZXN0cm95IiwiZGVzdHJveUFsbCIsInVwZGF0ZSIsInJlcGxhY2UiXSwicmlza3NpZ25hdHVyZXMiOlsibGlzdCIsImdldCIsImNyZWF0ZSIsImRlc3Ryb3kiLCJkZXN0cm95QWxsIiwidXBkYXRlIiwicmVwbGFjZSJdLCJpbnRlZ3JhdGlvbnMiOlsibGlzdCIsImdldCIsImNyZWF0ZSIsImRlc3Ryb3kiLCJkZXN0cm95QWxsIiwidXBkYXRlIiwicmVwbGFjZSJdLCJhdXRvbWF0aW9ucyI6WyJsaXN0IiwiZ2V0IiwiY3JlYXRlIiwiZGVzdHJveSIsImRlc3Ryb3lBbGwiLCJ1cGRhdGUiLCJyZXBsYWNlIl0sImFwaWtleXMiOlsibGlzdCIsImdldCIsImNyZWF0ZSIsImRlc3Ryb3kiLCJkZXN0cm95QWxsIiwidXBkYXRlIiwicmVwbGFjZSJdLCJlbnRpdGllcyI6WyJsaXN0IiwiZ2V0IiwiY3JlYXRlIiwiZGVzdHJveSIsImRlc3Ryb3lBbGwiLCJ1cGRhdGUiLCJyZXBsYWNlIl0sInByb2ZpbGVzIjpbImxpc3QiLCJnZXQiLCJjcmVhdGUiLCJkZXN0cm95IiwiZGVzdHJveUFsbCIsInVwZGF0ZSIsInJlcGxhY2UiXSwic2NhbnNldHRpbmdzIjpbImxpc3QiLCJnZXQiLCJjcmVhdGUiLCJkZXN0cm95IiwiZGVzdHJveUFsbCIsInVwZGF0ZSIsInJlcGxhY2UiXSwicXVlcnlidWlsZGVyIjpbImxpc3QiLCJnZXQiLCJjcmVhdGUiLCJkZXN0cm95IiwiZGVzdHJveUFsbCIsInVwZGF0ZSIsInJlcGxhY2UiXSwidmlzdWFsaXphdGlvbiI6WyJsaXN0IiwiZ2V0IiwiY3JlYXRlIiwiZGVzdHJveSIsImRlc3Ryb3lBbGwiLCJ1cGRhdGUiLCJyZXBsYWNlIl19LCJodHRwczovL25vcm1hbHl6ZS9saW1pdHMiOnsic2NhbnByb2ZpbGVzIjoxMDAsImNsb3VkU2NhbmZyZXF1ZW5jeSI6eyJGVUxMIjp7ImR1cmF0aW9uU2VjcyI6ODY0MDAsImxpbWl0Ijo0fSwiSU5DUkVNRU5UQUwiOnsiaW50ZXJ2YWxTZWNzIjo5MDB9fSwiYXBpcmF0ZWxpbWl0cyI6MTAwMH0sImh0dHBzOi8vbm9ybWFseXplL3JvbGUiOiJBZG1pbiIsImh0dHBzOi8vbm9ybWFseXplL2VtYWlsIjoieW9naXRhX21haGFqYW5AbmVvdmFzb2x1dGlvbnMuaW4iLCJodHRwczovL25vcm1hbHl6ZS90ZWFtIjo0NTAyLCJodHRwczovL25vcm1hbHl6ZS9pc3N1cGVydXNlciI6ZmFsc2UsImlhdCI6MTcyMDQyMTA5NX0.8eIKGPemVM3WrUYTSoqugVKHoBTDtUPKZ1kd8DfcUkE';

function base64urlEncode(json) {
  const encoded = Buffer.from(JSON.stringify(json))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return encoded;
}

function getAuthToken() {
  const tokenParts = BearerToken.split('.');
  const encodedPayload = tokenParts[1];
  const decodedPayload = Buffer.from(encodedPayload, 'base64').toString('utf-8');
  const payloadJson = JSON.parse(decodedPayload);
  const encodedModifiedPayload = base64urlEncode(payloadJson);
  const newToken = `${tokenParts[0]}.${encodedModifiedPayload}.${tokenParts[2]}`;
  return newToken;
}

async function getJsonFile(filePath) {
  try {
    const rawData = await fs.promises.readFile(filePath, 'utf-8');
    const config = JSON.parse(rawData);
    return config;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const __filename = fileURLToPath(import.meta.url); // Convert the import.meta.url to a file path
const __dirname = path.dirname(__filename); // Get the directory name

describe('TEST_AZUREBLOB_SCHEDULER', function () {
  this.timeout(30000); // Set timeout to 30 seconds

  let scheduler_id;

  it('test_create_azure_blob_storage_schedulers', async function () {
    const authToken = getAuthToken();
    const randomName = generateRandomName('neova', 10);
    const url = `${NORMALYZE_BASE_URL}/status/api/scanprofiles`;
    const data = {
      "name": `${randomName}-blob-auto-scheduler`,
      "description": "",
      "dataStoreTags": [],
      "dataStoreNames": [
        "neova2zuc0"
      ],
      "dataStoreUsers": [],
      "scanType": "SCAN-SELECTED",
      "dataStoreType": "AZUREBLOB-CONTAINER",
      "samplingRate": 10,
      "snippetOption": "FULL",
      "scheduleType": null,
      "scanOnDays": null,
      "enableSnippetForOnprem": false,
      "isCloudTrailBased": false,
      "scanFrequencyInHours": null,
      "scanAtTime": null,
      "incrementalScanEnabled": false,
      "createdBy": "Neova Test Automation",
      "cloudAccountScanType": "ALL",
      "cloudAccounts": [],
      "scanToggledAt": 1720072651957,
      "scanFilterConfig": {
        "extensionPolicy": {
          "extensions": [],
          "mode": "DISABLED"
        },
        "modifiedTimePolicy": {
          "after": 0,
          "before": 0,
          "mode": "DISABLED"
        },
        "prefixPolicy": {
          "mode": "DISABLED",
          "prefixes": []
        },
        "userPolicy": {
          "mode": "DISABLED",
          "users": []
        }
      }
    };
    const headers = {
      'Authorization': authToken,
    };
    const response = await axios.post(url, data, { headers });
    scheduler_id = response.data.id;
    const createFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'response_data', 'create_azure_blob_storage.json');
    const expandedResponse = JSON.stringify(response.data, null, 2);
    fs.writeFileSync(createFilePath, expandedResponse, 'utf8');
    expect(response.status).to.equal(201);
  });

  it('test_get_all_schedulers', async function () {
    const authToken = getAuthToken(); // Retrieve modified JWT token
    const response = await axios.get(`${NORMALYZE_BASE_URL}/status/api/scanprofiles`, {
      headers: {
        'Authorization': authToken,
      }
    });
    const getAllFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'response_data', 'get_all_schedulers.json');
    const expandedResponse = JSON.stringify(response.data, null, 2);
    fs.writeFileSync(getAllFilePath, expandedResponse, 'utf8');
    expect(response.status).to.equal(200);
  });

  it('test_run_scheduler', async function () {
    const authToken = getAuthToken();
    const baseUrl = `${NORMALYZE_BASE_URL}/status/api/v2/scanprofiles/`;
    const url = baseUrl + scheduler_id + '/run';
    const data = {};
    const headers = {
      'Authorization': authToken,
      'Origin': 'https://webui.normalyze.link',
    };
    const response = await axios.post(url, data, { headers });
    const runFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'response_data', 'run_scheduler.json');
    const expandedResponse = JSON.stringify(response.data, null, 2);
    fs.writeFileSync(runFilePath, expandedResponse, 'utf8');
    expect(response.status).to.equal(201);
  });

  // it('test_get_scheduler_details', async function () {
  //   const authToken = getAuthToken();
  //   const baseUrl = `${NORMALYZE_BASE_URL}/status/api/v2/scanprofiles/`;
  //   const url = baseUrl + scheduler_id;
  //   const headers = {
  //     'Authorization': authToken,
  //     'Origin': 'https://webui.normalyze.link',
  //   };
  //   const response = await axios.get(url, { headers });
  //   const getDetailsFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'response_data', 'get_scheduler_details.json');
  //   const expandedResponse = JSON.stringify(response.data, null, 2);
  //   fs.writeFileSync(getDetailsFilePath, expandedResponse, 'utf8');
  //   expect(response.status).to.equal(200);
  // });

  // it('test_delete_scheduler', async function () {
  //   const authToken = getAuthToken();
  //   const baseUrl = `${NORMALYZE_BASE_URL}/status/api/v2/scanprofiles/`;
  //   const url = baseUrl + scheduler_id;
  //   const headers = {
  //     'Authorization': authToken,
  //     'Origin': 'https://webui.normalyze.link',
  //   };
  //   const response = await axios.delete(url, { headers });
  //   const filePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'response_data', 'delete_scheduler.json');
  //   const expandedResponse = JSON.stringify(response.data, null, 2);
  //   fs.writeFileSync(filePath, expandedResponse, 'utf8');
  //   expect(response.status).to.equal(200);
  // });

  it('test_get_snippets', async function () {
    const authToken = getAuthToken();
    const filePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'blob_container_details.json');
    const resource = await getJsonFile(filePath);
    const blobContainerId = resource.blobContainerId;
    const blobContainerName = resource.blobContainerName;
    if (!resource) {
      throw new Error(`Failed to load JSON data from ${filePath}`);
    }
    const url = `${NORMALYZE_BASE_URL}/status/api/v2/snippets?accountId=f22fa846922f&dataStoreType=AZUREBLOB-CONTAINER&dataStoreId=${encodeURIComponent(blobContainerId)}&region=eastus&dataStoreName=${encodeURIComponent(blobContainerName)}`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': authToken,
      }
    });
    const getSnippetsFilePath = path.join(__dirname, '..', '..', '..', 'utils', 'test_data', 'response_data', 'get_snippets.json');
    const expandedResponse = JSON.stringify(response.data, null, 2);
    fs.writeFileSync(getSnippetsFilePath, expandedResponse, 'utf8');
    expect(response.status).to.equal(200);
  });
});