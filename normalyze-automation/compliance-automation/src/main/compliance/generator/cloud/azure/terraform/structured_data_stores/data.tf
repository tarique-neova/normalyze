data "external" "workstation_ip" {
  program = ["bash", "../../utils/scripts/utils/get_workstation_ip.sh"]
}

data "external" "random_value" {
  program = ["bash", "../../utils/scripts/utils/generate_random_value.sh"]
}