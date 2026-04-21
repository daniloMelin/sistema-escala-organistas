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

## Regras oficiais da fase 1.1

### `church.name`

- mínimo de `3` caracteres
- máximo de `100` caracteres
- aceitar letras, números, espaços e acentuação
- bloquear caracteres especiais inadequados
- mensagem esperada:
  - `Use apenas letras, números e espaços no nome da igreja.`

### `organist.name`

- mínimo de `2` caracteres
- máximo de `40` caracteres
- aceitar primeiro nome ou nome + sobrenome
- bloquear números
- bloquear caracteres especiais inadequados
- mensagem esperada para caracteres inválidos:
  - `Use apenas letras e espaços no nome da organista.`
- mensagem esperada para excesso de palavras:
  - `Informe somente o primeiro nome ou nome e sobrenome.`

### `rehearsal.notes`

- máximo de `120` caracteres
- campo opcional
- deve manter a digitação livre dentro do limite
- mensagem esperada:
  - `A observação do ensaio pode ter no máximo 120 caracteres.`

### `church.code`

- permanece apenas como compatibilidade legada
- não é campo prioritário para evolução
- a diretriz do ciclo continua sendo remover esse campo da interface

## Padrão visual de erro acordado

- campo inválido com borda de destaque
- mensagem curta logo abaixo do campo
- valor digitado preservado
- erro específico por campo, evitando depender apenas de alerta global

## Consolidação da fase 1.2

### Comportamento de interface por campo

| Campo             | Comportamento esperado de UI                                                               |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `church.name`     | Aplicar `maxLength=100`, manter texto digitado, validar caracteres inválidos e exibir erro |
| `organist.name`   | Aplicar `maxLength=40`, validar excesso de palavras, bloquear números e exibir erro        |
| `rehearsal.notes` | Aplicar `maxLength=120`, sem complexidade extra, apenas limite claro e mensagem objetiva   |
| `church.code`     | Não investir em refinamento novo, pois o campo segue marcado para remoção da interface     |

### Momento de feedback esperado

- validar em tempo de digitação quando houver excesso de tamanho
- validar ao perder foco para campos com regra de composição
- validar novamente no envio do formulário antes de salvar
- manter a mesma mensagem de erro nas três situações, evitando conflito de interpretação

### Texto de apoio recomendado

- `church.name`: apoio opcional com foco em clareza, sem poluir a interface
- `organist.name`: apoio útil com a orientação `Informe primeiro nome ou nome e sobrenome.`
- `rehearsal.notes`: apoio opcional com foco em observação curta

### Decisões específicas de UX

- não exibir contador visual permanente se ele deixar o formulário poluído
- usar o limite técnico no `input` para impedir que o usuário digite além do máximo
- reservar a mensagem textual para orientar motivo do erro, não apenas repetir o limite
- manter erro global apenas como apoio secundário, nunca como única sinalização

## Resultado esperado do ciclo

Ao final do `V17`, os formulários devem transmitir mais confiança,
exigir menos tentativa e erro e reduzir inconsistências de
preenchimento em uso real.
