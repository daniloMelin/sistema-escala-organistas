# Performance Baseline Review V23

## Contexto

O `V23` nasce como primeiro ciclo de qualidade percebida após a
consolidação de produção do `V22`.

O objetivo desta fase 1 é transformar os relatórios de Lighthouse em um
plano técnico priorizado, usando medições repetidas em produção mobile
nas três telas mais relevantes do sistema.

## Fontes usadas nesta baseline

Relatórios avaliados:

- Home:
  - `/home/danilo-melin/lighthouse-escala-organistas/home-mobile-1.json`
  - `/home/danilo-melin/lighthouse-escala-organistas/home-mobile-2.json`
  - `/home/danilo-melin/lighthouse-escala-organistas/home-mobile-3.json`
- Lista de igrejas:
  - `/home/danilo-melin/lighthouse-escala-organistas/igrejas-mobile-1.json`
  - `/home/danilo-melin/lighthouse-escala-organistas/igrejas-mobile-2.json`
  - `/home/danilo-melin/lighthouse-escala-organistas/igrejas-mobile-3.json`
- Dashboard:
  - `/home/danilo-melin/lighthouse-escala-organistas/dashboard-mobile-1.json`
  - `/home/danilo-melin/lighthouse-escala-organistas/dashboard-mobile-2.json`
  - `/home/danilo-melin/lighthouse-escala-organistas/dashboard-mobile-3.json`

Critério adotado:

- considerar o comportamento recorrente em `3` execuções por tela
- usar leitura mediana como baseline operacional do ciclo

## Medianas consolidadas

| Tela      | Performance | Accessibility | Best Practices | SEO |  LCP |   CLS |   TBT |
| --------- | ----------: | ------------: | -------------: | --: | ---: | ----: | ----: |
| Home      |          86 |            87 |             77 |  91 | 3.7s | 0.061 | 193ms |
| Igrejas   |          76 |            96 |             77 |  91 | 5.1s | 0.106 | 183ms |
| Dashboard |          54 |            95 |             77 |  91 | 5.4s | 0.751 | 164ms |

## Leitura executiva da baseline

### 1. O maior problema não é CPU

O `TBT` está razoável nas três telas, sem sinais de travamento severo da
main thread.

Leitura:

- o problema atual é mais de carregamento útil e estabilidade visual do
  que de processamento bruto
- isso favorece um ciclo focado em shell, layout e orquestração de
  carregamento

### 2. O dashboard concentra o maior risco de score

O dashboard apresentou:

- `Performance`: `54`
- `LCP`: `5.4s`
- `CLS`: `0.751`

Leitura:

- existe forte deslocamento visual na montagem da tela autenticada
- o conteúdo principal aparece tarde demais para a meta do ciclo

### 3. A lista de igrejas também sofre no shell autenticado

A lista de igrejas ficou em:

- `Performance`: `76`
- `LCP`: `5.1s`
- `CLS`: `0.106`

Leitura:

- apesar de menos crítica que o dashboard, a tela ainda está fora do
  ideal de carregamento e estabilidade
- o layout autenticado precisa ser tratado como bloco comum

### 4. A home está perto, mas não pronta

A home ficou em:

- `Performance`: `86`
- `Accessibility`: `87`

Leitura:

- a entrada já está mais próxima da meta
- ainda há espaço para melhoria em `LCP`, contraste e carga inicial de
  JavaScript

## Problemas recorrentes confirmados

### 1. `CLS` alto no dashboard

Sinal:

- `0.751` nas três execuções

Hipótese principal:

- o shell autenticado renderiza uma estrutura inicial instável e
  reorganiza blocos após autenticação e carregamento de dados

Áreas prováveis do código:

- `src/App.js`
- `src/App.css`
- `src/components/ChurchDashboard.js`
- `src/components/ChurchDashboard.css`
- `src/components/ChurchManager.js`
- `src/components/ChurchManager.css`

Ações planejadas:

- reservar altura estável para cabeçalhos, toolbars e listas
- revisar estados de loading para evitar troca brusca entre vazio e
  conteúdo completo
- introduzir placeholders ou skeletons onde o conteúdo grande entra
  depois
- revisar `min-height`, alinhamento e ritmo vertical do shell

### 2. `LCP` alto nas telas autenticadas

Sinal:

- `5.1s` na lista de igrejas
- `5.4s` no dashboard

Hipótese principal:

- o conteúdo mais relevante da tela depende de shell autenticado,
  inicialização de sessão e hidratação de listas antes de parecer
  completo para o Lighthouse

Áreas prováveis do código:

- `src/App.js`
- `src/components/Auth.js`
- `src/components/ChurchManager.js`
- `src/components/ChurchDashboard.js`
- `src/hooks/useChurchManager.js`
- `src/hooks/useChurchDashboard.js`

