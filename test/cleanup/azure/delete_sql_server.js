// const { ClientSecretCredential } = require("@azure/identity");
// const { SqlManagementClient } = require("@azure/arm-sql");

// const {
//   AZURE_SUBSCRIPTION_ID,
//   AZURE_TENANT_ID,
//   AZURE_SERVICE_PRINCIPAL_ID,
//   AZURE_CLIENT_SECRET,
//   AZURE_RESOURCE_GROUP_NAME
// } = require('../../common/azureLibs/constants');

// class SqlServerDeleter {
//   constructor() {
//     this.subscriptionId = AZURE_SUBSCRIPTION_ID;
//     this.resourceGroupName = AZURE_RESOURCE_GROUP_NAME;
//     this.clientId = AZURE_SERVICE_PRINCIPAL_ID;
//     this.clientSecret = AZURE_CLIENT_SECRET;
//     this.tenantId = AZURE_TENANT_ID;
//     this.credentials = new ClientSecretCredential(this.tenantId, this.clientId, this.clientSecret);
//     this.client = new SqlManagementClient(this.credentials, this.subscriptionId);
//   }

//   async deleteSqlServer(serverName) {
//     try {
//       console.log(`Deleting SQL Server ${serverName}...`);
//       await this.client.servers.beginDelete(this.resourceGroupName, serverName);
//       console.log(`SQL Server ${serverName} deleted successfully.`);
//     } catch (err) {
//       console.error(`Error deleting SQL Server ${serverName}:`, err.message);
//     }
//   }
// }

// module.exports = SqlServerDeleter;


const { StorageManagementClient } = require('@azure/arm-storage');
const fs = require('fs');
const path = require('path');
const { AZURE_SUBSCRIPTION_ID, AZURE_RESOURCE_GROUP_NAME } = require('../../common/azureLibs/constants');
const { authenticateAzure } = require('../../common/helper/authenticateAzure');

// Function to delete a storage account
async function deleteStorageAccount(filePath) {
    // Load the JSON file
    const rawData = fs.readFileSync(filePath);
    const details = JSON.parse(rawData);

    const subscriptionId = AZURE_SUBSCRIPTION_ID;
    const resourceGroupName = AZURE_RESOURCE_GROUP_NAME;
    const storageAccountName = details.storageAccountName;

    const credentials = await authenticateAzure();
    const storageManagementClient = new StorageManagementClient(credentials, subscriptionId);
    await storageManagementClient.storageAccounts.delete(resourceGroupName, storageAccountName);
}

module.exports = { deleteStorageAccount };
