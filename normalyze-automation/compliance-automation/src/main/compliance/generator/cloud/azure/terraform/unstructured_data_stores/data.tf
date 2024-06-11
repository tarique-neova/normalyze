data "external" "random_value" {
  program = ["bash", "../../utils/scripts/utils/generate_random_value.sh"]
}