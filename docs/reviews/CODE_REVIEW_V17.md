# Code Review V17

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão                               |
| ------ | ------------------- | ------------ | -------------------------------------------------- |
| 1.0    | 18 de abril de 2026 | Danilo Melin | Criação do ciclo V17                               |
| 1.1    | 18 de abril de 2026 | Danilo Melin | Estruturação do ciclo de qualidade de formulários  |
| 1.2    | 18 de abril de 2026 | Danilo Melin | Definição inicial dos limites de caracteres        |
| 1.3    | 18 de abril de 2026 | Danilo Melin | Separação entre campos de UX e campos técnicos     |
| 1.4    | 21 de abril de 2026 | Danilo Melin | Consolidação das regras da fase 1.1 do V17         |
| 1.5    | 21 de abril de 2026 | Danilo Melin | Consolidação do comportamento de UI da fase 1.2    |
| 1.6    | 21 de abril de 2026 | Danilo Melin | Revisão e consolidação do escopo técnico da fase 2 |
| 1.7    | 21 de abril de 2026 | Danilo Melin | Conclusão da fase 2 com implementação no código    |

## Objetivo

Elevar a qualidade dos formulários do sistema com foco em:

- validação mais clara dos campos
- mensagens de erro específicas por contexto
- redução de ambiguidade de preenchimento
- melhoria da consistência entre regras de negócio e interface

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `18 de abril de 2026`
- Contexto: continuidade natural do `V16`, aproveitando a evolução do
  cadastro de igrejas e a necessidade de reforçar qualidade de entrada
  de dados

## Diretriz de Prioridade

1. Destacar visualmente campos inválidos
2. Melhorar a qualidade sem aumentar atrito desnecessário
3. Remover campos que não agregam valor real ao fluxo
4. Consolidar regras de preenchimento mais realistas para igrejas e organistas

## Diagnóstico Inicial

Durante os testes funcionais, foi identificado que alguns formulários ainda apresentam atritos importantes:

- campos inválidos podem ser rejeitados sem destaque visual suficiente
- o campo `Código` da igreja gera atrito sem trazer valor proporcional ao fluxo atual
- nomes de organistas precisam de regra mais consistente e previsível
- nomes de igrejas devem continuar flexíveis, mas sem caracteres especiais inadequados
- o bloco de ensaio local ampliou o volume de campos e aumentou a necessidade de validação contextual clara

## Escopo Previsto

### 1. Validação visual dos formulários

- destacar campos inválidos com feedback visual claro
- exibir mensagens curtas e específicas por campo
- preservar o valor digitado ao apresentar erro

### 2. Qualidade do cadastro de organistas

- validar nome com foco em primeiro nome ou nome + sobrenome
- bloquear números e caracteres especiais inadequados
- manter uma experiência simples de preenchimento

### 3. Qualidade do cadastro de igrejas

- validar nome da igreja com regra flexível, mas limpa
- bloquear caracteres especiais inadequados
- remover o campo `Código` da interface, preservando compatibilidade com dados antigos

### 4. Consolidação funcional

- revisar impacto da melhoria na experiência real
- atualizar cobertura de testes
- consolidar documentação do ciclo

## Limites Iniciais Propostos

### Campos foco de UX no V17

| Campo             | Mínimo | Máximo | Observação                                                |
| ----------------- | ------ | ------ | --------------------------------------------------------- |
| `church.name`     | 3      | 100    | Nome principal da igreja, com regra mais flexível         |
| `organist.name`   | 2      | 40     | Primeiro nome ou nome + sobrenome                         |
| `rehearsal.notes` | 0      | 120    | Observação opcional do ensaio local                       |
| `church.code`     | 0      | 50     | Limite legado, com remoção prevista da UI ao longo do V17 |

### Campos técnicos documentados, fora do foco principal do ciclo

| Campo              | Mínimo | Máximo | Observação                                                  |
| ------------------ | ------ | ------ | ----------------------------------------------------------- |
| `user.email`       | 0      | 320    | Mantém compatibilidade com o limite já usado nas rules      |
| `user.displayName` | 0      | 120    | Mantém compatibilidade com o fluxo atual de autenticação    |
| `user.photoURL`    | 0      | 2000   | Mantém compatibilidade com o perfil retornado pelo provedor |

## Diretriz Técnica de Implementação

Os limites do `V17` devem ser aplicados em três camadas:

1. interface, com `maxLength` e feedback visual imediato
2. validação de front-end, com mensagens específicas por campo
3. regras do Firestore, preservando coerência com o contrato final dos dados

Para implementação do ciclo, a prioridade prática deve ficar
concentrada em:

- `church.name`
- `organist.name`
- `rehearsal.notes`
- remoção progressiva de `church.code` da interface

