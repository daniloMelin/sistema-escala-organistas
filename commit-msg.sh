#!/bin/bash

# Este script valida se a mensagem de commit segue o padrão Conventional Commits.

# Caminho para o arquivo que contém a mensagem de commit (passado pelo Git)
COMMIT_MSG_FILE=$1

# Lê a primeira linha da mensagem de commit
first_line=$(head -n1 "$COMMIT_MSG_FILE")

# Expressão Regular (Regex) para validar o padrão.
# Exige um tipo, um escopo opcional, um '!' opcional para breaking change, seguido de ": " e a descrição.
# Tipos permitidos: feat, fix, docs, style, refactor, perf, test, build, ci, chore, cleanup, remove, raw
regex="^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|cleanup|remove|raw)(\(.+\))?!?:\s.+"

# Verifica se a primeira linha da mensagem corresponde ao padrão
if [[ ! "$first_line" =~ $regex ]]; then
  echo "ERRO: A sua mensagem de commit não segue o padrão Conventional Commits." >&2
  echo "      Por favor, formate sua mensagem como: 'tipo: descrição'." >&2
  echo "      Exemplo: 'feat: Adiciona funcionalidade de login com Google'" >&2
  echo "      Tipos permitidos: feat, fix, docs, style, refactor, perf, test, build, ci, chore, cleanup, remove, raw." >&2
  exit 1 # Aborta o commit
fi

# Se a mensagem for válida, o script termina com sucesso
exit 0