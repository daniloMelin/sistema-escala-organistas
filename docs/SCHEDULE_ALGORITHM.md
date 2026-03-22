# Novo Algoritmo de Geração de Escala

## Histórico de Revisões

| Versão | Data                    | Autor(es)    | Descrição da Revisão |
| ------ | ----------------------- | ------------ | -------------------- |
| 1.0    | 24 de fevereiro de 2026 | Danilo Melin | Criação inicial      |

## 📋 Resumo

A função `generateSchedule` foi completamente reescrita para
implementar um algoritmo baseado em **Escassez de Disponibilidade** e
**Equilíbrio de Funções**, resolvendo problemas com organistas que têm
restrições rígidas de dias.

## 🔑 Características Principais

### 1. **Suporte a Restrições Avançadas**

O algoritmo agora suporta:

- **`fixedDays`**: Array de números 0-6 representando os únicos dias da
  semana que a organista pode tocar
  - Exemplo: `fixedDays: [6]` = só pode tocar aos sábados
- **`blockedDates`**: Array de strings ISO (yyyy-MM-dd) com datas
  específicas bloqueadas
  - Exemplo: `blockedDates: ["2024-12-25", "2024-01-01"]`
- **Compatibilidade**: Mantém suporte à estrutura antiga de
  `availability` (objeto com chaves como `sunday_rjm`, `monday`, etc.)

### 2. **Algoritmo em 4 Passos**

#### **PASSO A: Cálculo de Availability Score**

- Para cada organista, calcula quantos dias tecnicamente ela poderia
  tocar no período
- Considera: `fixedDays`, `blockedDates`, e `availability`
- Armazena o score em `availabilityScores[organistId]`

#### **PASSO B: Ordenação por Escassez**

- Ordena organistas de forma **crescente** baseada no `availabilityScore`
- **Motivo**: Organistas com poucos dias disponíveis (ex: só sábados)
  são alocadas primeiro
- Analogia: "Pedras Grandes" antes da "Areia"

#### **PASSO C: Alocação e Equilíbrio de Cargos**

- Itera sobre organistas ordenadas por escassez
- Para cada organista, tenta alocá-la em seus dias disponíveis
- **Regra de Decisão do Cargo**:
  - Se **ambas as vagas estão livres** (Meia Hora e Culto):
    - Verifica histórico: se tocou mais "Cultos", aloca na
      "Meia Hora" (e vice-versa)
    - Objetivo: manter média 50/50 entre funções
  - Se **apenas uma vaga está livre**:
    - Aloca na vaga que sobrou (complemento)

#### **PASSO D: Restrições**

- Uma organista **não pode tocar duas vezes no mesmo dia**
- Respeita rigorosamente `fixedDays` (ex: se `fixedDays = [6]`, ignora
  domingos e quartas)
- Respeita `blockedDates` (datas específicas bloqueadas)

## 📊 Estrutura de Dados

### Entrada (Inputs)

```javascript
organists: [
  {
    id: "org1",
    name: "Maria",
    // Opção 1: fixedDays (novo)
    fixedDays: [6], // Só sábados
    blockedDates: ["2024-12-25"], // Datas bloqueadas

    // Opção 2: availability (compatibilidade com estrutura antiga)
    availability: {
      sunday_rjm: false,
      sunday_culto: true,
      monday: false,
      // ...
    }
  }
]

startDateStr: "2024-01-01"
endDateStr: "2024-01-31"
churchConfig: {
  sunday: [{ id: "RJM" }, { id: "MeiaHoraCulto" }, { id: "Culto" }],
  monday: [{ id: "MeiaHoraCulto" }, { id: "Culto" }],
  // ...
}
```

### Saída (Output)

```javascript
[
  {
    date: '01/01/2024',
    dayName: 'Segunda',
    assignments: {
      MeiaHoraCulto: 'Maria',
      Culto: 'João',
      RJM: 'Ana',
    },
  },
  // ...
];
```

## 🔄 Compatibilidade

### Estrutura Antiga (Mantida)

- Organistas com `availability` (objeto) continuam funcionando
- A função converte automaticamente `availability` para `fixedDays` quando necessário

### Estrutura Nova (Adicionada)

- Organistas podem ter `fixedDays` e `blockedDates`
- Se ambos existirem, `fixedDays` tem prioridade sobre `availability`

## 🎯 Benefícios

1. **Resolve Problema de Restrições Rígidas**
   - Organistas com poucos dias disponíveis são alocadas primeiro
   - Evita deixar organistas restritas sem escala

2. **Equilíbrio de Funções**
   - Mantém distribuição 50/50 entre Meia Hora e Culto
   - Evita que uma organista toque sempre no mesmo cargo

3. **Flexibilidade**
   - Suporta restrições por dia da semana (`fixedDays`)
   - Suporta bloqueio de datas específicas (`blockedDates`)
   - Mantém compatibilidade com estrutura antiga

4. **Alocação Inteligente**
   - Prioriza organistas com menos disponibilidade
   - Preenche vagas de forma equilibrada

## 📝 Exemplo de Uso

```javascript
const organists = [
  {
    id: '1',
    name: 'Maria',
    fixedDays: [6], // Só sábados
    blockedDates: ['2024-01-06'], // Bloqueia sábado 06/01
  },
  {
    id: '2',
    name: 'João',
    availability: {
      sunday_culto: true,
      monday: true,
      tuesday: true,
      // ... flexível
    },
  },
];

const schedule = generateSchedule(organists, '2024-01-01', '2024-01-31', churchConfig);
```

## ⚠️ Notas Importantes

1. **Prioridade de Restrições**:
   - `fixedDays` > `availability` (se ambos existirem)
   - `blockedDates` sempre é respeitado

2. **Restrição de Duplicação**:
   - Uma organista **nunca** toca duas vezes no mesmo dia
   - Mesmo que tenha disponibilidade para ambos os cultos

3. **Equilíbrio de Funções**:
   - Só é aplicado quando **ambas as vagas estão livres**
   - Se apenas uma vaga está livre, aloca na que sobrou

4. **Compatibilidade**:
   - Código antigo continua funcionando
   - Novos campos (`fixedDays`, `blockedDates`) são opcionais

## 🧪 Testes Recomendados

1. Organista com `fixedDays: [6]` (só sábados) deve ser alocada primeiro
2. Organista com `blockedDates` não deve ser alocada nessas datas
3. Equilíbrio 50/50 entre Meia Hora e Culto ao longo do período
4. Organista não deve tocar duas vezes no mesmo dia
5. Compatibilidade com estrutura antiga de `availability`
