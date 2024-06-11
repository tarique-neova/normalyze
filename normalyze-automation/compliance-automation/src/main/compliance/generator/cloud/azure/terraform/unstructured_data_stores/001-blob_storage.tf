# resource "time_static" "current_time" {}
#
# resource "azurerm_resource_group" "resource_group" {
#   name     = replace(replace(local.customized_name, " ", ""), "-", "")
#   location = "West Europe"
# }
#
# resource "azurerm_storage_account" "storage_account" {
#   name                     = replace(replace(local.customized_name, " ", ""), "-", "")
#   resource_group_name      = azurerm_resource_group.resource_group.name
#   location                 = azurerm_resource_group.resource_group.location
#   account_tier             = "Standard"
#   account_replication_type = "LRS"
# }
#
# resource "azurerm_storage_container" "storage_container" {
#   name                  = replace(replace(local.customized_name, " ", ""), "-", "")
#   storage_account_name  = azurerm_storage_account.storage_account.name
#   container_access_type = "private"
# }
#
# resource "azurerm_storage_blob" "blob" {
#   name                   = "personal_information.csv"
#   storage_account_name   = azurerm_storage_account.storage_account.name
#   storage_container_name = azurerm_storage_container.storage_container.name
#   type                   = "Block"
#   source_content         = file("files/personal_information.csv")
# }

module "blob_container" {
  source                   = "../../helper/terraform/modules/blob_storage"
  account_replication_type = var.blob_account_replication_type
  account_tier             = var.blob_account_tier
  blob_type                = var.blob_type
  container_access_type    = var.blob_container_access_type
  file_location            = var.personal_data_file_path
  name                     = "${data.external.random_value.result["value"]}blob"
  region                   = var.region
}
