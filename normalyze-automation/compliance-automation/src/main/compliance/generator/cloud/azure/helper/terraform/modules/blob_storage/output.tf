output "blob_storage_account_name" {
  value = azurerm_storage_account.blob_storage_account.name
}

output "blob_container_name" {
  value = azurerm_storage_blob.blob.name
}