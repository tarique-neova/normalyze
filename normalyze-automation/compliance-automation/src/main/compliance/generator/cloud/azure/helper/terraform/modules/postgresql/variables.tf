variable "name" {
  type = string
}

variable "region" {
  type = string
}

variable "pgsql_version" {
  type = string
}

variable "pgsql_login_username" {
  type = string
}

variable "login_password" {
  type = string
}

variable "minimum_tls_version" {
  type = string
}

variable "start_ip_address" {
  type = string
}

variable "end_ip_address" {
  type = string
}

variable "pgsql_storage" {
  type = string
}

variable "pgsql_backup_retention_days" {
  type = string
}

variable "pgsql_geo_redundant_backup_enabled" {
  type = bool
}

variable "pgsql_auto_grow_enabled" {
  type = bool
}

variable "pgsql_public_network_access_enabled" {
  type = bool
}

variable "pgsql_ssl_enforcement_enabled" {
  type = bool
}

variable "pgsql_ssl_minimal_tls_version_enforced" {
  type = string
}

variable "pgsql_sku" {
  type = string
}

variable "pgsql_charset" {
  type = string
}

variable "pgsql_collation" {
  type = string
}