/*
@author - Tarique Salat
This class does the following - 
1. Creates storage account in azure
2. Creates blob container inside respective storage account
3. Uploads the test data files to the blob container
*/

import { StorageManagementClient } from '@azure/arm-storage';
import { BlobServiceClient } from '@azure/storage-blob';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateRandomName, authenticateAzure } from '../../../common/helper.js';
import {
    AZURE_ONBOARD_LOCATION,
    AZURE_RESOURCE_GROUP_NAME
} from '../../../common/azureLibs/constants.js';

await dotenv.config({ path: './.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AzureStorageManager {
    constructor() {
        this.subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
        this.resourceGroupName = AZURE_RESOURCE_GROUP_NAME;
        this.location = AZURE_ONBOARD_LOCATION;
        // Paths to test data files
        this.xlsxFileData = path.resolve(__dirname, '../../../utils/test_data/sensitive/personal_information.xlsx');
        this.csvFileData = path.resolve(__dirname, '../../../utils/test_data/sensitive/financial_information.csv');
        this.zipFileData = path.resolve(__dirname, '../../../utils/test_data/sensitive/govt_data.zip');
        // Path to store blob container details
        this.resultFilePath = path.resolve(__dirname, '../../../utils/test_data/blob_container_details.json');
    }

    async init() {
        // Authenticate with Azure
        this.credentials = await authenticateAzure();
        // Initialize Azure Storage Management Client
        this.storageManagementClient = new StorageManagementClient(this.credentials, this.subscriptionId);
    }

    async createStorageAccountAndContainer() {
        const randomName = generateRandomName('neova', 10);

        // Create a storage account
        console.log(`Creating storage account "${randomName}"...`);
        const storageAccountParams = {
            location: this.location,
            sku: { name: 'Standard_LRS' },
            kind: 'StorageV2',
        };
        const storageAccount = await this.storageManagementClient.storageAccounts.beginCreateAndWait(
            this.resourceGroupName,
            randomName,
            storageAccountParams
        );
        console.log(`Storage account "${randomName}" created successfully.`);

        // Get the storage account key
        const keys = await this.storageManagementClient.storageAccounts.listKeys(this.resourceGroupName, randomName);
        const accountKey = keys.keys[0].value;
        const connectionString = `DefaultEndpointsProtocol=https;AccountName=${randomName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;
        this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

        // Create the container
        const containerName = `${randomName}-container`;
        console.log(`Creating container "${containerName}"...`);
        const containerClient = this.blobServiceClient.getContainerClient(containerName);
        await containerClient.create();
        console.log(`Container "${containerName}" created successfully.`);

        // Upload files to the container
        await this.uploadFileToContainer(containerClient, this.xlsxFileData);
        await this.uploadFileToContainer(containerClient, this.csvFileData);
        await this.uploadFileToContainer(containerClient, this.zipFileData);

        // Construct result object with storage account and container details
        const result = {
            storageAccountName: randomName,  // Use the randomName as storageAccountName
            storageAccountId: storageAccount.id,  // Fetch the correct storage account ID
            blobContainerName: containerClient.containerName,
            blobContainerUrl: containerClient.url,
            blobContainerId: `/subscriptions/${this.subscriptionId}/resourceGroups/${AZURE_RESOURCE_GROUP_NAME}/providers/Microsoft.Storage/storageAccounts/${randomName}/blobServices/default/containers/${containerClient.containerName}`
        };

        // Write result to JSON file
        fs.writeFileSync(this.resultFilePath, JSON.stringify(result, null, 2));
        console.log(`Storage account details saved to ${this.resultFilePath}`);

        return result;
    }

    async uploadFileToContainer(containerClient, filePath) {
        console.log(`Uploading file "${filePath}" to container...`);
        const blobName = path.basename(filePath);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
        console.log(`File "${filePath}" uploaded successfully. Request ID: ${uploadBlobResponse.requestId}`);
    }
}

// Usage
(async () => {
    const azureManager = new AzureStorageManager();
    await azureManager.init(); // Ensure initialization is complete before proceeding
    azureManager.createStorageAccountAndContainer()
        .then(result => {
            console.log('Storage account and container created:', result);
        })
        .catch(err => {
            console.error('Error creating storage account and container:', err);
        });
})();
