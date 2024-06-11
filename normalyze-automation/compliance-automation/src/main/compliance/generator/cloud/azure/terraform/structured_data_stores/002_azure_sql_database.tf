# resource "azurerm_resource_group" "resource_group" {
#   name     = data.external.random_value.result["value"]
#   location = var.region
# }
#
# resource "azurerm_sql_server" "sql_server" {
#   name                         = data.external.random_value.result["value"]
#   resource_group_name          = azurerm_resource_group.resource_group.name
#   location                     = azurerm_resource_group.resource_group.location
#   version                      = "12.0"
#   administrator_login          = var.login_username
#   administrator_login_password = var.login_password
# }
#
# resource "azurerm_sql_database" "sql_db" {
#   name                = data.external.random_value.result["value"]
#   resource_group_name = azurerm_resource_group.resource_group.name
#   location            = azurerm_resource_group.resource_group.location
#   server_name         = azurerm_sql_server.sql_server.name
#   requested_service_objective_name = "S0"
# }
#
# resource "azurerm_sql_firewall_rule" "example" {
#   name                = "Client Workstation IP"
#   resource_group_name = azurerm_resource_group.resource_group.name
#   server_name         = azurerm_sql_server.sql_server.name
#   start_ip_address    = data.external.workstation_ip.result["ip"]
#   end_ip_address      = data.external.workstation_ip.result["ip"]
# }
