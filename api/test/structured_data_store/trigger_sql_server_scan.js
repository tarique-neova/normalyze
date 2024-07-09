import { getJsonFile, createScheduler, getAllSchedulers, runScheduler, getSnippets } from '../../common/helper.js';
import { SQL_SERVER_DATA_STORE_API_TYPE, AZURE_SQL_REGION } from '../../../test/common/azureLibs/constants.js';
import { generateRandomName } from '../../../test/common/helper.js';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schedulerName = `${generateRandomName('neova', 10)}-sql-server-scan-scheduler`;
const filePath = path.join(__dirname, '..', '..', '..', 'test', 'utils', 'test_data', 'sql_server_details.json');
const resource = await getJsonFile(filePath);

describe('TRIGGER_AZURESQL_SERVER_DATASTORE_SCANNER', function () {
  this.timeout(30000); // Set timeout to 30 seconds

  let scheduler_id;

  it('test_create_scan_schedulers', async function () {
    const sqlServerName = resource.sqlServerName;
    scheduler_id = await createScheduler(SQL_SERVER_DATA_STORE_API_TYPE, sqlServerName, schedulerName);
    const createFilePath = path.join(__dirname, '..',  '..', '..', 'test', 'utils', 'test_data', 'api_response_data', 'structured_data_store', 'create_azure_sql_server.json');
    const expandedResponse = JSON.stringify({ schedulerId: scheduler_id }, null, 2);
    fs.writeFileSync(createFilePath, expandedResponse, 'utf8');
    expect(scheduler_id).to.be.a('string');
  });

  it('test_get_all_scan_schedulers', async function () {
    const response = await getAllSchedulers();
    const getAllFilePath = path.join(__dirname, '..', '..', '..', 'test', 'utils', 'test_data', 'api_response_data', 'structured_data_store', 'get_azure_sql_server_schedulers.json');
    const expandedResponse = JSON.stringify(response, null, 2);
    fs.writeFileSync(getAllFilePath, expandedResponse, 'utf8');
    expect(response).to.be.an('array');
  });

  it('test_trigger_scan', async function () {
    const response = await runScheduler(scheduler_id);
    const runFilePath = path.join(__dirname, '..', '..', '..', 'test', 'utils', 'test_data', 'api_response_data', 'structured_data_store', 'run_azure_sql_server_scheduler.json');
    const expandedResponse = JSON.stringify(response, null, 2);
    fs.writeFileSync(runFilePath, expandedResponse, 'utf8');
    expect(response).to.be.an('object');
  });

  it('test_get_snippets_data', async function () {
    const sqlServerId = resource.sqlServerId;
    const sqlServerName = resource.sqlServerName;
    const response = await getSnippets(SQL_SERVER_DATA_STORE_API_TYPE, sqlServerName, sqlServerId, AZURE_SQL_REGION);
    const getSnippetsFilePath = path.join(__dirname, '..', '..', '..', 'test', 'utils', 'test_data', 'api_response_data', 'structured_data_store', 'get_azure_sql_server_snippets.json');
    const expandedResponse = JSON.stringify(response, null, 2);
    fs.writeFileSync(getSnippetsFilePath, expandedResponse, 'utf8');
    expect(response).to.be.an('array');
  });
});