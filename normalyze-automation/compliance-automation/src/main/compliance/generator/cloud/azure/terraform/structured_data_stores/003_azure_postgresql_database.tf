# resource "azurerm_resource_group" "resource_group" {
#   name     = data.external.random_value.result["value"]
#   location = var.region
# }
#
# resource "azurerm_postgresql_server" "pgsql_server" {
#   name                = data.external.random_value.result["value"]
#   location            = azurerm_resource_group.resource_group.location
#   resource_group_name = azurerm_resource_group.resource_group.name
#   administrator_login          = "neovatest"
#   administrator_login_password = var.login_password
#   sku_name   = "GP_Gen5_4"
#   version    = "11"
#   storage_mb = 640000
#   backup_retention_days        = 7
#   geo_redundant_backup_enabled = true
#   auto_grow_enabled            = true
#   public_network_access_enabled    = true
#   ssl_enforcement_enabled          = true
#   ssl_minimal_tls_version_enforced = "TLS1_2"
# }
#
# resource "azurerm_postgresql_database" "pgsql_db" {
#   name                = data.external.random_value.result["value"]
#   resource_group_name = azurerm_resource_group.resource_group.name
#   server_name         = azurerm_postgresql_server.pgsql_server.name
#   charset             = "UTF8"
#   collation           = "English_United States.1252"
#   lifecycle {
#     prevent_destroy = false
#   }
# }
#
# resource "azurerm_postgresql_firewall_rule" "example" {
#   name                = "Client-Workstation-IP"
#   resource_group_name = azurerm_resource_group.resource_group.name
#   server_name         = azurerm_postgresql_server.pgsql_server.name
#   start_ip_address    = data.external.workstation_ip.result["ip"]
#   end_ip_address      = data.external.workstation_ip.result["ip"]
#
#   depends_on = [azurerm_postgresql_server.pgsql_server]
# }

# module "azure_postgresql_server" {
#   source                                 = "../../helper/terraform/modules/postgresql"
#   end_ip_address                         = data.external.workstation_ip.result["ip"]
#   login_password                         = var.login_password
#   minimum_tls_version                    = var.pgsql_minimum_tls_version
#   name                                   = data.external.random_value.result["value"]
#   pgsql_auto_grow_enabled                = var.pgsql_auto_grow_enabled
#   pgsql_backup_retention_days            = var.pgsql_backup_retention_days
#   pgsql_charset                          = var.pgsql_charset
#   pgsql_collation                        = var.pgsql_collation
#   pgsql_geo_redundant_backup_enabled     = var.pgsql_geo_redundant_backup_enabled
#   pgsql_login_username                   = var.pgsql_login_username
#   pgsql_public_network_access_enabled    = var.pgsql_public_network_access_enabled
#   pgsql_sku                              = var.pgsql_sku
#   pgsql_ssl_enforcement_enabled          = var.pgsql_ssl_enforcement_enabled
#   pgsql_ssl_minimal_tls_version_enforced = var.pgsql_minimum_tls_version
#   pgsql_storage                          = var.pgsql_storage
#   pgsql_version                          = var.pgsql_version
#   region                                 = var.region
#   start_ip_address                       = data.external.workstation_ip.result["ip"]
# }
#
# resource "null_resource" "insert_data" {
#   provisioner "local-exec" {
#     command = "python3 ../../utils/scripts/sql/test_insert_data_in_postgresql_db.py"
#   }
#   depends_on = [module.azure_postgresql_server]
# }