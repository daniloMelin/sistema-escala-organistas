# Backlog Priorizado de Melhorias do Painel

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão            |
| ------ | ------------------- | ------------ | ------------------------------- |
| 1.0    | 27 de março de 2026 | Danilo Melin | Criação do backlog priorizado   |
| 1.1    | 27 de março de 2026 | Danilo Melin | Repriorização conforme uso real |
| 1.2    | 27 de março de 2026 | Danilo Melin | Priorização do modelo de culto  |

## Objetivo

Organizar as principais melhorias possíveis para:

- gerenciamento de igrejas
- painel de gerenciamento da igreja
- cadastro e manutenção de organistas

O foco deste documento é apoiar priorização funcional futura com base
em:

- impacto operacional
- esforço estimado
- risco de implementação
- coerência com a base atual do sistema

## Contexto Real de Uso

O sistema não é usado como um painel administrativo amplo com muitos
operadores simultâneos.

O cenário atual é:

- cada encarregado costuma cuidar de uma igreja
- em alguns casos, a examinadora cuida de mais de uma igreja
- a escala final é exportada em PDF e compartilhada no WhatsApp

Impacto dessa premissa na priorização:

- sobe a importância de visibilidade entre igrejas
- sobe a importância de evitar operação na igreja errada
- sobe a importância de saber rapidamente qual igreja está pronta
- cai a urgência de funcionalidades administrativas muito sofisticadas
  ou multiusuário

Nova premissa funcional relevante:

- a configuração da igreja precisa passar a definir o modelo do culto
- cada igreja pode ter quantidade diferente de slots principais
- apenas a Igreja A usa slot de `Reserva`
- Igrejas B e C usam somente slots principais
- a regra de `RJM` permanece como está hoje

## Critérios de Priorização

### Impacto

- `Alto`: reduz atrito frequente no uso real ou evita erro relevante
- `Médio`: melhora produtividade ou clareza, mas sem bloquear o fluxo
- `Baixo`: refinamento útil, porém menos urgente

### Esforço

- `Baixo`: ajuste localizado, sem grande impacto estrutural
- `Médio`: envolve mais de um componente, hook ou fluxo
- `Alto`: exige mudança de regra, persistência ou redesign mais amplo

### Risco

- `Baixo`: pequena chance de regressão funcional
- `Médio`: exige cuidado em fluxos já consolidados
- `Alto`: pode afetar dados, regras centrais ou comportamento sensível

## Lista Priorizada

1. Modelo configurável de culto por igreja
   Impacto: `Alto`
   Esforço: `Alto`
   Risco: `Alto`
   Recomendação: próximo ciclo funcional principal
2. Adaptação da geração de escala ao modelo de culto
   Impacto: `Alto`
   Esforço: `Alto`
   Risco: `Alto`
   Recomendação: mesmo ciclo da configuração da igreja
3. Adaptação da visualização e do PDF ao modelo de culto
   Impacto: `Alto`
   Esforço: `Médio`
   Risco: `Médio`
   Recomendação: mesmo ciclo da geração
4. Resumo operacional por igreja na lista principal
   Impacto: `Alto`
   Esforço: `Médio`
   Risco: `Baixo`
   Recomendação: ciclo seguinte ao modelo de culto
5. Indicador de prontidão da igreja para gerar escala
   Impacto: `Alto`
   Esforço: `Médio`
   Risco: `Baixo`
   Recomendação: ciclo seguinte ao modelo de culto
6. Feedback de erro mais específico
   Impacto: `Alto`
   Esforço: `Baixo`
   Risco: `Baixo`
   Recomendação: ciclo seguinte ao modelo de culto
7. Busca e filtro na lista de igrejas
   Impacto: `Médio`
   Esforço: `Médio`
   Risco: `Baixo`
   Recomendação: ciclo curto após melhorias de prontidão
8. Validação preventiva da configuração da igreja
   Impacto: `Alto`
   Esforço: `Médio`
   Risco: `Médio`
   Recomendação: ciclo focado em prevenção de erro
9. Melhor explicação da configuração dos dias de culto
   Impacto: `Médio`
   Esforço: `Baixo`
   Risco: `Baixo`
   Recomendação: pode entrar junto de melhoria de UX
10. Confirmação mais forte para exclusão
    Impacto: `Médio`
    Esforço: `Baixo`
    Risco: `Baixo`
    Recomendação: pode entrar como melhoria complementar
