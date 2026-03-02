# Code Review V5

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                                                                         |
| ------ | ------------------ | ------------ | -------------------------------------------------------------------------------------------- |
| 1.0    | 1 de março de 2026 | Danilo Melin | Criação do Code Review V5 com foco em testes E2E e robustez dos fluxos principais            |
| 1.1    | 1 de março de 2026 | Danilo Melin | Implementação da Fase 1.1 com adoção de Playwright, configuração inicial e documentação base |
| 1.2    | 2 de março de 2026 | Danilo Melin | Implementação da Fase 1.2 com estratégia local controlada de autenticação e dados para E2E   |
| 1.3    | 2 de março de 2026 | Danilo Melin | Implementação da Fase 2.1 com cenários E2E de autenticação e navegação inicial               |
| 1.4    | 2 de março de 2026 | Danilo Melin | Implementação da Fase 2.2 com cenários E2E de cadastro e edição de igreja                    |
| 1.5    | 2 de março de 2026 | Danilo Melin | Implementação da Fase 2.3 com cenários E2E de cadastro e edição de organista                 |
| 1.6    | 2 de março de 2026 | Danilo Melin | Implementação da Fase 2.4 com cenário E2E de geração de escala e validação do histórico      |
| 1.7    | 2 de março de 2026 | Danilo Melin | Implementação da Fase 2.5 com cenário E2E de edição manual e exportação de PDF               |

## Objetivo

Elevar a confiabilidade do sistema com foco em validação ponta a ponta dos fluxos principais e preparação do projeto para evolução segura.

## Status do Ciclo

- Status geral: `EM ANDAMENTO`
- Data de início: `1 de março de 2026`
- Contexto: continuidade do `CODE_REVIEW_V4`, iniciando novo ciclo com prioridade em cobertura E2E

## Diretriz de Prioridade

1. Cobrir fluxos críticos do usuário com testes E2E confiáveis
2. Garantir execução local simples e reprodutível
3. Preparar integração progressiva com CI sem fragilizar o pipeline principal

## Plano de Implementação

### Fase 1 - Fundação de Testes E2E

#### 1.1 Definir stack E2E e configurar base do projeto

- Status: `CONCLUÍDO`
- Prioridade: `CRÍTICA`
- Objetivo:
  - escolher a stack mais adequada para o projeto web atual
  - instalar/configurar base de execução local
  - documentar padrão inicial de testes
- Direção recomendada:
  - adotar `Playwright`
- Justificativa:
  - melhor alinhamento com projeto React web
  - suporte robusto a múltiplos navegadores
  - boa integração futura com CI
- Entregáveis:
  - dependências E2E instaladas
  - configuração inicial criada
  - script npm para execução local
  - pasta de testes E2E padronizada
  - documento curto de uso
- Critério de aceite:
  - comando E2E executa localmente
  - estrutura inicial do runner criada com sucesso

#### 1.2 Preparar ambiente de teste e estratégia de dados

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Objetivo:
  - definir como os testes E2E vão rodar sem depender de dados manuais frágeis
- Pontos a resolver:
  - uso de ambiente local controlado
  - massa mínima de teste
  - estratégia para autenticação
  - isolamento entre execuções
- Critério de aceite:
  - estratégia definida e documentada
  - fluxo inicial reproduzível por comando único

### Fase 2 - Cobertura dos Fluxos Principais

#### 2.1 Fluxo E2E de autenticação e navegação inicial

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - entrada no sistema
  - carregamento da área principal
  - navegação inicial sem erro visível

#### 2.2 Fluxo E2E de cadastro e edição de igreja

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - criar igreja
  - editar igreja
  - validar feedback visual básico

#### 2.3 Fluxo E2E de cadastro e edição de organista

- Status: `CONCLUÍDO`
- Prioridade: `ALTA`
- Escopo:
  - cadastrar organista
  - editar organista
  - validar persistência visual

#### 2.4 Fluxo E2E de geração de escala

- Status: `CONCLUÍDO`
- Prioridade: `CRÍTICA`
- Escopo:
  - gerar escala
  - visualizar grade
  - validar histórico básico

#### 2.5 Fluxo E2E de edição manual e exportação

- Status: `CONCLUÍDO`
- Prioridade: `MÉDIA`
- Escopo:
  - editar escala manualmente
  - salvar alterações
  - validar ação de exportação PDF

### Fase 3 - Integração e Sustentação

#### 3.1 Padronizar comandos e documentação de execução

- Status: `PENDENTE`
- Prioridade: `MÉDIA`

#### 3.2 Integrar E2E ao CI com gatilho controlado

- Status: `PENDENTE`
- Prioridade: `MÉDIA`
- Direção recomendada:
  - não bloquear toda PR no início
  - começar com execução dedicada/manual ou workflow separado

#### 3.3 Revisar cobertura funcional e lacunas remanescentes

- Status: `PENDENTE`
- Prioridade: `MÉDIA`

## Ordem de execução confirmada

1. **Fase 3 - Integrar, documentar e estabilizar no CI**

## Registro de progresso

- [x] Fase 1.1 concluída
- [x] Fase 1.2 concluída
- [x] Fase 2.1 concluída
- [x] Fase 2.2 concluída
- [x] Fase 2.3 concluída
- [x] Fase 2.4 concluída
- [x] Fase 2.5 concluída
- [ ] Fase 3.1 concluída
- [ ] Fase 3.2 concluída
- [ ] Fase 3.3 concluída

## Critério de Conclusão do V5

- stack E2E definida e operacional localmente
- fluxos críticos principais cobertos por cenários ponta a ponta
- documentação suficiente para execução por terceiros
- estratégia de CI definida e aplicada sem comprometer a estabilidade do pipeline principal
