
resource "azurerm_storage_account" "storage-account" {
  name                      = var.name
  resource_group_name       = var.resource_group
  location                  = var.region
  account_tier              = var.account_tier
  account_replication_type  = var.account_replication_type
  enable_https_traffic_only = var.enable_https_traffic_only

  tags = {
    environment = var.environment
  }
}