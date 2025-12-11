/**
 * Utilitários de validação
 * Centraliza todas as validações de inputs do sistema
 */

/**
 * Valida nome da igreja
 * @param {string} name - Nome da igreja
 * @returns {{isValid: boolean, error?: string}}
 */
export const validateChurchName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Nome da igreja é obrigatório.' };
  }
  
  if (name.trim().length < 3) {
    return { isValid: false, error: 'Nome deve ter pelo menos 3 caracteres.' };
  }
  
  if (name.length > 100) {
    return { isValid: false, error: 'Nome deve ter no máximo 100 caracteres.' };
  }
  
  // Remove caracteres perigosos (XSS prevention)
  const dangerousChars = /[<>\"'&]/;
  if (dangerousChars.test(name)) {
    return { isValid: false, error: 'Nome contém caracteres inválidos.' };
  }
  
  return { isValid: true };
};

/**
 * Valida nome do organista
 * @param {string} name - Nome do organista
 * @returns {{isValid: boolean, error?: string}}
 */
export const validateOrganistName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Nome do organista é obrigatório.' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres.' };
  }
  
  if (name.length > 100) {
    return { isValid: false, error: 'Nome deve ter no máximo 100 caracteres.' };
  }
  
  // Remove caracteres perigosos
  const dangerousChars = /[<>\"'&]/;
  if (dangerousChars.test(name)) {
    return { isValid: false, error: 'Nome contém caracteres inválidos.' };
  }
  
  return { isValid: true };
};

/**
 * Valida código da igreja
 * @param {string} code - Código da igreja
 * @returns {{isValid: boolean, error?: string}}
 */
export const validateChurchCode = (code) => {
  if (!code || code.trim().length === 0) {
    return { isValid: true }; // Código é opcional
  }
  
  if (code.length > 50) {
    return { isValid: false, error: 'Código deve ter no máximo 50 caracteres.' };
  }
  
  // Permite apenas letras, números, hífen e underscore
  const validCodePattern = /^[a-zA-Z0-9_-]+$/;
  if (!validCodePattern.test(code)) {
    return { isValid: false, error: 'Código contém caracteres inválidos. Use apenas letras, números, hífen e underscore.' };
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
  
  return { isValid: true };
};

/**
 * Sanitiza string removendo caracteres perigosos
 * @param {string} input - String a ser sanitizada
 * @returns {string} String sanitizada
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove caracteres perigosos
    .replace(/\s+/g, ' '); // Normaliza espaços
};