Ações planejadas:

- priorizar renderização de shell útil antes dos dados completos
- reduzir mudanças tardias no cabeçalho e blocos principais
- revisar se partes secundárias podem ser adiadas ou lazy-loaded

### 3. JavaScript inicial acima do ideal

Sinal:

- Home: economia estimada de `120 KiB`
- Igrejas/Dashboard: economia estimada de `79–82 KiB`
- `main.217ddb5c.js` transferindo cerca de `175 KB`

Leitura:

- o bundle principal ainda carrega mais do que a rota crítica precisa

Áreas prováveis do código:

- `src/App.js`
- `src/components/ChurchScheduleGenerator.js`
- `src/components/ScheduleHistoryList.js`
- `src/utils/pdfGenerator.js`

Ações planejadas:

- revisar oportunidades adicionais de `React.lazy`
- adiar carregamento do caminho de PDF para o momento de uso
- revisar dependências que entram cedo demais no bundle principal

### 4. Contraste insuficiente

Sinal recorrente:

- botão azul primário com branco
- botão verde de sucesso com branco
- link ativo da navegação
- texto cinza residual em `p`

Áreas prováveis do código:

- `src/App.css`
- `src/index.css`
- `src/components/Auth.css`

Ações planejadas:

- escurecer as cores de ação ou ajustar tokens de texto
- revisar contraste do estado ativo da navegação
- revisar textos secundários de rodapé e áreas de apoio

### 5. `robots.txt` inválido

Sinal:

- `robots.txt is not valid` em todas as execuções

Leitura:

- o projeto hoje não apresenta um `public/robots.txt` válido para o
  baseline de SEO/higiene técnica

Área provável do código:

- `public/robots.txt`

Ação planejada:

- criar ou corrigir `robots.txt` simples e válido para o ambiente atual

### 6. Best Practices afetado por cookies de terceiros

Sinal:

- `Best Practices = 77` em todas as telas
- auditorias recorrentes:
  - `third-party-cookies`
  - `inspector-issues` com tipo `Cookie`

Leitura:

- esse ponto parece ligado ao fluxo de `Firebase Auth` e `gapi iframe`
- pode não ser inteiramente resolvível apenas com ajustes de UI local

Áreas relacionadas:

- `src/components/Auth.js`
- fluxo do Firebase Authentication hospedado externamente

Diretriz:

- tratar esse item como investigação paralela
- não usar esse score isolado como gatilho para refatoração precipitada
  antes de corrigir `CLS`, `LCP`, contraste e `robots.txt`

## Ordem recomendada de execução da fase 2

### Bloco 1 - shell autenticado e estabilidade visual

Prioridade máxima.

Motivo:

- é onde está o maior ganho potencial de `Performance`
- afeta diretamente lista de igrejas e dashboard

Arquivos-alvo iniciais:

- `src/App.js`
- `src/App.css`
- `src/components/ChurchManager.js`
- `src/components/ChurchManager.css`
- `src/components/ChurchDashboard.js`
- `src/components/ChurchDashboard.css`

### Bloco 2 - LCP e bundle inicial

Segunda prioridade.

Motivo:

- os números mostram que a tela útil está demorando a consolidar
- parte do ganho pode vir de carga mais enxuta por rota

Arquivos-alvo iniciais:

- `src/components/Auth.js`
- `src/components/ChurchScheduleGenerator.js`
- `src/components/ScheduleHistoryList.js`
- `src/utils/pdfGenerator.js`

### Bloco 3 - quick wins de score

Terceira prioridade.

Motivo:

- contraste e `robots.txt` são baratos e ajudam a elevar a base

Arquivos-alvo iniciais:

- `src/App.css`
- `src/index.css`
- `src/components/Auth.css`
- `public/robots.txt`
- `firebase.json`

## Resultado esperado da fase 2

Ao final da fase 2, o `V23` deve conseguir responder melhor a esta
pergunta:

- o sistema consegue chegar a `>= 90` com ajustes de shell, bundle e
  higiene de publicação, ou existe um teto estrutural relevante imposto
  pela stack de autenticação atual?

## Conclusão da fase 1

O baseline levantado é suficientemente estável para abrir o `V23` com
um plano de ação claro.

Resumo:

- o gargalo central está nas telas autenticadas
- `CLS` e `LCP` são os maiores ofensores
- contraste e `robots.txt` são ganhos rápidos
- `Best Practices` precisa de leitura crítica por causa do `Firebase
Auth`

A recomendação desta fase é seguir para implementação com foco no shell
autenticado antes de qualquer rodada nova de micro-otimização.
