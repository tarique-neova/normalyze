# resource "azurerm_resource_group" "resource_group" {
#   name     = data.external.random_value.result["value"]
#   location = var.region
# }
#
# resource "azurerm_user_assigned_identity" "user_identity" {
#   name                = data.external.random_value.result["value"]
#   location            = azurerm_resource_group.resource_group.location
#   resource_group_name = azurerm_resource_group.resource_group.name
# }
#
# resource "azurerm_mssql_server" "sql_server" {
#   name                          = data.external.random_value.result["value"]
#   resource_group_name           = azurerm_resource_group.resource_group.name
#   location                      = azurerm_resource_group.resource_group.location
#   version                       = "12.0"
#   administrator_login           = "neova-test"
#   administrator_login_password  = "Normalyze#12345"
#   minimum_tls_version           = "1.2"
#   public_network_access_enabled = true
#
#   azuread_administrator {
#     login_username = azurerm_user_assigned_identity.user_identity.name
#     object_id      = azurerm_user_assigned_identity.user_identity.principal_id
#   }
#
#   identity {
#     type = "UserAssigned"
#     identity_ids = [azurerm_user_assigned_identity.user_identity.id]
#   }
#
#   primary_user_assigned_identity_id = azurerm_user_assigned_identity.user_identity.id
# }
#
# resource "azurerm_mssql_firewall_rule" "my_ip_firewall_rule" {
#   name             = "allow_my_ip"
#   start_ip_address = data.external.current_ip.result["ip"]
#   end_ip_address   = data.external.current_ip.result["ip"]
#   server_id        = azurerm_mssql_server.sql_server.id
# }
#
# resource "azurerm_mssql_database" "mssql_db" {
#   name           = data.external.random_value.result["value"]
#   server_id      = azurerm_mssql_server.sql_server.id
#   collation      = "SQL_Latin1_General_CP1_CI_AS"
#   license_type   = "LicenseIncluded"
#   max_size_gb    = 250
#   read_scale     = false
#   sku_name       = "S0"
#   zone_redundant = false
#   tags = {
#     foo = "bar"
#   }
#   lifecycle {
#     prevent_destroy = false
#   }
# }
#
# resource "null_resource" "insert_data" {
#   provisioner "local-exec" {
#     command = "python3 scripts/connect_azure_mssql.py"
#   }
#   depends_on = [azurerm_mssql_database.mssql_db]
# }

module "azure_mssql_server" {
  source                           = "../../helper/terraform/modules/mssql"
  end_ip_address                   = data.external.workstation_ip.result["ip"]
  is_public_network_access_enabled = var.public_network_access_enabled
  login_password                   = var.login_password
  login_username                   = var.login_username
  minimum_tls_version              = var.minimum_tls_version
  mssql_collation                  = var.mssql_collation
  mssql_identity                   = var.mssql_identity
  mssql_license_type               = var.mssql_license_type
  mssql_max_size                   = var.mssql_max_size
  mssql_read_scale                 = var.mssql_read_scale
  mssql_sku                        = var.mssql_sku
  mssql_tag                        = var.mssql_tag
  mssql_version                    = var.mssql_version
  mssql_zone_redundant             = var.mssql_zone_redundant
  name                             = data.external.random_value.result["value"]
  region                           = var.region
  start_ip_address                 = data.external.workstation_ip.result["ip"]
}

resource "null_resource" "insert_data" {
  provisioner "local-exec" {
    command = "python3 ../../utils/scripts/sql/insert_data_in_mssql_db.py"
  }
  depends_on = [module.azure_mssql_server]
}