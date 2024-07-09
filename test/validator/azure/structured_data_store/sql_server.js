const { ClientSecretCredential } = require("@azure/identity");
const { SqlManagementClient } = require("@azure/arm-sql");
const fs = require('fs');
const { Connection, Request } = require('tedious');
const { generateRandomName } = require("../../../common/helper");
const axios = require('axios');
const {
  AZURE_SUBSCRIPTION_ID,
  AZURE_TENANT_ID,
  AZURE_SERVICE_PRINCIPAL_ID,
  AZURE_CLIENT_SECRET,
  AZURE_SQL_REGION,
  AZURE_SQL_PASSWORD,
  AZURE_SQL_USERNAME,
  AZURE_RESOURCE_GROUP_NAME
} = require('../../../common/azureLibs/constants');

class AzureSqlManager {
  constructor() {
    this.subscriptionId = AZURE_SUBSCRIPTION_ID;
    this.resourceGroupName = AZURE_RESOURCE_GROUP_NAME;
    this.location = AZURE_SQL_REGION;
    this.clientId = AZURE_SERVICE_PRINCIPAL_ID;
    this.clientSecret = AZURE_CLIENT_SECRET;
    this.tenantId = AZURE_TENANT_ID;
    this.adminLogin = AZURE_SQL_USERNAME;
    this.adminPassword = AZURE_SQL_PASSWORD;
    this.credentials = new ClientSecretCredential(this.tenantId, this.clientId, this.clientSecret);
    this.client = new SqlManagementClient(this.credentials, this.subscriptionId);
    this.connectionConfig = {
      server: '', // Will be set after creating the SQL Server
      authentication: {
        type: 'default',
        options: {
          userName: this.adminLogin,
          password: this.adminPassword,
        },
      },
      options: {
        database: '', // Will be set after creating the SQL Database
        encrypt: true,
        rowCollectionOnRequestCompletion: true,
      },
    };
  }

  async createSqlServer() {
    const randomName = generateRandomName('neova', 10);
    console.log("Creating SQL Server...");

    const serverParameters = {
      location: this.location,
      administratorLogin: this.adminLogin,
      administratorLoginPassword: this.adminPassword,
      version: '12.0'
    };

    const serverResponse = await this.client.servers.beginCreateOrUpdateAndWait(this.resourceGroupName, randomName, serverParameters);
    console.log("SQL Server created:", serverResponse);

    this.connectionConfig.server = `${randomName}.database.windows.net`;
    return randomName;
  }

  async createSqlDatabase(serverName) {
    console.log("Creating SQL Database...");

    const databaseParameters = {
      location: this.location,
      sku: {
        name: 'S0',
        tier: 'Standard',
        capacity: 10
      },
      maxSizeBytes: 1073741824
    };

    const databaseResponse = await this.client.databases.beginCreateOrUpdateAndWait(this.resourceGroupName, serverName, serverName, databaseParameters);
    console.log("SQL Database created:", databaseResponse);

    this.connectionConfig.options.database = serverName;
  }

  async createFirewallRule(serverName) {
    console.log("Creating Firewall Rule...");

    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      const currentIpAddress = response.data.ip;
      console.log(`Current system IP address: ${currentIpAddress}`);

      const firewallRuleName = "allow-current-ip";
      const firewallRuleParameters = {
        startIpAddress: currentIpAddress,
        endIpAddress: currentIpAddress
      };

      const firewallRuleResponse = await this.client.firewallRules.createOrUpdate(this.resourceGroupName, serverName, firewallRuleName, firewallRuleParameters);
      console.log("Firewall Rule created:", firewallRuleResponse);
    } catch (err) {
      console.error("Error creating Firewall Rule:", err.message);
    }
  }

  connectToDatabase() {
    console.log('Connecting to Azure SQL Database...');
    const connection = new Connection(this.connectionConfig);

    connection.on('connect', (err) => {
      if (err) {
        console.error('Connection failed:', err.message);
        return;
      }

      console.log('Connected to Azure SQL Database');
      this.executeSqlScripts(connection);
    });

    connection.on('end', () => {
      console.log('Connection closed');
    });

    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to Azure SQL Database:', err.message);
        connection.close();
      }
    });
  }

  executeSqlScripts(connection) {
    try {
      const createTableSql = fs.readFileSync('../../../utils/test_data/create_table.sql', 'utf8');
      const insertDataSql = fs.readFileSync('../../../utils/test_data/insert_data.sql', 'utf8');

      this.executeSqlFile(connection, createTableSql, (err) => {
        if (err) {
          console.error('Error executing create_table.sql:', err.message);
          connection.close();
          return;
        }

        console.log('create_table.sql executed successfully');
        this.executeSqlFile(connection, insertDataSql, (err) => {
          if (err) {
            console.error('Error executing insert_data.sql:', err.message);
            connection.close();
            return;
          }

          console.log('insert_data.sql executed successfully');
          connection.close();
        });
      });
    } catch (error) {
      console.error('Error reading SQL file:', error.message);
      connection.close();
    }
  }

  executeSqlFile(connection, sqlQuery, callback) {
    const request = new Request(sqlQuery, (err, rowCount, rows) => {
      if (err) {
        console.error('Error executing SQL query:', err.message);
        callback(err);
        return;
      }

      console.log('SQL query executed successfully');
      callback(null, rowCount, rows);
    });

    connection.execSql(request);
  }

  async main() {
    try {
      const serverName = await this.createSqlServer();
      await this.createSqlDatabase(serverName);
      await this.createFirewallRule(serverName);
      this.connectToDatabase();
      return serverName; // Return the SQL server name
    } catch (err) {
      console.error("Error:", err);
      throw err; // Propagate error up
    }
  }
}

// Exporting a function that creates an instance of AzureSqlManager and returns the SQL server name
async function createAzureSqlManager() {
    try {
      console.log('Creating AzureSqlManager instance...');
      const manager = new AzureSqlManager();
  
      console.log('Executing main method...');
      const serverName = await manager.main();
  
      console.log('SQL Server name:', serverName);
      return serverName;
    } catch (error) {
      console.error('Error in createAzureSqlManagerAndGetServerName:', error);
      throw error;
    }
  }

module.exports = createAzureSqlManager;
