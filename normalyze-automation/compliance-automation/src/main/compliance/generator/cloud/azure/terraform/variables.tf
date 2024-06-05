variable "key_vault_name" {
  type        = string
  default     = "test-001" # 'agent-automation-per-workspace' workspace. This workspace is PER enabled.
  description = "Name of the ley vault"
}

variable "name_prefix" {
  type        = string
  default     = "neova-auto" # 'agent-automation-per-workspace' workspace. This workspace is PER enabled.
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