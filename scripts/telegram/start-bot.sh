#!/usr/bin/env bash

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
ROOT="$SCRIPTPATH/../.."

RED='\033[0;31m'
NC='\033[0m' # No Color

if [[ ! $(command -v nodejs) || ! $(command -v npm) ]]; then
  echo -e "${RED}Either NodeJS or NPM is not installed!"
  echo -e "${NC}Run: apt install -y nodejs npm"
  exit 1
fi

if [[ ! $(command -v yarn) ]]; then
  echo -e "${RED}Yarn is not installed!"
  echo -e "${NC}Run: npm i -g yarn"
  exit 1
fi

if [[ ! $(command -v pm2) ]]; then
  echo -e "${RED}pm2 is not installed!"
  echo -e "${NC}Run: yarn global add pm2"
  exit 1
fi

cd "$ROOT/telegram" || (\
  echo -e "${RED}[CRITICAL] telegram bot directory wasn't found!" && exit 1\
)

[[ ! -f $ROOT/telegram/.env ]] && \
  echo -e "${RED}.env file was not found in telegram directory!" && exit 1

yarn install
yarn build:telegram

pm2 start "yarn start:telegram" --name subid-telegram-bot
