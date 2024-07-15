// delete_blob_container.js

import * as fs from 'fs';
import * as path from 'path';
import { ClientSecretCredential } from '@azure/identity';
import { StorageManagementClient } from '@azure/arm-storage';
import { authenticateAzure } from '../../common/helper.js';
import { AZURE_RESOURCE_GROUP_NAME, AZURE_ONBOARD_LOCATION } from '../../common/azureLibs/constants.js';
import { getJsonFile } from '../../../api/common/helper.js';

class DeleteStorageAccount {
  constructor(filePath) {
    this.filePath = filePath;
    this.subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
    this.resourceGroupName = AZURE_RESOURCE_GROUP_NAME;
    this.location = AZURE_ONBOARD_LOCATION;    
  }

  async init() {
    const credentials = new ClientSecretCredential(process.env.AZURE_TENANT_ID, process.env.AZURE_SERVICE_PRINCIPAL_ID, process.env.AZURE_CLIENT_SECRET);
    this.storageManagementClient = new StorageManagementClient(credentials, this.subscriptionId);
    await this.authenticate();
  }

  async authenticate() {
    try {
      this.credentials = await authenticateAzure();
    } catch (error) {
      console.error('Failed to authenticate Azure:', error);
      throw error;
    }
  }

  async deleteStorageAccount() {
    try {
      await this.init();

      // Load the JSON file
      const resource = await getJsonFile(this.filePath);
      const storageAccountName = resource.storageAccountName;
      await this.storageManagementClient.storageAccounts.delete(this.resourceGroupName, storageAccountName);
      console.log(`Successfully deleted storage account ${storageAccountName}`);
    } catch (error) {
      console.error('Failed to delete storage account:', error.message);
      throw error;
    }
  }
}

export { DeleteStorageAccount };