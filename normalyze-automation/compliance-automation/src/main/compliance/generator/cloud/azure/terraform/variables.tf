variable "key_vault_name" {
  type        = string
  default = "test-001" # 'agent-automation-per-workspace' workspace. This workspace is PER enabled.
  description = "Name of the ley vault"
}

variable "name_prefix" {
  type        = string
  default = "neova-auto" # 'agent-automation-per-workspace' workspace. This workspace is PER enabled.
  description = "Prefix to be used against each resource while creation"
}

variable "current_timestamp_for_debugging" {
  description = "Timestamp to use (when not empty) instead of current timestamp(). Used when debugging to avoid changes related to current time, e.g set in the future: 2022-05-13T07:44:12Z"
  default     = ""
}

variable "resource_name" {
  description = "Name of the resource to be created"
  default     = "test"
}

variable "region" {
  description = "Region where the resource will be created"
  default     = "eastus"
}

variable "resource_group" {
  description = "Resource group name"
  default     = "tsalat-test"
}

variable "account_tier" {
  description = "Resource group name"
  default     = "Standard"
}

variable "account_replication_type" {
  description = "Resource group name"
  default     = "GRS"
}

variable "enable_https_traffic_only" {
  description = "Resource group name"
  default     = true
}

variable "environment" {
  description = "Resource group name"
  default     = "staging"
}

variable "mssql_version" {
  description = "Version of MSSQL Server"
  type        = string
  default     = "12.0"
}

variable "login_username" {
  description = "Login username for mssql server"
  type        = string
  default     = "neova-test"
}

variable "login_password" {
  description = "Login password for mssql server"
  type        = string
  default     = "Normalyze#12345"
}

variable "minimum_tls_version" {
  description = "Minimum TLS version of mssql server"
  type        = string
  default     = "1.2"
}

variable "is_public_network_access_enabled" {
  description = "Does public access needs to be enabled?"
  type        = bool
  default     = true
}

variable "mssql_identity" {
  description = "Identity Type for mssql server"
  type        = string
  default     = "UserAssigned"
}

variable "mssql_collation" {
  description = "Collation type of mssql database"
  type        = string
  default     = "SQL_Latin1_General_CP1_CI_AS"
}

variable "mssql_license_type" {
  description = "License type of mssql database"
  type        = string
  default     = "LicenseIncluded"
}

variable "mssql_max_size" {
  description = "Max size of mssql database"
  type        = string
  default     = 250
}

variable "mssql_read_scale" {
  description = "mssql database read scale"
  type        = bool
  default     = false
}

variable "mssql_sku" {
  description = "Sku name of mssql database"
  type        = string
  default     = "S0"
}

variable "mssql_zone_redundant" {
  description = "Does mssql database needs to be zone redundant?"
  type        = bool
  default     = false
}

variable "public_network_access_enabled" {
  description = "Does mssql database needs to be publicly enabled?"
  type        = bool
  default     = true
}

variable "mssql_tag" {
  description = "Tag name of mssql database"
  type        = string
  default     = "bar"
}

variable "blob_account_replication_type" {
  type        = string
  default     = "LRS"
}

variable "blob_account_tier" {
  type        = string
  default     = "Standard"
}

variable "blob_type" {
  type        = string
  default     = "Block"
}

variable "blob_container_access_type" {
  type        = string
  default     = "private"
}

variable "personal_data_file_path" {
  type        = string
  default     = "files/personal_information.csv"
}