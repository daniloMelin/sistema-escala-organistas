import { SERVICE_TEMPLATES } from './scheduleLogic';
import { INITIAL_AVAILABILITY } from '../constants/days';

export const CULT_MODELS = {
  culto_unico_com_reserva: {
    id: 'culto_unico_com_reserva',
    label: 'Culto único com reserva',
    description: '1 organista no culto e 1 reserva por dia de culto.',
    serviceTemplates: [
      { id: 'Culto', label: 'Culto', needs: 1 },
      { id: 'Reserva', label: 'Reserva', needs: 1 },
    ],
  },
  meia_hora_e_culto: {
    id: 'meia_hora_e_culto',
    label: 'Meia hora e culto',
    description: '2 organistas por culto: meia hora e culto.',
    serviceTemplates: [SERVICE_TEMPLATES.MeiaHora, SERVICE_TEMPLATES.Culto],
  },
  meia_hora_parte1_parte2: {
    id: 'meia_hora_parte1_parte2',
    label: 'Meia hora, parte 1 e parte 2',
    description: '3 organistas por culto: meia hora, parte 1 e parte 2.',
    serviceTemplates: [
      SERVICE_TEMPLATES.MeiaHora,
      { id: 'Parte1', label: 'Parte 1', needs: 1 },
      { id: 'Parte2', label: 'Parte 2', needs: 1 },
    ],
  },
};

export const DEFAULT_CULT_MODEL = 'meia_hora_e_culto';

const NON_RJM_SERVICE_IDS = new Set(['Culto', 'Reserva', 'MeiaHoraCulto', 'Parte1', 'Parte2']);

export const CULT_MODEL_OPTIONS = Object.values(CULT_MODELS);

export const getCultModelServices = (cultoModel = DEFAULT_CULT_MODEL) =>
  CULT_MODELS[cultoModel]?.serviceTemplates || CULT_MODELS[DEFAULT_CULT_MODEL].serviceTemplates;

export const buildChurchConfig = (selectedDays, cultoModel = DEFAULT_CULT_MODEL) => {
  const config = {};

  const addServicesToDay = (dayKey, servicesToAdd) => {
    if (!config[dayKey]) config[dayKey] = [];
    config[dayKey].push(...servicesToAdd);
  };

  if (selectedDays.sunday_rjm) {
    addServicesToDay('sunday', [SERVICE_TEMPLATES.RJM]);
  }

  if (selectedDays.sunday_culto) {
    addServicesToDay('sunday', getCultModelServices(cultoModel));
  }

  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach((day) => {
    if (selectedDays[day]) {
      addServicesToDay(day, getCultModelServices(cultoModel));
    }
  });

  return config;
};

export const inferCultModelFromConfig = (config) => {
  if (!config || typeof config !== 'object') return DEFAULT_CULT_MODEL;

  const days = Object.values(config).filter(Array.isArray);

  if (
    days.some((services) => {
      const ids = services.map((service) => service.id);
      return ids.includes('Culto') && ids.includes('Reserva');
    })
  ) {
    return 'culto_unico_com_reserva';
  }

  if (
    days.some((services) => {
      const ids = services.map((service) => service.id);
      return ids.includes('Parte1') || ids.includes('Parte2');
    })
  ) {
    return 'meia_hora_parte1_parte2';
  }

  return DEFAULT_CULT_MODEL;
};

export const inferSelectedDaysFromConfig = (config) => {
  const newSelection = { ...INITIAL_AVAILABILITY };
  if (!config || typeof config !== 'object') return newSelection;

  Object.keys(config).forEach((dayKey) => {
    const services = config[dayKey];
    if (!Array.isArray(services)) return;

    if (dayKey === 'sunday') {
      if (services.some((service) => service.id === 'RJM')) {
        newSelection.sunday_rjm = true;
      }
      if (services.some((service) => NON_RJM_SERVICE_IDS.has(service.id))) {
        newSelection.sunday_culto = true;
      }
      return;
    }

    if (Object.prototype.hasOwnProperty.call(newSelection, dayKey) && services.length > 0) {
      newSelection[dayKey] = true;
    }
  });

  return newSelection;
};

export const getVisibleDaysFromConfig = (config, allWeekDays) => {
  if (!config || typeof config !== 'object') return allWeekDays;

  return allWeekDays.filter((dayObj) => {
    if (dayObj.key === 'sunday_rjm') {
      return config.sunday && config.sunday.some((service) => service.id === 'RJM');
    }

    if (dayObj.key === 'sunday_culto') {
      return config.sunday && config.sunday.some((service) => NON_RJM_SERVICE_IDS.has(service.id));
    }

    return Object.prototype.hasOwnProperty.call(config, dayObj.key);
  });
};
