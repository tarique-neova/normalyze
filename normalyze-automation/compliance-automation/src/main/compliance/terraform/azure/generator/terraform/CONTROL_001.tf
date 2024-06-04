resource "time_static" "current_time" {}

resource "azurerm_storage_account" "storage-account" {
  name                      = replace(replace("${local.customized_name}", " ", ""), "-", "")
  resource_group_name       = var.resource_group
  location                  = var.region
  account_tier              = "Standard"
  account_replication_type  = "GRS"
  enable_https_traffic_only = true

  tags = {
    environment = "staging"
  }
}