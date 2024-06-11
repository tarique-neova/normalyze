resource "azurerm_resource_group" "resource_group" {
  name     = var.name
  location = var.region
}

resource "azurerm_postgresql_server" "pgsql_server" {
  name                             = var.name
  location                         = azurerm_resource_group.resource_group.location
  resource_group_name              = azurerm_resource_group.resource_group.name
  administrator_login              = var.pgsql_login_username
  administrator_login_password     = var.login_password
  sku_name                         = var.pgsql_sku
  version                          = var.pgsql_version
  storage_mb                       = var.pgsql_storage
  backup_retention_days            = var.pgsql_backup_retention_days
  geo_redundant_backup_enabled     = var.pgsql_geo_redundant_backup_enabled
  auto_grow_enabled                = var.pgsql_auto_grow_enabled
  public_network_access_enabled    = var.pgsql_public_network_access_enabled
  ssl_enforcement_enabled          = var.pgsql_ssl_enforcement_enabled
  ssl_minimal_tls_version_enforced = var.pgsql_ssl_minimal_tls_version_enforced
}

resource "azurerm_postgresql_database" "pgsql_db" {
  name                = var.name
  resource_group_name = azurerm_resource_group.resource_group.name
  server_name         = azurerm_postgresql_server.pgsql_server.name
  charset             = var.pgsql_charset
  collation           = var.pgsql_collation
  lifecycle {
    prevent_destroy = false
  }
}

resource "azurerm_postgresql_firewall_rule" "example" {
  name                = "Client-Workstation-IP"
  resource_group_name = azurerm_resource_group.resource_group.name
  server_name         = azurerm_postgresql_server.pgsql_server.name
  start_ip_address    = var.start_ip_address
  end_ip_address      = var.end_ip_address

  depends_on = [azurerm_postgresql_server.pgsql_server]
}