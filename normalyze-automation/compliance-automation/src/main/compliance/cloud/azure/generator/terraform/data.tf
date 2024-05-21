data "azurerm_client_config" "current" {
}

# # Data retrieval from Key Vault
# data "azurerm_key_vault" "kv" {
#   name                = "tsalat"
#   resource_group_name = "tsalat-test"
# }

# data "azurerm_key_vault_secret" "subscription_id" {
#   name         = "subscription-id"
#   key_vault_id = data.azurerm_key_vault.kv.id
# }

# data "azurerm_key_vault_secret" "client_id" {
#   name         = "client-id"
#   key_vault_id = data.azurerm_key_vault.kv.id
# }

# data "azurerm_key_vault_secret" "client_secret" {
#   name         = "client-secret"
#   key_vault_id = data.azurerm_key_vault.kv.id
# }

# data "azurerm_key_vault_secret" "tenant_id" {
#   name         = "tenant-id"
#   key_vault_id = data.azurerm_key_vault.kv.id
# }
