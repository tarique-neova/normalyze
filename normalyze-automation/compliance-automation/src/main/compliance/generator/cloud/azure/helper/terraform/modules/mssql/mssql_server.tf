resource "azurerm_resource_group" "resource_group" {
  name     = var.name
  location = var.region
}

resource "azurerm_user_assigned_identity" "user_identity" {
  name                = var.name
  location            = azurerm_resource_group.resource_group.location
  resource_group_name = azurerm_resource_group.resource_group.name
}

resource "azurerm_mssql_server" "sql_server" {
  name                          = var.name
  resource_group_name           = azurerm_resource_group.resource_group.name
  location                      = azurerm_resource_group.resource_group.location
  version                       = var.mssql_version
  administrator_login           = var.login_username
  administrator_login_password  = var.login_password
  minimum_tls_version           = var.minimum_tls_version
  public_network_access_enabled = var.is_public_network_access_enabled

  azuread_administrator {
    login_username = azurerm_user_assigned_identity.user_identity.name
    object_id      = azurerm_user_assigned_identity.user_identity.principal_id
  }

  identity {
    type = var.mssql_identity
    identity_ids = [azurerm_user_assigned_identity.user_identity.id]
  }

  primary_user_assigned_identity_id = azurerm_user_assigned_identity.user_identity.id
}

resource "azurerm_mssql_firewall_rule" "my_ip_firewall_rule" {
  name             = "Client Workstation IP"
  start_ip_address = var.start_ip_address
  end_ip_address   = var.end_ip_address
  server_id        = azurerm_mssql_server.sql_server.id
}

resource "azurerm_mssql_database" "mssql_db" {
  name           = var.name
  server_id      = azurerm_mssql_server.sql_server.id
  collation      = var.mssql_collation
  license_type   = var.mssql_license_type
  max_size_gb    = var.mssql_max_size
  read_scale     = var.mssql_read_scale
  sku_name       = var.mssql_sku
  zone_redundant = var.mssql_zone_redundant
  tags = {
    foo = var.mssql_tag
  }
  lifecycle {
    prevent_destroy = false
  }
}

resource "null_resource" "insert_data" {
  provisioner "local-exec" {
    command = "python3 scripts/connect_azure_mssql.py"
  }
  depends_on = [azurerm_mssql_database.mssql_db]
}