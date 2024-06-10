data "external" "current_ip" {
  program = ["bash", "${path.module}/scripts/get_ip.sh"]
}

data "external" "random_value" {
  program = ["bash", "scripts/generate_random_value.sh"]
}