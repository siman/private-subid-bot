#!/usr/bin/env bash

RED='\033[0;31m'
NC='\033[0m' # No Color

if [[ ! $(command -v pm2) ]]; then
  echo -e "${RED}pm2 is not installed!"
  echo -e "${NC}Run: yarn global add pm2"
  exit 1
fi

pm2 delete subid-telegram-bot
