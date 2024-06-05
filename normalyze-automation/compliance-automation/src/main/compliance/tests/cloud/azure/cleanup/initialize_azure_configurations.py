import json
from azure.identity import ClientSecretCredential
from azure.mgmt.storage import StorageManagementClient


class InitializeAzureConfigurations:
    def __init__(self, credentials_file_path):
        self.credentials_file_path = credentials_file_path
        self.credential = None
        self.client = None

    def authenticate(self):
        with open(self.credentials_file_path, "r") as f:
            credentials = json.load(f)
            subscription_id = credentials["subscriptionId"]
            tenant_id = credentials["tenantId"]
            client_id = credentials["clientId"]
            client_secret = credentials["clientSecret"]

        self.credential = ClientSecretCredential(
            tenant_id=tenant_id,
            client_id=client_id,
            client_secret=client_secret
        )
        self.client = StorageManagementClient(self.credential, subscription_id)
        print("Authentication successful")

    def get_client(self):
        if self.client is None:
            raise Exception("Client not initialized. Call authenticate() first.")
        return self.client
