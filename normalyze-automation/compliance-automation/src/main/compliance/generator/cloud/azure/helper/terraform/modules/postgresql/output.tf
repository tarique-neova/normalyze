output "pgsql_server_name" {
  value = azurerm_postgresql_server.pgsql_server.name
}

output "pgsql_database_name" {
  value = azurerm_postgresql_database.pgsql_db.name
}

output "login_username" {
  value = azurerm_postgresql_server.pgsql_server.administrator_login
}