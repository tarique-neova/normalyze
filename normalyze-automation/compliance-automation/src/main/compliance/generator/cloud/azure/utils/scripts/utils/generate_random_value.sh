#!/bin/bash

# Concatenate with prefix
value="neova$(date +"%Y%m%d%H%M%S")"

# Output JSON object with the generated value
echo "{\"value\": \"$value\"}"

# Write the value to a file for later use in the Python script
echo "{\"value\": \"$value\"}" > random_value.txt