## Consolidação da Fase 1.1

A fase 1.1 do `V17` fica definida como a etapa de consolidação das
regras oficiais dos formulários, com foco em dois pilares:

1. critérios de validação por campo
2. padrão visual de comunicação de erro

Com isso, a fase seguinte pode implementar os formulários já com
mensagens, limites e comportamento visual acordados.

## Consolidação da Fase 1.2

A fase 1.2 do `V17` fica definida como a etapa que transforma as regras
aprovadas em comportamento esperado de interface.

Os formulários devem seguir este padrão:

1. aplicar `maxLength` nos campos textuais com limite fechado
2. impedir crescimento invisível do valor além do máximo permitido
3. mostrar mensagem de erro específica ao perder foco ou ao tentar salvar
4. manter texto de apoio discreto quando isso ajudar a preencher melhor

Na prática, a decisão de UX do ciclo fica assim:

- `church.name`: limite visível e mensagem específica se houver caracteres inválidos
- `organist.name`: limite visível, validação de palavras e bloqueio de caracteres inadequados
- `rehearsal.notes`: limite de tamanho com comportamento simples e previsível
- `church.code`: não deve receber novo refinamento de UX, pois sua remoção continua prevista

## Escopo técnico da Fase 2

A fase 2 do `V17` fica definida como a etapa de implementação prática
das regras aprovadas na fase 1.

Ela deve ser executada em quatro blocos técnicos:

1. centralização do contrato de validação
2. adoção de erros por campo na interface
3. simplificação da experiência do formulário
4. alinhamento entre frontend, persistência e Firestore Rules

### Bloco 2.1 - contrato de validação

Arquivos prioritários:

- `src/utils/validation.js`
- `src/constants/formValidation.js` ou equivalente

Objetivo:

- consolidar limites e mensagens oficiais do `V17`
- ajustar `organist.name` para `40` caracteres máximos
- substituir validações genéricas por regras de negócio mais claras

### Bloco 2.2 - erro por campo e feedback visual

Arquivos prioritários:

- `src/components/ChurchForm.js`
- `src/components/OrganistForm.js`
- `src/components/ui/Input.js`
- `src/hooks/useChurchManager.js`
- `src/hooks/useChurchDashboard.js`

Objetivo:

- substituir erro global único por estrutura de erro por campo
- usar o `Input` com destaque visual individual
- manter alerta global apenas como apoio secundário

### Bloco 2.3 - simplificação da experiência

Arquivos prioritários:

- `src/components/ChurchForm.js`
- `src/components/ChurchList.js`
- `src/hooks/useChurchManager.js`

Objetivo:

- aplicar `maxLength` nos campos definidos na fase 1.2
- remover o campo `church.code` da experiência principal
- manter compatibilidade com registros legados já existentes

### Bloco 2.4 - persistência, rules e testes

Arquivos prioritários:

- `src/services/firebaseService.js`
- `firestore.rules`
- `src/test/validation.test.js`
- `src/test/churchForm.test.js`
- `src/test/useChurchDashboard.test.js`
- `src/test/useChurchManager.test.js`

Objetivo:

- alinhar payload salvo com as novas validações
- reduzir divergência entre frontend e Firestore
- ampliar cobertura de testes para limites, mensagens e remoção de `church.code`

## Encerramento da Fase 2

A fase 2 do `V17` fica encerrada com a entrega combinada entre regra,
interface e persistência.

Resultado consolidado da fase:

- validadores centralizados com limites e mensagens oficiais
- erros por campo aplicados em `ChurchForm` e `OrganistForm`
- remoção do campo `Código` da experiência principal da igreja
- compatibilidade legada preservada para registros antigos
- `firestore.rules` ajustadas para o limite de `40` caracteres em `organist.name`
- cobertura de testes ampliada para os cenários críticos da fase

## Ordem de execução recomendada

1. **Fase 1 - revisar regras e feedback visual dos formulários**
2. **Fase 2 - implementar validações e simplificar campos**
3. **Fase 3 - consolidar cobertura e impacto operacional**
4. **Fase 4 - encerrar formalmente o V17**

## Registro de progresso

- [x] Estrutura inicial do V17 criada
- [x] Fase 1.1 concluída
- [x] Fase 1.2 concluída
- [x] Fase 2 concluída
- [ ] Fase 3 concluída
- [ ] Fase 4 concluída

## Critério de Conclusão do V17

- formulários com feedback visual consistente para erros
- regras mais claras para nome de igreja e nome de organista
- campo `Código` removido da experiência principal
- documentação e cobertura atualizadas com o novo padrão de qualidade

## Artefatos do Ciclo

- `docs/reviews/artifacts/v17/FORM_QUALITY_REVIEW_V17.md`
