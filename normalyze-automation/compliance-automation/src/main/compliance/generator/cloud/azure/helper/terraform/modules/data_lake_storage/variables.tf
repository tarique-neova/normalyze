variable "name" {
  description = "The name of the storage account"
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

variable "blob_type" {
  description = "Type of blob container"
  type        = string
}

variable "file_location" {
  description = "Location of data file"
  type        = string
}