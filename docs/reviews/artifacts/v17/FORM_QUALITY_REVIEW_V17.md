# Form Quality Review V17

## Contexto

O `V17` nasce da necessidade de fortalecer a qualidade dos formulários após a introdução do ensaio local por igreja no `V16`.

A expansão do cadastro reforçou a importância de:

- validações mais claras
- menos campos ambíguos
- melhor comunicação de erro
- menor chance de dados inconsistentes

## Decisões iniciais propostas

### Nome da igreja

- permitir letras, números, espaços e acentuação
- bloquear caracteres especiais inadequados
- manter flexibilidade de tamanho e composição

### Nome da organista

- aceitar primeiro nome ou nome + sobrenome
- bloquear números
- bloquear caracteres especiais inadequados
- manter a entrada simples e previsível

### Código da igreja

- remover da interface principal
- preservar compatibilidade com registros antigos no banco

### Feedback visual

- destacar o campo inválido
- exibir mensagem curta logo abaixo do campo
- evitar depender apenas de erro genérico no topo do formulário

## Tabela inicial de limites

### Campos foco de UX

| Campo             | Mínimo | Máximo | Regra proposta                                      |
| ----------------- | ------ | ------ | --------------------------------------------------- |
| `church.name`     | 3      | 100    | Letras, números, espaços e acentuação               |
| `organist.name`   | 2      | 40     | Primeiro nome ou nome + sobrenome                   |
| `rehearsal.notes` | 0      | 120    | Observação opcional, sem necessidade de texto longo |
| `church.code`     | 0      | 50     | Mantido apenas por compatibilidade legada           |

### Campos técnicos documentados

| Campo              | Mínimo | Máximo | Regra proposta                            |
| ------------------ | ------ | ------ | ----------------------------------------- |
| `user.email`       | 0      | 320    | Mantém limite compatível com autenticação |
| `user.displayName` | 0      | 120    | Mantém compatibilidade com o provedor     |
| `user.photoURL`    | 0      | 2000   | Mantém compatibilidade com o provedor     |

## Observações sobre aplicação prática

- os limites devem ser centralizados em constantes compartilhadas
- a UI deve refletir os limites com `maxLength` onde fizer sentido
- o Firestore deve manter proteção equivalente para os campos críticos
- `church.code` não deve receber novo investimento funcional na interface
- o foco principal do ciclo continua em nome de igreja, nome de
  organista e observação do ensaio

## Resultado esperado do ciclo

Ao final do `V17`, os formulários devem transmitir mais confiança,
exigir menos tentativa e erro e reduzir inconsistências de
preenchimento em uso real.
