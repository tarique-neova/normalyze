variable "name" {
  description = "The name of the storage account"
  type        = string
}

variable "resource_group" {
  description = "The resource group name"
  type        = string
}

variable "region" {
  description = "The region where the resource will be created"
  type        = string
}

variable "account_tier" {
  description = "The account tier"
  type        = string
}

variable "account_replication_type" {
  description = "The account replication type"
  type        = string
}

variable "enable_https_traffic_only" {
  description = "Enable HTTPS traffic only"
  type        = bool
}

variable "environment" {
  description = "The environment tag"
  type        = string
}
