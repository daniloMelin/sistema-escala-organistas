# Code Review V17

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão                              |
| ------ | ------------------- | ------------ | ------------------------------------------------- |
| 1.0    | 18 de abril de 2026 | Danilo Melin | Criação do ciclo V17                              |
| 1.1    | 18 de abril de 2026 | Danilo Melin | Estruturação do ciclo de qualidade de formulários |
| 1.2    | 18 de abril de 2026 | Danilo Melin | Definição inicial dos limites de caracteres       |

## Objetivo

Elevar a qualidade dos formulários do sistema com foco em:

- validação mais clara dos campos
- mensagens de erro específicas por contexto
- redução de ambiguidade de preenchimento
- melhoria da consistência entre regras de negócio e interface

## Status do Ciclo

- Status geral: `PLANEJADO`
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

| Campo              | Mínimo | Máximo | Observação                                                  |
| ------------------ | ------ | ------ | ----------------------------------------------------------- |
| `church.name`      | 3      | 100    | Nome principal da igreja, com regra mais flexível           |
| `organist.name`    | 2      | 40     | Primeiro nome ou nome + sobrenome                           |
| `rehearsal.notes`  | 0      | 120    | Observação opcional do ensaio local                         |
| `user.email`       | 0      | 320    | Mantém compatibilidade com o limite já usado nas rules      |
| `user.displayName` | 0      | 120    | Mantém compatibilidade com o fluxo atual de autenticação    |
| `user.photoURL`    | 0      | 2000   | Mantém compatibilidade com o perfil retornado pelo provedor |
| `church.code`      | 0      | 50     | Limite legado, com remoção prevista da UI ao longo do V17   |

## Diretriz Técnica de Implementação

Os limites do `V17` devem ser aplicados em três camadas:

1. interface, com `maxLength` e feedback visual imediato
2. validação de front-end, com mensagens específicas por campo
3. regras do Firestore, preservando coerência com o contrato final dos dados

## Ordem de execução recomendada

1. **Fase 1 - revisar regras e feedback visual dos formulários**
2. **Fase 2 - implementar validações e simplificar campos**
3. **Fase 3 - consolidar cobertura e impacto operacional**
4. **Fase 4 - encerrar formalmente o V17**

## Registro de progresso

- [x] Estrutura inicial do V17 criada
- [ ] Fase 1 concluída
- [ ] Fase 2 concluída
- [ ] Fase 3 concluída
- [ ] Fase 4 concluída

## Critério de Conclusão do V17

- formulários com feedback visual consistente para erros
- regras mais claras para nome de igreja e nome de organista
- campo `Código` removido da experiência principal
- documentação e cobertura atualizadas com o novo padrão de qualidade

## Artefatos do Ciclo

- `docs/reviews/artifacts/v17/FORM_QUALITY_REVIEW_V17.md`
