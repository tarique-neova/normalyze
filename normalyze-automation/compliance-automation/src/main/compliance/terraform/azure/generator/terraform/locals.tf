//List of all locals to be used for Azure resource creation

locals {
  current_timestamp      = var.current_timestamp_for_debugging == "" ? time_static.current_time.rfc3339 : var.current_timestamp_for_debugging
  timestamp_sanitized    = replace(local.current_timestamp, "/[-| |T|Z|:]/", "")
  customized_name        = "${var.name_prefix}-${local.timestamp_sanitized}"
}
