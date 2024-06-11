resource "azurerm_resource_group" "resource_group" {
  name     = var.name
  location = var.region
}

resource "azurerm_storage_account" "blob_storage_account" {
  name                     = var.name
  resource_group_name      = azurerm_resource_group.resource_group.name
  location                 = azurerm_resource_group.resource_group.location
  account_tier             = var.account_tier
  account_replication_type = var.account_replication_type
}

resource "azurerm_storage_container" "blob_container" {
  name                  = var.name
  storage_account_name  = azurerm_storage_account.blob_storage_account.name
  container_access_type = var.container_access_type
}

resource "azurerm_storage_blob" "blob" {
  name                   = "unstructured_blob_data"
  storage_account_name   = azurerm_storage_account.blob_storage_account.name
  storage_container_name = azurerm_storage_container.blob_container.name
  type                   = var.blob_type
  source_content         = file(var.file_location)
}
