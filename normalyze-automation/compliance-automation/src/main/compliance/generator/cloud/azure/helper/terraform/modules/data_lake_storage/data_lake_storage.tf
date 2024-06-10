resource "azurerm_resource_group" "resource_group" {
  name     = var.name
  location = var.region
}

resource "azurerm_storage_account" "data_lake_account" {
  name                     = var.name
  resource_group_name      = azurerm_resource_group.resource_group.name
  location                 = var.region
  account_tier             = var.account_tier
  account_replication_type = var.account_replication_type
  is_hns_enabled           = true
}

resource "azurerm_storage_data_lake_gen2_filesystem" "data_lake_filesystem" {
  name               = var.name
  storage_account_id = azurerm_storage_account.data_lake_account.id
}

resource "azurerm_storage_blob" "upload_data" {
  name                   = "personal_information.csv"
  storage_account_name   = azurerm_storage_account.data_lake_account.name
  storage_container_name = azurerm_storage_data_lake_gen2_filesystem.data_lake_filesystem.name
  type                   = var.blob_type
  source                 = var.file_location
}
