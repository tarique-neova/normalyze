resource "time_static" "current_time" {}

# resource "azurerm_resource_group" "example" {
#   name     = replace(replace(local.customized_name, " ", ""), "-", "")
#   location = var.region
# }

resource "azurerm_storage_account" "example" {
  name                     = replace(replace(local.customized_name, " ", ""), "-", "")
  resource_group_name      = var.resource_group
  location                 = var.region
  account_tier             = "Standard"
  account_replication_type = "LRS"
  is_hns_enabled           = true
}

resource "azurerm_storage_data_lake_gen2_filesystem" "example" {
  name               = replace(replace(local.customized_name, " ", ""), "-", "")
  storage_account_id = azurerm_storage_account.example.id
}

resource "azurerm_storage_data_lake_gen2_path" "example" {
  path               = "personal_information.csv"
  filesystem_name    = azurerm_storage_data_lake_gen2_filesystem.example.name
  storage_account_id = azurerm_storage_account.example.id
  resource           = "directory"
}

resource "azurerm_storage_blob" "upload_csv" {
  name                   = "personal_information_new0.csv"
  storage_account_name   = azurerm_storage_account.example.name
  storage_container_name = azurerm_storage_data_lake_gen2_filesystem.example.name
  type                   = "Block"
  source                 = "personal_information.csv"
}
