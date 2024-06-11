variable "region" {
  description = "Region where the resource will be created"
  default     = "eastus"
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