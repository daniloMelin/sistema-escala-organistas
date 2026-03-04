# Estratégia de Ambiente e Dados E2E

## Histórico de Revisões

| Versão | Data               | Autor(es)    | Descrição da Revisão                                                                 |
| ------ | ------------------ | ------------ | ------------------------------------------------------------------------------------ |
| 1.0    | 2 de março de 2026 | Danilo Melin | Definição da estratégia inicial de autenticação e dados para testes E2E              |
| 1.1    | 3 de março de 2026 | Danilo Melin | Atualização da estratégia com porta dedicada e eliminação de reuso de servidor local |
| 1.2    | 4 de março de 2026 | Danilo Melin | Inclusão de injeção de falhas operacionais controladas no modo E2E                   |

## Objetivo

Definir uma estratégia de execução E2E reproduzível, isolada e independente de autenticação Google real e de massa manual no Firestore.

## Estratégia adotada

### 1. Ambiente de execução local controlado

Os testes E2E rodam com a aplicação iniciada automaticamente pelo Playwright usando:

- `REACT_APP_E2E_MODE=true`
- `HOST=127.0.0.1`
- `PORT=3001`

Com isso, o runner sobe um ambiente previsível e dedicado para os testes.

Além disso:

- a execução E2E usa porta dedicada
- o Playwright não reutiliza servidor já existente

Motivo:

- evitar que um `npm start` local aberto fora do modo E2E seja reutilizado pela suíte
- garantir determinismo na execução local

### 2. Autenticação controlada para E2E

Em modo E2E, a aplicação expõe um fluxo de entrada controlado:

- botão `Entrar em modo E2E`
- usuário fixo de teste: `e2e@example.com`
- sessão local persistida em `localStorage`

Motivo:

- elimina dependência de popup do Google
- evita flakiness em autenticação externa
- torna a execução local e futura execução em CI previsíveis

### 3. Persistência local de dados para E2E

Em modo E2E, as operações de dados passam a usar armazenamento local no navegador em vez de Firestore real.

Escopo atual coberto:

- igrejas
- organistas
- escalas

Motivo:

- evitar dependência de projeto Firebase de testes
- evitar sujeira em base real
- permitir isolamento por contexto de navegador

### 4. Isolamento entre execuções

A estratégia usa o contexto padrão isolado do Playwright, o que reduz contaminação entre cenários.

Na prática:

- cada teste começa com sessão/dados controlados pelo próprio contexto do navegador
- massa de teste pode ser criada dentro do cenário ou por helper dedicado

### 5. Falhas operacionais controladas

A estratégia E2E suporta simular falhas de carregamento e salvamento por operação usando chave dedicada em `localStorage`:

- chave: `organist_scheduler_e2e_failures`
- configuração por operação local (ex.: `getChurchesLocal`, `addOrganistLocal`)
- modos suportados:
  - `true` / `always`: falha sempre
  - `once`: falha uma única vez
  - número positivo: falha a quantidade definida e depois limpa

Motivo:

- validar fallback visual e mensagens de erro de forma reproduzível
- evitar dependência de instabilidade artificial no backend real

## Vantagens da estratégia atual

- execução local simples
- sem autenticação externa frágil
- sem dependência de Firestore real para os fluxos E2E
- adequada para evolução incremental dos cenários
- viável para futura integração em CI

## Limitações conscientes

- os E2E atuais validam o comportamento funcional da interface em modo controlado
- não substituem testes de integração reais com Firebase
- validações específicas de infraestrutura Firebase continuam cobertas por testes manuais e validação técnica separada

## Direção para a próxima fase

Na Fase 2, os cenários devem reutilizar esta base para cobrir:

1. entrada no sistema
2. cadastro e edição de igreja
3. cadastro e edição de organista
4. geração de escala
5. edição manual e exportação

## Decisão de engenharia

Para este projeto, a estratégia local controlada oferece o melhor custo-benefício no início do ciclo V5.

Se no futuro houver necessidade de validar integração real com backend, isso deve entrar como uma camada complementar, não como substituição desta base E2E.
