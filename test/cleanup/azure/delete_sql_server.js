import { ClientSecretCredential } from '@azure/identity';
import { SqlManagementClient } from '@azure/arm-sql';
import { authenticateAzure } from '../../common/helper.js';
import { AZURE_RESOURCE_GROUP_NAME, AZURE_SQL_REGION } from '../../common/azureLibs/constants.js';
import { getJsonFile } from '../../../api/common/helper.js';

class DeleteSQLServer {
  constructor(filePath) {
    // Initialize class properties
    this.filePath = filePath;
    this.subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
    this.resourceGroupName = AZURE_RESOURCE_GROUP_NAME;
    this.location = AZURE_SQL_REGION;    
  }

  async init() {
    // Initialize Azure credentials and SQL management client
    const credentials = new ClientSecretCredential(process.env.AZURE_TENANT_ID, process.env.AZURE_SERVICE_PRINCIPAL_ID, process.env.AZURE_CLIENT_SECRET);
    this.sqlServerManagementClient = new SqlManagementClient(credentials, this.subscriptionId);
    await this.authenticate();
  }

  async authenticate() {
    // Authenticate with Azure
    try {
      this.credentials = await authenticateAzure();
    } catch (error) {
      console.error('Failed to authenticate Azure:', error);
      throw error;
    }
  }

  async deleteSQLServer() {
    // Delete the SQL Server
    try {
      await this.init(); // Initialize credentials and client

      // Load the JSON file containing SQL Server details
      const resource = await getJsonFile(this.filePath);
      const sqlServerName = resource.sqlServerName;

      // Delete the SQL Server
      await this.sqlServerManagementClient.servers.beginDelete(this.resourceGroupName, sqlServerName);
      console.log(`Successfully deleted SQL Server ${sqlServerName}`);
    } catch (error) {
      console.error('Failed to delete SQL Server:', error.message);
      throw error;
    }
  }
}

// Export the class for use in other modules
export { DeleteSQLServer };