11. Atalhos operacionais no painel da igreja
    Impacto: `Médio`
    Esforço: `Baixo`
    Risco: `Baixo`
    Recomendação: refino posterior de produtividade
12. Busca e filtro na lista de organistas
    Impacto: `Médio`
    Esforço: `Médio`
    Risco: `Baixo`
    Recomendação: depois das melhorias no nível da igreja
13. Modelo de organista mais rico
    Impacto: `Médio`
    Esforço: `Médio`
    Risco: `Médio`
    Recomendação: fazer só com caso de uso bem definido
14. Agrupamento ou ordenação avançada de organistas
    Impacto: `Baixo`
    Esforço: `Médio`
    Risco: `Baixo`
    Recomendação: depois de busca e filtro básicos
15. Soft delete / arquivamento
    Impacto: `Alto`
    Esforço: `Alto`
    Risco: `Alto`
    Recomendação: só em ciclo dedicado de regra e persistência

## Detalhamento das Prioridades Mais Altas

### 1. Modelo configurável de culto por igreja

Ideia:

- permitir que cada igreja defina seu modelo de culto no cadastro

Modelos esperados hoje:

- Igreja A:
  - `Culto`
  - `Reserva`
- Igreja B:
  - `Meia Hora`
  - `Culto`
- Igreja C:
  - `Meia Hora`
  - `Parte 1`
  - `Parte 2`
- `RJM`:
  - permanece com a regra atual

Por que está no topo:

- muda a regra central do sistema
- afeta cadastro, geração, visualização e PDF
- tem valor operacional mais alto do que refinamentos administrativos

### 2. Adaptação da geração de escala ao modelo de culto

Ideia:

- fazer o algoritmo preencher os slots corretos por igreja

Por que está no topo:

- sem isso, a configuração da igreja não vira comportamento real
- é o coração funcional da nova necessidade

### 3. Adaptação da visualização e do PDF ao modelo de culto

Ideia:

- refletir corretamente os slots definidos na igreja na tela e no PDF

Por que está no topo:

- a escala final é compartilhada externamente
- o PDF precisa bater com a regra real da igreja

### 4. Resumo operacional por igreja na lista principal

Ideia:

- mostrar informações resumidas da igreja já na tela inicial

Exemplos:

- quantidade de organistas
- quantidade de escalas
- última atualização
- indicador simples de prontidão

Por que está no topo:

- ajuda muito quem cuida de mais de uma igreja
- reduz navegação desnecessária
- melhora tomada de decisão antes de entrar no painel

### 5. Indicador de prontidão da igreja para gerar escala

Ideia:

- mostrar se a igreja está pronta ou não para uso operacional

Exemplos de sinalização:

- sem dias de culto configurados
- sem organistas cadastradas
- organistas sem disponibilidade útil

Por que está no topo:

- previne erro antes do usuário chegar ao gerador
- aumenta clareza do fluxo
- tem alto valor operacional

### 6. Feedback de erro mais específico

Ideia:

- substituir mensagens genéricas por mensagens mais acionáveis

Exemplos atuais que podem melhorar:

- `Erro ao salvar.`
- `Erro ao salvar organista.`
- `Falha ao carregar dados da igreja.`

Por que está no topo:

- reduz ambiguidade
- facilita troubleshooting
- melhora confiança do usuário no sistema

## Melhor Sequência Recomendada

Se a ideia for atacar isso em ciclos pequenos e objetivos, a ordem mais
coerente é:

1. modelo configurável de culto por igreja
2. adaptação da geração de escala ao modelo
3. adaptação da visualização e do PDF
4. resumo operacional por igreja
5. prontidão da igreja
6. feedback de erro mais específico
7. busca e filtro na lista de igrejas
8. validações preventivas
9. explicação melhor dos dias de culto

## Melhorias que Pedem Mais Cuidado

As seguintes melhorias têm valor, mas merecem ciclo próprio ou definição
mais forte antes de implementação:

- validação preventiva da configuração da igreja
- modelo de organista mais rico
- soft delete / arquivamento

Motivo:

- mexem mais diretamente em regra de negócio, estrutura de dados ou
  expectativa operacional

## Conclusão

Hoje, a melhor direção para o painel não é aumentar complexidade de uma
vez, mas sim atacar pontos que:

- alinham o sistema à regra real das igrejas
- evitam erro operacional
- aumentam visibilidade
- melhoram consulta e manutenção da base atual

Com isso, a trilha mais segura é começar por:

1. configuração do modelo de culto por igreja
2. adaptação da geração e do PDF
3. visibilidade operacional por igreja
