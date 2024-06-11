variable "region" {
  description = "Region where the resource will be created"
  default     = "eastus"
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
  default     = "../../utils/files/personal_information.csv"
}