resource "azurerm_resource_group" "resource_group" {
  name     = "${data.external.random_value.result["value"]}queue"
  location = var.region
}

module "storage_account" {
  source                    = "../../helper/terraform/modules/storage_account"
  account_replication_type  = var.account_replication_type
  account_tier              = var.account_tier
  enable_https_traffic_only = var.enable_https_traffic_only
  environment               = var.environment
  name                      = data.external.random_value.result["value"]
  region                    = azurerm_resource_group.resource_group.location
  resource_group            = azurerm_resource_group.resource_group.name
}

resource "azurerm_storage_queue" "queue" {
  name                 = "testqueue"
  storage_account_name = module.storage_account.storage_account_name
}

resource "null_resource" "login_to_azure" {
  provisioner "local-exec" {
    command = "az login --service-principal -u 1a33955b-7df1-4dd6-8cb5-c887254391e0 -p LdV8Q~vtXp-Tp3vDky-23UOZxE4MiX9Skbn52beH --tenant 4a67a577-1e6a-4fe4-80c7-128ade4e55b1"
  }
  depends_on = [azurerm_storage_queue.queue]
}

resource "null_resource" "put_message_in_queue" {
  provisioner "local-exec" {
    command = <<EOT
sh -c 'export AZURE_STORAGE_CONNECTION_STRING="${module.storage_account.storage_connection_string}" && az storage message put --queue-name ${azurerm_storage_queue.queue.name} --content "$(jq -c . < personal_data.json)"'
EOT
  }
  depends_on = [null_resource.login_to_azure]
}
