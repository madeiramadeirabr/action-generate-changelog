#!/bin/bash

# Nome do comando que você deseja adicionar
commandName="changelog"

# Comando que será associado ao script
commandValue="auto-changelog -p"

# Verifica se o package.json existe
if [ -f "package.json" ]; then
# Verifica se o comando já existe nos scripts
  if jq -e ".scripts | has(\"$commandName\")" package.json > /dev/null; then
    echo "O script '$commandName' já está configurado no package.json."
  else
# Adiciona o novo script ao package.json
    jq ".scripts.$commandName = \"$commandValue\"" package.json > tmp.json && mv tmp.json package.json
    echo "Script '$commandName' adicionado ao package.json."
  fi
else
  echo "Arquivo package.json não encontrado."
fi