import json
import uuid
import re
from azure.identity import AzureCliCredential
from azure.mgmt.cosmosdb import CosmosDBManagementClient
from azure.cosmos import CosmosClient, exceptions


def create_cosmos_db_client(endpoint, key):
    try:
        client = CosmosClient(endpoint, key)
        print("Connected to Azure Cosmos DB")
        return client
    except exceptions.CosmosHttpResponseError as e:
        raise ConnectionError(f"Unable to connect to the database: {e}")


def insert_data(container, data):
    for item in data:
        item_id = str(uuid.uuid4())  # Generate a unique ID for each document
        item['id'] = item_id  # Assign the unique ID to the document
        try:
            container.create_item(body=item)
            print(f"Inserted item with ID: {item_id}")
        except exceptions.CosmosHttpResponseError as e:
            print(f"Failed to insert item {item_id}: {e}")
            continue


class CosmosDBHandler:
    def __init__(self, azure_config, subscription_id):
        self.client = azure_config.get_client()
        self.subscription_id = subscription_id
        self.credential = AzureCliCredential()

    def get_cosmos_db_credentials(self, resource_group_name, account_name):
        try:
            cosmosdb_client = CosmosDBManagementClient(self.credential, self.subscription_id)
            keys = cosmosdb_client.database_accounts.list_keys(resource_group_name, account_name)
            endpoint = cosmosdb_client.database_accounts.get(resource_group_name, account_name).document_endpoint
            return endpoint, keys.primary_master_key
        except exceptions.CosmosHttpResponseError as e:
            raise ConnectionError(f"Failed to get Cosmos DB credentials: {e}")


def get_random_value():
    try:
        with open("random_value.txt", "r") as file:
            random_value_dict = json.load(file)
        return random_value_dict.get("value", "")
    except FileNotFoundError:
        print("Error: random_value.txt file not found.")
        return ""
    except json.JSONDecodeError:
        print("Error: Unable to decode JSON from random_value.txt.")
        return ""


def parse_sql_insert_statements(sql):
    insert_regex = re.compile(
        r"INSERT INTO Personal_Information \((.*?)\) VALUES\s*(\(.*?\));", re.IGNORECASE | re.DOTALL
    )
    matches = insert_regex.findall(sql)

    if not matches:
        print("No matches found in the SQL file. Please check the format of your SQL insert statements.")
        return []

    columns = [col.strip() for col in matches[0][0].split(",")]
    values_list = [re.findall(r'\((.*?)\)', values.replace("\n", "")) for _, values in matches]

    data = []
    for values_group in values_list:
        for values in values_group:
            values = [val.strip().strip("'") for val in values.split(",")]
            item = dict(zip(columns, values))
            data.append(item)

    return data


def main():
    random_value = get_random_value()
    if not random_value:
        print("Failed to retrieve random value.")
        return

    resource_group_name = random_value
    account_name = random_value

    credentials_file_path = "../../../../../../../../../data/compliance/cloud/azure/AZURECredentials.json"
    azure_config = InitializeAzureConfigurations(credentials_file_path)
    azure_config.authenticate()

    subscription_id = 'eb6118df-a08f-4b53-9815-945e78e01aa6'

    cosmos_db_handler = CosmosDBHandler(azure_config, subscription_id)

    try:
        endpoint, primary_master_key = cosmos_db_handler.get_cosmos_db_credentials(resource_group_name, account_name)
    except ConnectionError as e:
        print(e)
        return

    client = create_cosmos_db_client(endpoint, primary_master_key)

    database_name = random_value
    container_name = "Personal_Information"

    try:
        database = client.get_database_client(database_name)
        container = database.get_container_client(container_name)
    except exceptions.CosmosHttpResponseError as e:
        print(f"Failed to get database or container client: {e}")
        return

    try:
        with open('insert_personal_info_data.sql', 'r') as insert_data_file:
            insert_data_sql = insert_data_file.read()
    except FileNotFoundError:
        print("Error: SQL file not found.")
        return
    except IOError as e:
        print(f"Error reading SQL file: {e}")
        return

    data = parse_sql_insert_statements(insert_data_sql)

    if data:
        print("Parsed data:\n", data)
        insert_data(container, data)
    else:
        print("No data to insert.")


if __name__ == "__main__":
    main()
