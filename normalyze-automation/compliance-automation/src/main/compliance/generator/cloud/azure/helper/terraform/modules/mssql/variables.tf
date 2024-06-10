variable "name" {
  description = "The name of the storage account"
  type        = string
}

variable "region" {
  description = "The region where the resource will be created"
  type        = string
}

variable "mssql_version" {
  description = "Version of MSSQL Server"
  type        = string
}

variable "login_username" {
  description = "Login username for mssql server"
  type        = string
}

variable "login_password" {
  description = "Login password for mssql server"
  type        = string
}

variable "minimum_tls_version" {
  description = "Minimum TLS version of mssql server"
  type        = string
}

variable "is_public_network_access_enabled" {
  description = "Does public access needs to be enabled?"
  type        = bool
}

variable "mssql_identity" {
  description = "Identity Type for mssql server"
  type        = string
}

variable "start_ip_address" {
  description = "Start IP address for mssql firewall rule"
  type        = string
}

variable "end_ip_address" {
  description = "End IP address for mssql firewall rule"
  type        = string
}

variable "mssql_collation" {
  description = "Collation type of mssql database"
  type        = string
}

variable "mssql_license_type" {
  description = "License type of mssql database"
  type        = string
}

variable "mssql_max_size" {
  description = "Max size of mssql database"
  type        = string
}

variable "mssql_read_scale" {
  description = "mssql database read scale"
  type        = bool
}

variable "mssql_sku" {
  description = "Sku name of mssql database"
  type        = string
}

variable "mssql_zone_redundant" {
  description = "Does mssql database needs to be zone redundant?"
  type        = bool
}

variable "mssql_tag" {
  description = "Tag name of mssql database"
  type        = string
}