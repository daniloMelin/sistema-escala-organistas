# Code Review V16

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão                            |
| ------ | ------------------- | ------------ | ----------------------------------------------- |
| 1.0    | 12 de abril de 2026 | Danilo Melin | Criação do ciclo V16                            |
| 1.1    | 12 de abril de 2026 | Codex        | Estruturação inicial do ensaio local por igreja |
| 1.2    | 13 de abril de 2026 | Codex        | Implementação inicial do ensaio local           |
| 1.3    | 13 de abril de 2026 | Codex        | Simplificação do ensaio local como campo fixo   |
| 1.4    | 14 de abril de 2026 | Codex        | Exibição inicial do ensaio local na experiência |
| 1.5    | 14 de abril de 2026 | Codex        | Validação ponta a ponta do ensaio local         |
| 1.6    | 14 de abril de 2026 | Codex        | Consolidação do impacto operacional do ensaio   |

## Objetivo

Adicionar suporte ao cadastro e edição do ensaio local por igreja,
preservando essa informação como parte estável da configuração da igreja
e preparando seu uso futuro em visualizações e PDF.

## Status do Ciclo

- Status geral: `PLANEJADO`
- Data de início: `12 de abril de 2026`
- Data de encerramento: `A definir`
- Contexto: evolução funcional do cadastro de igrejas, agora com foco em
  registrar uma informação operacional recorrente que hoje não tem lugar
  próprio no sistema

## Diretriz de Prioridade

1. Tratar ensaio local como configuração da igreja, não como item da
   escala
2. Estruturar os dados de forma editável e reutilizável
3. Permitir cadastro e edição sem aumentar complexidade desnecessária
4. Deixar integração com PDF como etapa posterior do ciclo

## Diagnóstico Inicial

Hoje cada igreja possui um padrão próprio de ensaio local, por exemplo:

- Jardim Uirá: `1ª quinta-feira do mês às 19:30`
- Recreio Campestre: `1ª terça-feira do mês`
- Jardim Satélite: `1ª sexta-feira do mês`

Essa informação:

- é relevante para a operação da igreja
- precisa ser persistida junto do cadastro da igreja
- deve ser editável ao longo do tempo
- pode aparecer depois em visualizações e PDF

Durante a evolução da fase inicial, também ficou decidido que:

- toda igreja possui ensaio local
- por isso, o formulário não deve perguntar se a igreja possui ensaio
- o bloco de ensaio deve ficar sempre visível e editável

No estado atual, o sistema não possui um lugar estruturado para guardar
esse dado.

## Plano de Implementação

### Fase 1 - Estratégia do Ensaio Local

#### 1.1 Revisar o modelo ideal para registrar ensaio local por igreja

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - definir quais campos precisam ser persistidos
  - decidir o nível de estrutura do dado
  - separar claramente ensaio local de culto e de escala gerada

#### 1.2 Implementar suporte inicial ao ensaio local no cadastro da igreja

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - incluir os campos no formulário de igreja
  - permitir salvar e editar os dados
  - ajustar validação, persistência e cobertura correspondente

### Fase 2 - Experiência de Uso do Ensaio Local

#### 2.1 Refinar clareza da edição e exibição do ensaio local

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - revisar labels e organização visual do bloco de ensaio
  - garantir leitura simples da recorrência e do horário
  - preservar a ergonomia do cadastro da igreja

#### 2.2 Validar o fluxo ponta a ponta do ensaio local

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - validar criação e edição do ensaio local em uso real
  - garantir persistência correta da informação
  - preparar base para futura exibição no PDF

### Fase 3 - Consolidação Funcional

#### 3.1 Revisar impacto operacional do ensaio local cadastrado

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - consolidar o ganho prático da informação no cadastro
  - registrar limitações remanescentes
  - identificar o próximo passo funcional mais natural

#### 3.2 Consolidar cobertura e documentação do fluxo evoluído

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - documentar a cobertura da melhoria entregue
  - consolidar artefatos e decisões do ciclo

### Fase 4 - Fechamento do Ciclo

#### 4.1 Encerrar formalmente o V16

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Escopo:
  - registrar o resultado do ciclo
  - consolidar próximos passos recomendados
  - fechar formalmente o `CODE_REVIEW_V16`

## Ordem de execução recomendada

1. **Fase 1.1 - revisar o modelo ideal do ensaio local**
2. **Fase 1.2 - implementar suporte inicial ao cadastro**
3. **Fase 2.1 - refinar clareza da edição e exibição**
4. **Fase 2.2 - validar o fluxo ponta a ponta**
5. **Fase 3.1 - revisar impacto operacional**
6. **Fase 3.2 - consolidar cobertura e documentação**
7. **Fase 4.1 - fechamento do ciclo**

## Registro de progresso

- [x] Fase 1.1 concluída
- [x] Fase 1.2 concluída
- [x] Fase 2.1 concluída
- [x] Fase 2.2 concluída
- [x] Fase 3.1 concluída
- [ ] Fase 3.2 pendente
- [ ] Fase 4.1 pendente

## Critério de Conclusão do V16

- ensaio local persistido como parte da configuração da igreja
- cadastro e edição funcionando com leitura clara da recorrência
- fluxo ponta a ponta validado para criação, edição e leitura do ensaio
  local
- documentação do ciclo atualizada com impacto prático e próximos
  passos

## Artefatos da Fase 1

- `docs/reviews/artifacts/v16/CHURCH_REHEARSAL_REVIEW_V16.md`
- `docs/reviews/artifacts/v16/CHURCH_REHEARSAL_IMPACT_V16.md`

## Próximos Passos Recomendados

1. consolidar cobertura e documentação do fluxo evoluído
2. decidir em ciclo posterior como e quando essa informação deve entrar
   no PDF
3. revisar se o ensaio local deve aparecer em outros pontos da
   experiência da igreja
