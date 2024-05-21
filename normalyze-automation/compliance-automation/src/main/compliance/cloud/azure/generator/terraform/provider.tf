terraform {
  required_version = ">=1.3.0"

  required_providers {
    sops = {
      source  = "carlpett/sops"
      version = "~> 0.5"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"
    }
  }
}


# Provider configuration for Azure resources
provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy    = true
      recover_soft_deleted_key_vaults = true
    }
  }

  client_id       = "CLIENT_ID"
  client_secret   = "CLIENT_SECRET"
  tenant_id       = "TENANT_ID"
  subscription_id = "SUBSCRIPTION_ID"
}
