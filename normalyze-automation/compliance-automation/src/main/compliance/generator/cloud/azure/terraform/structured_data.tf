# resource "time_static" "current_time" {}
#
# resource "azurerm_resource_group" "resource_group" {
#   name = replace(replace(local.customized_name, " ", ""), "-", "")
#   location = var.region
# }
#
# resource "azurerm_user_assigned_identity" "user_identity" {
#   name = replace(replace(local.customized_name, " ", ""), "-", "")
#   location            = azurerm_resource_group.resource_group.location
#   resource_group_name = azurerm_resource_group.resource_group.name
# }
#
# resource "azurerm_mssql_server" "sql_server" {
#   name = replace(replace(local.customized_name, " ", ""), "-", "")
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
# resource "azurerm_mssql_firewall_rule" "firewall_rule" {
#   name             = "allow_access_to_sql_server"
#   start_ip_address = "0.0.0.0"
#   end_ip_address   = "0.0.0.0"
#   server_id        = azurerm_mssql_server.sql_server.id
# }
#
# resource "azurerm_mssql_firewall_rule" "my_ip_firewall_rule" {
#   name             = "allow_my_ip"
#   start_ip_address = "122.177.21.62"
#   end_ip_address   = "122.177.21.62"
#   server_id        = azurerm_mssql_server.sql_server.id
# }
#
# resource "null_resource" "wait_for_sql" {
#   depends_on = [azurerm_mssql_firewall_rule.my_ip_firewall_rule]
#
#   provisioner "local-exec" {
#     command = "sleep 300"
#   }
# }
#
# resource "azurerm_mssql_database" "mssql_db" {
#   depends_on = [null_resource.wait_for_sql]
#   name = replace(replace(local.customized_name, " ", ""), "-", "")
#   server_id      = azurerm_mssql_server.sql_server.id
#   collation      = "SQL_Latin1_General_CP1_CI_AS"
#   license_type   = "LicenseIncluded"
#   max_size_gb    = 250
#   read_scale     = false
#   sku_name       = "S0"
#   zone_redundant = false
#
#   tags = {
#     foo = "bar"
#   }
#
#   # prevent the possibility of accidental data loss
#   lifecycle {
#     prevent_destroy = false
#   }
# }
#
# data "template_file" "sql_script" {
#   template = file("data.sql")
#
#   vars = {
#     database_name = azurerm_mssql_database.mssql_db.name
#   }
# }
#
# resource "null_resource" "insert_data" {
#   provisioner "local-exec" {
#     command = <<EOT
#       sqlcmd -S ${azurerm_mssql_server.sql_server.fully_qualified_domain_name} -U ${azurerm_mssql_server.sql_server.administrator_login} -P ${azurerm_mssql_server.sql_server.administrator_login_password} -d ${azurerm_mssql_database.mssql_db.name} -i data.sql
#     EOT
#   }
#
#   depends_on = [azurerm_mssql_database.mssql_db]
# }
#
# # resource "azurerm_key_vault" "key_vault" {
# #   name = replace(replace(local.customized_name, " ", ""), "-", "")
# #   location                    = azurerm_resource_group.resource_group.location
# #   resource_group_name         = azurerm_resource_group.resource_group.name
# #   enabled_for_disk_encryption = true
# #   tenant_id                   = azurerm_user_assigned_identity.user_identity.tenant_id
# #   soft_delete_retention_days  = 7
# #   purge_protection_enabled    = false
# #
# #   sku_name = "standard"
# #
# #   access_policy {
# #     tenant_id = data.azurerm_client_config.current.tenant_id
# #     object_id = data.azurerm_client_config.current.object_id
# #
# #     key_permissions = ["Get", "List", "Create", "Delete", "Update", "Recover", "Purge"]
# #   }
# #
# #   access_policy {
# #     tenant_id = azurerm_user_assigned_identity.user_identity.tenant_id
# #     object_id = azurerm_user_assigned_identity.user_identity.principal_id
# #
# #     key_permissions = ["Get", "WrapKey", "UnwrapKey"]
# #   }
# # }
#
# # resource "azurerm_key_vault_key" "kv_key" {
# #   depends_on = [azurerm_key_vault.key_vault]
# #
# #   name = replace(replace(local.customized_name, " ", ""), "-", "")
# #   key_vault_id = azurerm_key_vault.key_vault.id
# #   key_type     = "RSA"
# #   key_size     = 2048
# #
# #   key_opts = ["unwrapKey", "wrapKey"]
# # }
#
# # resource "null_resource" "insert_data" {
# #   provisioner "local-exec" {
# #     command = "python3 data.py"
# #   }
# #   depends_on = [azurerm_mssql_server.sql_server]
# # }