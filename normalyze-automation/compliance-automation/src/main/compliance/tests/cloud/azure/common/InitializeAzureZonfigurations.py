# InitializeAzureZonfigurations.py
import os
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

class InitializeAzureZonfigurations:
    def __init__(self):
        self.credential = DefaultAzureCredential()
        self.blob_service_client = BlobServiceClient(account_url="https://neovaauto20240604143238.blob.core.windows.net", credential=self.credential)

    def get_credential(self):
        return self.credential