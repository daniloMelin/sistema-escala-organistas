/**
 * Utilitários para manipulação de datas
 * Centraliza funções relacionadas a datas para evitar duplicação
 */

/**
 * Converte string de data no formato DD/MM/YYYY para label de mês/ano
 * @param {string} dateStr - Data no formato DD/MM/YYYY
 * @returns {string} Label no formato "Mês de Ano" (ex: "Janeiro de 2024")
 */
export const getMonthYearLabel = (dateStr) => {
  if (!dateStr) return '';
  
  const parts = dateStr.split('/');
  if (parts.length < 3) return dateStr;

  const monthIndex = parseInt(parts[1], 10) - 1;
  const year = parts[2];
  
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  if (monthIndex < 0 || monthIndex > 11) return dateStr;
  
  return `${months[monthIndex]} de ${year}`;
};

/**
 * Valida formato de data
 * @param {string} dateStr - Data no formato YYYY-MM-DD ou DD/MM/YYYY
 * @returns {boolean} True se a data é válida
 */
export const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

/**
 * Formata data para exibição
 * @param {string} dateStr - Data no formato YYYY-MM-DD
 * @returns {string} Data formatada como DD/MM/YYYY
 */
export const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return dateStr;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

