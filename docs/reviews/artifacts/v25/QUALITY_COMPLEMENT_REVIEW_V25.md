# Quality Complement Review V25

## Contexto

O `V25` é o ciclo planejado para fechar os pontos complementares do
Lighthouse depois dos ajustes centrais de performance.

Ele concentra três frentes:

- contraste residual
- `robots.txt` e higiene de publicação
- investigação do impacto do fluxo de cookies do Firebase Auth no score
  de Best Practices

## Foco previsto do ciclo

- corrigir contrastes recorrentes da UI
- deixar a publicação mais consistente para análise de SEO
- documentar o que é controlável pela aplicação e o que depende da stack
  externa de autenticação

## Hipóteses iniciais de trabalho

### 1. Há ganhos rápidos de acessibilidade

Pontos indicados no baseline do `V23`:

- botão azul primário
- botão verde de sucesso
- link ativo da navegação
- texto secundário em rodapé ou parágrafos de apoio

Diretriz:

- revisar tokens visuais antes de considerar alterações estruturais

### 2. O `robots.txt` é uma correção barata e objetiva

Sinal do baseline:

- `robots.txt is not valid` em todas as execuções

Diretriz:

- criar ou corrigir `public/robots.txt` com uma política simples e
  válida para o estado atual do sistema

### 3. Best Practices precisa de leitura crítica

Sinais recorrentes:

- `third-party-cookies`
- `inspector-issues` do tipo `Cookie`

Diretriz:

- investigar o que é inerente ao Firebase Auth
- evitar tratar score externo como bug local sem confirmação

## Checklist inicial da fase 1

- mapear todos os pontos de contraste indicados no baseline
- revisar a situação real de `public/robots.txt`
- confirmar se os issues de cookie são reproduzíveis no fluxo atual
- separar correção direta de limitação externa

## Resultado esperado do ciclo

Ao final do `V25`, o projeto deve ter uma leitura final mais madura do
que realmente impede scores `>= 90` e do que pode ser aceito como
restrição da stack usada hoje.
