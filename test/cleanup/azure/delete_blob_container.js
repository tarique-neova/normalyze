const { ClientSecretCredential } = require('@azure/identity');
const { StorageManagementClient } = require('@azure/arm-storage');
const fs = require('fs');
const path = require('path');
const {
    AZURE_SUBSCRIPTION_ID,
    AZURE_TENANT_ID,
    AZURE_SERVICE_PRINCIPAL_ID,
    AZURE_CLIENT_SECRET,
    AZURE_RESOURCE_GROUP_NAME
} = require('../../common/azureLibs/constants');

// Function to delete a storage account
async function deleteStorageAccount(filePath) {
  // Load the JSON file
  const rawData = fs.readFileSync(filePath);
  const details = JSON.parse(rawData);

  const subscriptionId = AZURE_SUBSCRIPTION_ID;
  const resourceGroupName = AZURE_RESOURCE_GROUP_NAME;
  const clientId = AZURE_SERVICE_PRINCIPAL_ID;
  const clientSecret = AZURE_CLIENT_SECRET;
  const tenantId = AZURE_TENANT_ID;
  const storageAccountName = details.storageAccountName;

  const credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const storageManagementClient = new StorageManagementClient(credentials, subscriptionId);
  await storageManagementClient.storageAccounts.delete(resourceGroupName, storageAccountName);
}

module.exports = { deleteStorageAccount };
