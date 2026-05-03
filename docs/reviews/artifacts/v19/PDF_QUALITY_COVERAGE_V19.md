# PDF Quality Coverage V19

## Contexto

Este artefato consolida a cobertura relevante criada ou ampliada
durante o `V19`.

A diretriz do ciclo foi proteger o que realmente reduz risco de
regressão no exportador, sem tentar transformar toda percepção visual em
teste automatizado.

## Cobertura por frente

### Exportação base do PDF

Arquivo principal:

- `src/test/pdfGenerator.test.js`

Comportamentos protegidos:

- exportação do PDF em layout `A4` paisagem
- presença do título da igreja, resumo do período e ensaio local
- renderização de siglas como `M. Hora`, `P1`, `P2` e `Res.`
- manutenção de serviços vagos que aparecem na visualização

Valor da cobertura:

- protege a estrutura base do documento exportado
- reduz risco de divergência informacional entre tela e PDF

### Layout denso da grade

Arquivo principal:

- `src/test/pdfGenerator.test.js`

Comportamentos protegidos:

- troca de `3` para `2` meses por página em cenário com múltiplos
  serviços
- ampliação da leitura no modo denso por meio do novo perfil de layout
- manutenção da paginação em exportação com período de `3` meses

Valor da cobertura:

- protege o principal ajuste estrutural do `V19`
- reduz risco de regressão silenciosa em cenários densos de uso real

### Barra lateral e ensaio local

Arquivo principal:

- `src/test/pdfGenerator.test.js`

Comportamentos protegidos:

- resumo lateral mais compacto no modo denso
- texto auxiliar resumido como `Vezes por organista.` em cenário denso
- quebra controlada de observação longa no ensaio local

Valor da cobertura:

- protege o equilíbrio entre grade principal e contexto lateral
- reduz risco de o ensaio local voltar a competir visualmente com a
  tabela

### Fluxo de exportação no sistema

Arquivo principal:

- `src/test/useChurchScheduleGenerator.test.js`

Arquivo de apoio:

- `src/test/scheduleGridView.test.js`

Comportamentos protegidos:

- integração entre geração da escala e chamada do exportador
- manutenção da visualização como base operacional antes da exportação
- permanência dos serviços relevantes no fluxo da interface

Valor da cobertura:

- conecta o exportador ao fluxo real da aplicação
- evita tratar o PDF como utilitário isolado do restante do sistema

## Validações executadas

Durante a fase 2 e a consolidação da fase 3, foram executadas
validações focadas no exportador:

- `npm test -- --runTestsByPath src/test/pdfGenerator.test.js`
  `src/test/useChurchScheduleGenerator.test.js`
  `src/test/scheduleGridView.test.js --watchAll=false`
- `npm run lint -- --max-warnings=0`
- `npm run format:check`
- `npm run lint:md`

## Lacunas conscientes

O `V19` não tentou automatizar toda percepção visual do PDF.

Lacunas aceitas:

- comparação visual real entre PDFs gerados em navegador
- leitura em impressão física
- percepção subjetiva de densidade, respiração e acabamento gráfico
- cenários adicionais de ergonomia que não alterem o contrato funcional

Essas lacunas permanecem aceitáveis porque a cobertura criada já protege
os principais pontos estruturais e informacionais do exportador.
