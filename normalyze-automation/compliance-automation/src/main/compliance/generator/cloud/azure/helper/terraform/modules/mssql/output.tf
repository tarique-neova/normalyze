output "mssql_server_name" {
  value = azurerm_mssql_server.sql_server.name
}

output "mssql_fully_qualified_domain_name" {
  value = azurerm_mssql_server.sql_server.fully_qualified_domain_name
}

output "mssql_database_name" {
  value = azurerm_mssql_database.mssql_db.name
}

output "login_username" {
  value = azurerm_mssql_server.sql_server.administrator_login
}