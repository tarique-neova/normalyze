resource "azurerm_resource_group" "resource_group" {
  name     = data.external.random_value.result["value"]
  location = var.region
}

resource "azurerm_cosmosdb_account" "cosmosdb_account" {
  name                      = data.external.random_value.result["value"]
  location                  = azurerm_resource_group.resource_group.location
  resource_group_name       = azurerm_resource_group.resource_group.name
  offer_type                = "Standard"
  kind                      = "GlobalDocumentDB"
  enable_automatic_failover = false

  geo_location {
    location          = azurerm_resource_group.resource_group.location
    failover_priority = 0
  }

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 300
    max_staleness_prefix    = 100000
  }
}

resource "azurerm_cosmosdb_sql_database" "cosmo_sql_db" {
  name                = data.external.random_value.result["value"]
  account_name        = azurerm_cosmosdb_account.cosmosdb_account.name
  resource_group_name = azurerm_resource_group.resource_group.name
  throughput          = 400
}

resource "azurerm_cosmosdb_sql_container" "cosmo_sql_cont" {
  name                  = "Personal_Information"
  resource_group_name   = azurerm_resource_group.resource_group.name
  account_name          = azurerm_cosmosdb_account.cosmosdb_account.name
  database_name         = azurerm_cosmosdb_sql_database.cosmo_sql_db.name
  partition_key_path    = "/_partitionKey"
  partition_key_version = 1
  throughput            = 400

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }

    included_path {
      path = "/included/?"
    }

    excluded_path {
      path = "/excluded/?"
    }
  }

  unique_key {
    paths = ["/definition/idlong", "/definition/idshort"]
  }
}