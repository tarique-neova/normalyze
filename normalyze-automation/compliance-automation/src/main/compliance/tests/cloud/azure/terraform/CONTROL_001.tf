resource "time_static" "current_time" {}

# resource "azurerm_storage_account" "storage-account" {
#   name                      = replace(replace("${local.customized_name}", " ", ""), "-", "")
#   resource_group_name       = var.resource_group
#   location                  = var.region
#   account_tier              = "Standard"
#   account_replication_type  = "GRS"
#   enable_https_traffic_only = true

#   tags = {
#     environment = "staging"
#   }
# }

module "azurerm_storage_account" {
  source                    = "../common/terraform/modules"
  name                      = replace(replace(local.customized_name, " ", ""), "-", "")
  resource_group            = var.resource_group
  region                    = var.region
  account_tier              = var.account_tier
  account_replication_type  = var.account_replication_type
  enable_https_traffic_only = var.enable_https_traffic_only
  environment               = var.environment
}
