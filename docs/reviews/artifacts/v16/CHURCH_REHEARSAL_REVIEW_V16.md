# Revisão do Ensaio Local por Igreja - V16

## Objetivo

Definir a melhor forma de registrar o ensaio local de cada igreja como
parte do cadastro, mantendo a informação simples de editar, clara de
ler e pronta para uso futuro em visualizações e PDF.

## Contexto de Uso

Cada igreja possui um padrão próprio de ensaio local, com combinação de:

- recorrência no mês
- dia da semana
- horário

Exemplos reais:

- Jardim Uirá: `1ª quinta-feira do mês às 19:30`
- Recreio Campestre: `1ª terça-feira do mês`
- Jardim Satélite: `1ª sexta-feira do mês`

Essa informação não é um item de escala gerada. Ela faz parte da
organização fixa da igreja e, por isso, deve ficar associada ao cadastro
da própria igreja.

## Necessidades Funcionais

O sistema precisa permitir:

1. cadastrar o ensaio local no momento do cadastro da igreja
2. editar essa informação depois
3. exibir a leitura de forma natural para o usuário
4. manter os dados estruturados para uso futuro em relatórios e PDF

## Opções Avaliadas

### 1. Campo único de texto livre

- Exemplo:
  - `1ª quinta-feira do mês às 19:30`
- Vantagens:
  - implementação rápida
  - visual simples no formulário
- Limitações:
  - difícil validar
  - difícil reutilizar no futuro
  - alto risco de variação de escrita

### 2. Bloco estruturado com recorrência, dia e horário

- Campos:
  - semana do mês
  - dia da semana
  - horário
- Vantagens:
  - fácil validar
  - fácil editar
  - pronto para exibição consistente
  - melhor base para uso futuro em PDF
- Limitações:
  - exige um bloco de UI um pouco maior

### 3. Misturar ensaio local com dias de culto

- Vantagens:
  - reutilização visual de parte do formulário existente
- Limitações:
  - conceito incorreto
  - ensaio não é culto
  - polui a configuração usada pela geração de escala

## Decisão da Fase 1.1

A melhor abordagem para o V16 é:

1. tratar ensaio local como bloco próprio da igreja
2. salvar os dados de forma estruturada
3. deixar texto livre apenas como observação opcional, se necessário
4. assumir que toda igreja possui ensaio local, sem toggle de ativação

## Modelo Inicial Recomendado

Estrutura sugerida no documento da igreja:

```js
rehearsal: {
  weekOfMonth: 1,
  weekday: 'thursday',
  time: '19:30',
  notes: ''
}
```

## Campos Recomendados na UI

- `Semana do mês`
  - 1ª
  - 2ª
  - 3ª
  - 4ª
  - 5ª
- `Dia da semana`
  - segunda
  - terça
  - quarta
  - quinta
  - sexta
  - sábado
  - domingo
- `Horário`
- `Observação`
  - opcional

## Diretriz para a Fase 1.2

- incluir ensaio local no cadastro e edição da igreja
- não misturar ensaio com `config` de cultos
- não incluir cálculo automático de datas do ensaio nesta etapa
- preparar o dado para futura exibição no PDF, mas sem exigir isso já na
  primeira entrega
- manter o bloco sempre visível no formulário

## Evolução aplicada na Fase 2.1

Na evolução seguinte do ciclo, a leitura do ensaio local deixou de ficar
restrita ao formulário:

- a lista de igrejas passou a exibir um resumo curto do ensaio local
- o painel da igreja passou a mostrar um bloco próprio com:
  - recorrência principal do ensaio
  - observação opcional, quando existir

Isso reduz a necessidade de entrar em modo de edição apenas para
conferir a informação.
## Conclusão

O V16 deve começar com uma melhoria objetiva:

- ensaio local como configuração estruturada da igreja

Isso entrega valor imediato no cadastro e deixa o sistema pronto para
futuras evoluções de visualização e impressão.
