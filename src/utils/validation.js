/**
 * Utilitários de validação
 * Centraliza todas as validações de inputs do sistema
 */

import { FORM_ERROR_MESSAGES, FORM_LIMITS } from '../constants/formValidation';

const CHURCH_NAME_PATTERN = /^[A-Za-zÀ-ÿ0-9]+(?:[A-Za-zÀ-ÿ0-9 ]*[A-Za-zÀ-ÿ0-9])?$/;
const ORGANIST_NAME_PATTERN = /^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)?$/;

const normalizeWhitespace = (value) =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';

/**
 * Valida nome da igreja
 * @param {string} name - Nome da igreja
 * @returns {{isValid: boolean, error?: string}}
 */
export const validateChurchName = (name) => {
  const normalizedName = normalizeWhitespace(name);

  if (!normalizedName) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.churchNameRequired };
  }

  if (normalizedName.length < FORM_LIMITS.churchName.min) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.churchNameMin };
  }

  if (normalizedName.length > FORM_LIMITS.churchName.max) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.churchNameMax };
  }

  if (!CHURCH_NAME_PATTERN.test(normalizedName)) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.churchNameInvalid };
  }

  return { isValid: true };
};

/**
 * Valida nome do organista
 * @param {string} name - Nome do organista
 * @returns {{isValid: boolean, error?: string}}
 */
export const validateOrganistName = (name) => {
  const normalizedName = normalizeWhitespace(name);

  if (!normalizedName) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.organistNameRequired };
  }

  if (normalizedName.length < FORM_LIMITS.organistName.min) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.organistNameMin };
  }

  if (normalizedName.length > FORM_LIMITS.organistName.max) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.organistNameMax };
  }

  const words = normalizedName.split(' ').filter(Boolean);
  if (words.length > FORM_LIMITS.organistName.maxWords) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.organistNameWords };
  }

  if (!ORGANIST_NAME_PATTERN.test(normalizedName)) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.organistNameInvalid };
  }

  return { isValid: true };
};

/**
 * Valida código da igreja
 * @param {string} code - Código da igreja
 * @returns {{isValid: boolean, error?: string}}
 */
export const validateChurchCode = (code) => {
  const normalizedCode = normalizeWhitespace(code);

  if (!normalizedCode) {
    return { isValid: true }; // Código é opcional
  }

  if (normalizedCode.length > FORM_LIMITS.churchCode.max) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.churchCodeMax };
  }

  // Permite apenas letras, números, hífen e underscore
  const validCodePattern = /^[a-zA-Z0-9_-]+$/;
  if (!validCodePattern.test(normalizedCode)) {
    return {
      isValid: false,
      error: FORM_ERROR_MESSAGES.churchCodeInvalid,
    };
  }

  return { isValid: true };
};

/**
 * Valida configuracao de ensaio local por igreja
 * @param {object} rehearsal - Dados do ensaio local
 * @returns {{isValid: boolean, error?: string}}
 */
export const validateChurchRehearsal = (rehearsal) => {
  if (!rehearsal || typeof rehearsal !== 'object') {
    return { isValid: false, error: FORM_ERROR_MESSAGES.rehearsalRequired };
  }

  const validWeekOptions = ['1', '2', '3', '4', '5', 1, 2, 3, 4, 5];
  if (!validWeekOptions.includes(rehearsal.weekOfMonth)) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.rehearsalWeekRequired };
  }

  const validWeekdays = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  if (!validWeekdays.includes(rehearsal.weekday)) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.rehearsalWeekdayRequired };
  }

  const validTimePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!validTimePattern.test(rehearsal.time || '')) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.rehearsalTimeInvalid };
  }

  if (normalizeWhitespace(rehearsal.notes).length > FORM_LIMITS.rehearsalNotes.max) {
    return { isValid: false, error: FORM_ERROR_MESSAGES.rehearsalNotesMax };
  }

  return { isValid: true };
};

/**
 * Valida período de datas
 * @param {string} startDate - Data de início (YYYY-MM-DD)
 * @param {string} endDate - Data de fim (YYYY-MM-DD)
 * @returns {{isValid: boolean, error?: string}}
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { isValid: false, error: 'Defina as datas de início e fim.' };
  }

  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Datas inválidas.' };
  }

  if (start > end) {
    return { isValid: false, error: 'Data de início deve ser anterior à data de fim.' };
  }

  // Limita o período a 1 ano
  const oneYearFromStart = new Date(start);
  oneYearFromStart.setFullYear(oneYearFromStart.getFullYear() + 1);

  if (end > oneYearFromStart) {
    return { isValid: false, error: 'Período não pode exceder 1 ano.' };
  }

  const calendarMonthSpan =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;

  if (calendarMonthSpan > 3) {
    return {
      isValid: false,
      error:
        'A escala deve ficar dentro de até 3 meses. Ajuste a data final para não entrar no 4º mês.',
    };
  }

  return { isValid: true };
};

/**
 * Sanitiza string removendo caracteres perigosos
 * @param {string} input - String a ser sanitizada
 * @returns {string} String sanitizada
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';

  return normalizeWhitespace(input)
    .replace(/[<>"'&]/g, '') // Remove caracteres perigosos
    .trim();
};
