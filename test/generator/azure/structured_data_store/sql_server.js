import { ClientSecretCredential } from "@azure/identity";
import { SqlManagementClient } from "@azure/arm-sql";
import fs from 'fs';
import { Connection, Request } from 'tedious';
import { generateRandomName } from "../../../common/helper.js";
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// import SqlServerDeleter from '../../../cleanup/azure/delete_sql_server.js';
import {
  AZURE_SQL_REGION,
  AZURE_SQL_PASSWORD,
  AZURE_SQL_USERNAME,
  AZURE_RESOURCE_GROUP_NAME
} from '../../../common/azureLibs/constants.js';

await dotenv.config({ path: './.env' });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resultFilePath = path.resolve(__dirname, '../../../utils/test_data/sql_server_details.json');

class AzureSqlManager {
  constructor() {
    this.subscriptionId = process.env.AZURE_SUBSCRIPTION_ID;
    this.resourceGroupName = AZURE_RESOURCE_GROUP_NAME;
    this.location = AZURE_SQL_REGION;
    this.clientId = process.env.AZURE_SERVICE_PRINCIPAL_ID;
    this.clientSecret = process.env.AZURE_CLIENT_SECRET;
    this.tenantId = process.env.AZURE_TENANT_ID;
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
        trustServerCertificate: true
      },
    };
    // Initialize SqlServerDeleter instance
    // this.sqlServerDeleter = new SqlServerDeleter();
  }

  async createSqlServer() {
    const randomName = generateRandomName('neova', 10);
    const sqlServerName = `${randomName}-server`;
    const sqlServerDatabaseName = `${randomName}-database`;
    console.log("Creating SQL Server...");

    const serverParameters = {
      location: this.location,
      administratorLogin: this.adminLogin,
      administratorLoginPassword: this.adminPassword,
      version: '12.0'
    };

    const serverResponse = await this.client.servers.beginCreateOrUpdateAndWait(this.resourceGroupName, sqlServerName, serverParameters);
    console.log("SQL Server created:", serverResponse);

    this.connectionConfig.server = `${sqlServerName}.database.windows.net`;

    return { serverName: sqlServerName, serverId: serverResponse.id, sqlServerDatabaseName };
  }

  async createSqlDatabase(serverName, sqlServerDatabaseName) {
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

    const databaseResponse = await this.client.databases.beginCreateOrUpdateAndWait(this.resourceGroupName, serverName, sqlServerDatabaseName, databaseParameters);
    console.log("SQL Database created:", databaseResponse);

    this.connectionConfig.options.database = sqlServerDatabaseName;

    return { databaseName: sqlServerDatabaseName, databaseId: databaseResponse.id };
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
      // this.performDeletion();
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
      const createTableSql = fs.readFileSync(path.resolve(__dirname, '../../../utils/test_data/scripts/create_table.sql'), 'utf8');
      const insertDataSql = fs.readFileSync(path.resolve(__dirname, '../../../utils/test_data/scripts/insert_data.sql'), 'utf8');

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

  // async performDeletion() {
  //   try {
  //     // Read server name from JSON file
  //     const jsonData = fs.readFileSync(resultFilePath, 'utf8');
  //     const result = JSON.parse(jsonData);
  //     const { sqlServerName } = result;

  //     // Delete SQL Server using SqlServerDeleter instance
  //     await this.sqlServerDeleter.deleteSqlServer(sqlServerName);
  //   } catch (err) {
  //     console.error('Error performing deletion:', err.message);
  //   }
  // }

  async main() {
    try {
      const { serverName, serverId, sqlServerDatabaseName } = await this.createSqlServer();
      const { databaseName, databaseId } = await this.createSqlDatabase(serverName, sqlServerDatabaseName);
      await this.createFirewallRule(serverName);
      this.connectToDatabase();

      const result = {
        sqlServerName: serverName,
        sqlServerId: serverId,
        sqlDatabaseName: databaseName,
        sqlDatabaseId: databaseId
      };

      // Write result to JSON file
      fs.writeFileSync(resultFilePath, JSON.stringify(result, null, 2));
      console.log(`SQL server details saved to ${resultFilePath}`);
    } catch (err) {
      console.error("Error:", err);
    }
  }
}

const manager = new AzureSqlManager();
manager.main();
