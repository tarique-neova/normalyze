import pytest
from initialize_azure_configurations import InitializeAzureConfigurations


class Cleanup:
    def __init__(self, azure_config):
        self.client = azure_config.get_client()

    def delete_storage_account(self, resource_group_name, storage_account_name):
        try:
            print(
                f"Deleting storage account: '{storage_account_name}' in resource group: {resource_group_name}")
            self.client.storage_accounts.delete(
                resource_group_name, storage_account_name
            )
            print(f"Storage account: '{storage_account_name}' deleted successfully.")
        except Exception as e:
            print(f"Failed to delete storage account: '{storage_account_name}'. Error: {str(e)}")

    def delete_storage_accounts_with_prefix(self, resource_group_name, prefix):
        print(f"Listing storage accounts in resource group: {resource_group_name}")
        storage_accounts = list(self.client.storage_accounts.list_by_resource_group(resource_group_name))

        if not storage_accounts:
            print("No storage accounts present.")
            return

        matching_accounts = [account.name for account in storage_accounts if account.name.startswith(prefix)]

        if not matching_accounts:
            print("No storage accounts with the specified prefix present.")
            return

        for account_name in matching_accounts:
            self.delete_storage_account(resource_group_name, account_name)


@pytest.mark.clean_azure_storage_account
def test_delete_storage_accounts_with_prefix():
    resource_group_name = "tsalat-test"
    prefix = "neovaauto"
    credentials_file_path = "../../../../../../../data/compliance/cloud/azure/AZURECredentials.json"

    # Initialize and authenticate
    azure_config = InitializeAzureConfigurations(credentials_file_path)
    azure_config.authenticate()

    # Cleanup and delete storage accounts with the specified prefix
    cleanup = Cleanup(azure_config)
    cleanup.delete_storage_accounts_with_prefix(resource_group_name, prefix)
