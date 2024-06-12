output "storage_account_name" {
  value = azurerm_storage_account.storage-account.name
}

output "storage_connection_string" {
  value = azurerm_storage_account.storage-account.primary_connection_string
}