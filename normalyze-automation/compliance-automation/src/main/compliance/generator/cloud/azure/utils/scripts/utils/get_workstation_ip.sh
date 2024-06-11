#!/bin/bash
IP=$(curl -s http://ipinfo.io/ip)
echo "{\"ip\": \"$IP\"}"
