output "database_name" {
  value = module.azure_mssql_server.mssql_database_name
}

output "mssql_fully_qualified_domain_name" {
  value = module.azure_mssql_server.mssql_fully_qualified_domain_name
}

output "mssql_server_name" {
  value = module.azure_mssql_server.mssql_server_name
}

output "login_username" {
  value = module.azure_mssql_server.login_username
}

output "blob_container_name" {
  value = module.blob_container.blob_container_name
}

output "blob_storage_account_name" {
  value = module.blob_container.blob_storage_account_name
}

output "data_lake_storage_account_name" {
  value = module.data_lake_container.data_lake_storage_account_name
}
