# resource "time_static" "current_time" {}
#
# # resource "azurerm_resource_group" "example" {
# #   name     = replace(replace(local.customized_name, " ", ""), "-", "")
# #   location = var.region
# # }
#
# resource "azurerm_storage_account" "example" {
#   name                     = replace(replace(local.customized_name, " ", ""), "-", "")
#   resource_group_name      = var.resource_group
#   location                 = var.region
#   account_tier             = "Standard"
#   account_replication_type = "LRS"
#   is_hns_enabled           = true
# }
#
# resource "azurerm_storage_data_lake_gen2_filesystem" "example" {
#   name               = replace(replace(local.customized_name, " ", ""), "-", "")
#   storage_account_id = azurerm_storage_account.example.id
# }
#
# # resource "azurerm_storage_data_lake_gen2_path" "example" {
# #   path               = "personal_information.csv"
# #   filesystem_name    = azurerm_storage_data_lake_gen2_filesystem.example.name
# #   storage_account_id = azurerm_storage_account.example.id
# #   resource           = "directory"
# # }
#
# resource "azurerm_storage_blob" "upload_csv" {
#   name                   = "personal_information.csv"
#   storage_account_name   = azurerm_storage_account.example.name
#   storage_container_name = azurerm_storage_data_lake_gen2_filesystem.example.name
#   type                   = "Block"
#   source                 = "files/personal_information.csv"
# }

# module "data_lake_container" {
#   source                   = "../../helper/terraform/modules/data_lake_storage"
#   account_replication_type = var.blob_account_replication_type
#   account_tier             = var.blob_account_tier
#   blob_type                = var.blob_type
#   file_location            = var.personal_data_file_path
#   name                     = "${data.external.random_value.result["value"]}dl"
#   region                   = var.region
# }