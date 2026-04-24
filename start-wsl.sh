#!/bin/bash
# Script para iniciar el servidor de desarrollo Angular desde WSL
# Asegura que se use el Node.js de nvm (Linux) en lugar del de Windows

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use 2>/dev/null || nvm use 22

npm run start -- --host 0.0.0.0
