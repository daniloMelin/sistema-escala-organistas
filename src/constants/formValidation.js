export const FORM_LIMITS = {
  churchName: {
    min: 3,
    max: 100,
  },
  organistName: {
    min: 2,
    max: 40,
    maxWords: 2,
  },
  churchCode: {
    max: 50,
  },
  rehearsalNotes: {
    max: 120,
  },
  user: {
    email: {
      max: 320,
    },
    displayName: {
      max: 120,
    },
    photoURL: {
      max: 2000,
    },
  },
};

export const FORM_ERROR_MESSAGES = {
  churchNameRequired: 'Nome da igreja é obrigatório.',
  churchNameMin: `Nome deve ter pelo menos ${FORM_LIMITS.churchName.min} caracteres.`,
  churchNameMax: `Nome deve ter no máximo ${FORM_LIMITS.churchName.max} caracteres.`,
  churchNameInvalid: 'Use apenas letras e espaços no nome da igreja.',
  organistNameRequired: 'Nome da organista é obrigatório.',
  organistNameMin: `Nome deve ter pelo menos ${FORM_LIMITS.organistName.min} caracteres.`,
  organistNameMax: `Nome deve ter no máximo ${FORM_LIMITS.organistName.max} caracteres.`,
  organistNameInvalid: 'Use apenas letras e espaços no nome da organista.',
  organistNameWords: 'Informe somente o primeiro nome ou nome e sobrenome.',
  churchCodeMax: `Código deve ter no máximo ${FORM_LIMITS.churchCode.max} caracteres.`,
  churchCodeInvalid:
    'Código contém caracteres inválidos. Use apenas letras, números, hífen e underscore.',
  rehearsalRequired: 'Preencha os dados do ensaio local.',
  rehearsalWeekRequired: 'Selecione a semana do mês do ensaio.',
  rehearsalWeekdayRequired: 'Selecione o dia da semana do ensaio.',
  rehearsalTimeInvalid: 'Informe um horário válido no formato HH:MM.',
  rehearsalNotesMax: `A observação do ensaio pode ter no máximo ${FORM_LIMITS.rehearsalNotes.max} caracteres.`,
};
