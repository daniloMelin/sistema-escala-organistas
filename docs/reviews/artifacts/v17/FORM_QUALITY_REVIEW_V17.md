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
| `church.name`     | 3      | 100    | Letras, espaços e acentuação                        |
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
- aceitar letras, espaços e acentuação
- bloquear caracteres especiais inadequados
- mensagem esperada:
  - `Use apenas letras e espaços no nome da igreja.`

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

## Revisão técnica da fase 2

### Situação atual observada no código

- `src/utils/validation.js` já possui validadores, mas ainda usa regras mais amplas que o `V17`
- `src/components/ChurchForm.js` e `src/components/OrganistForm.js` ainda dependem de erro global por formulário
- `src/components/ui/Input.js` já suporta erro por campo e pode ser reaproveitado
- `src/hooks/useChurchManager.js` e `src/hooks/useChurchDashboard.js` concentram a validação apenas no envio
- `firestore.rules` ainda aceita contratos mais largos do que os limites aprovados para UX

### Escopo técnico aprovado para implementação

#### 2.1 Validadores e constantes

- centralizar limites e mensagens em constantes compartilhadas
- ajustar `validateOrganistName` para o limite máximo de `40`
- diferenciar regra de negócio de sanitização genérica

#### 2.2 Estado de erro por campo

- criar estrutura de erro específica por campo
- propagar erros individuais para `Input`
- manter mensagem global apenas como reforço secundário

#### 2.3 Ajustes de UX no formulário

- aplicar `maxLength` nos campos definidos
- validar composição de nome da organista no `blur` e no `submit`
- retirar `church.code` da interface principal sem quebrar compatibilidade de dados

#### 2.4 Persistência e rules

- salvar payload já compatível com o contrato final
- reduzir diferença entre frontend e `firestore.rules`
- atualizar as rules sem tentar empurrar validação excessivamente sofisticada para o backend

#### 2.5 Testes

- validar cenários de nome inválido para igreja
- validar número e excesso de palavras no nome da organista
- validar limite de `40` caracteres para organista
- validar limite de `120` caracteres para observação do ensaio
- validar ausência do campo `church.code` na UI

## Resultado consolidado da fase 2

- `src/constants/formValidation.js` passou a centralizar limites e mensagens
- `src/utils/validation.js` foi alinhado ao contrato oficial do `V17`
- `src/hooks/useChurchManager.js` e `src/hooks/useChurchDashboard.js` passaram a expor erros por campo
- `src/components/ChurchForm.js` e `src/components/OrganistForm.js` passaram a renderizar feedback individual
- `src/components/ChurchList.js` deixou de exibir `church.code` na experiência principal
- `firestore.rules` foi ajustado para o limite de `40` caracteres em nome de organista
- os testes de validação, formulário e hooks foram ampliados e aprovados

## Revisão de impacto da fase 3

A revisão de consolidação confirmou que a entrega mantém coerência entre
as camadas principais do ciclo:

- `src/constants/formValidation.js` concentra os limites oficiais
- `src/utils/validation.js` aplica as regras de negócio aprovadas
- `ChurchForm` e `OrganistForm` exibem erros por campo e aplicam
  `maxLength` nos campos textuais do V17
- `useChurchManager` e `useChurchDashboard` preservam o valor digitado e
  bloqueiam envio inválido antes da persistência
- `firestore.rules` mantém os limites estruturais essenciais para igreja,
  organista e ensaio local

Cobertura validada na fase:

- validações de nome de igreja, nome de organista e observação do ensaio
- feedback por campo nos formulários principais
- limites visíveis de `100`, `40` e `120` caracteres na UI
- remoção do campo `Código` da experiência principal
- compatibilidade com nome legado de organista ao editar disponibilidade

Risco residual aceito:

- as regras do Firestore validam limites e estrutura, mas não reproduzem
  toda a regra textual de caracteres permitidos; essa decisão mantém as
  rules simples e deixa a validação semântica no front-end.

## Resultado esperado do ciclo

Ao final do `V17`, os formulários devem transmitir mais confiança,
exigir menos tentativa e erro e reduzir inconsistências de
preenchimento em uso real.

## Encerramento do ciclo

O `V17` fica encerrado com o contrato de qualidade de formulário
consolidado para os fluxos principais de igreja e organista.

A decisão final do ciclo é manter formulários simples, com validação
específica e mensagens próximas do campo, sem adicionar controles
visuais permanentes que aumentem ruído para casos comuns.

Próximos ciclos podem evoluir a mesma linha de qualidade em outros
fluxos, mas o escopo do `V17` está concluído.
