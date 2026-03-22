# Revisão de Sinal x Ruído V9

## Histórico de Revisões

| Versão | Data                | Autor(es)    | Descrição da Revisão   |
| ------ | ------------------- | ------------ | ---------------------- |
| 1.0    | 22 de março de 2026 | Danilo Melin | Revisão de sinal do V9 |

## Objetivo

Registrar a utilidade prática dos checks de qualidade estática após a
integração da baseline ao CI principal.

## Escopo Avaliado

Checks analisados:

- `npm run format:check`
- `npm run lint:md`
- `npm run lint`

Contexto analisado:

- rotina local mínima documentada
- workflow principal de CI em PR
- sequência de execução atual em `.github/workflows/ci.yml`

## Diagnóstico do Sinal Atual

### `format:check`

Leitura:

- alto valor para detectar regressões triviais de formatação
- custo baixo
- diagnóstico imediato
- praticamente sem ambiguidade para correção

Conclusão:

- sinal alto
- ruído baixo
- gate apropriado para falhar cedo

### `lint:md`

Leitura:

- valor relevante para preservar a baseline documental recém-limpa
- custo baixo
- boa previsibilidade após saneamento do passivo anterior
- impacto limitado ao escopo de documentação e arquivos Markdown

Conclusão:

- sinal alto para manutenção documental
- ruído aceitável
- gate apropriado enquanto o acervo permanecer estabilizado

### `lint`

Leitura:

- continua sendo o gate estrutural mais importante da base JavaScript
- custo moderado, porém ainda compatível com CI principal
- diagnóstico conhecido pelo projeto

Conclusão:

- sinal alto
- ruído baixo a moderado, dentro do esperado
- deve permanecer no CI principal

## Sequência Atual dos Gates

Ordem atual no CI principal:

1. `npm run format:check`
2. `npm run lint:md`
3. `npm run lint`
4. `npm run test:coverage:critical`
5. `npm run build`

Leitura da ordem:

- falhas baratas e simples aparecem primeiro
- checks de qualidade estática filtram problemas antes de cobertura e build
- a sequência reduz desperdício de tempo em pipeline

## Sinais de Ruído a Monitorar

Revisar esta decisão se ocorrer qualquer um dos cenários abaixo:

- aumento recorrente de falsos positivos ou ajustes mecânicos excessivos
- crescimento do acervo Markdown sem manutenção consistente
- aumento perceptível do tempo de CI sem ganho proporcional
- sobreposição desnecessária entre checks locais e CI

## Decisão do Ciclo V9

Ao final da Fase 3.2, a decisão é:

- manter `format:check`, `lint:md` e `lint` no CI principal
- preservar a ordem atual dos gates
- não separar esses checks em jobs independentes neste momento
- reavaliar apenas se houver aumento real de ruído operacional

## Resultado Prático

- a baseline atual de qualidade estática entrega sinal útil no caminho
  principal de PR
- o projeto evita promover gates por excesso, mantendo apenas os checks
  com boa relação entre custo e benefício
- a manutenção futura passa a ter um critério explícito para revisão de
  ruído
