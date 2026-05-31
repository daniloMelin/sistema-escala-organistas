import { act, renderHook, waitFor } from '@testing-library/react';
import { useChurchScheduleGenerator } from '../hooks/useChurchScheduleGenerator';
import { SERVICE_TEMPLATES } from '../utils/scheduleLogic';
import { exportScheduleToPDF } from '../utils/pdfGenerator';

jest.mock(
  'react-router-dom',
  () => ({
    useParams: () => ({ id: 'church-1' }),
  }),
  { virtual: true }
);

jest.mock('../utils/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('../utils/pdfGenerator', () => ({
  exportScheduleToPDF: jest.fn(),
}));

const mockGetOrganistsByChurch = jest.fn();
const mockSaveScheduleToChurch = jest.fn();
const mockGetChurchSchedules = jest.fn();
const mockGetChurch = jest.fn();

jest.mock('../services/firebaseService', () => ({
  getOrganistsByChurch: (...args) => mockGetOrganistsByChurch(...args),
  saveScheduleToChurch: (...args) => mockSaveScheduleToChurch(...args),
  getChurchSchedules: (...args) => mockGetChurchSchedules(...args),
  getChurch: (...args) => mockGetChurch(...args),
}));

describe('useChurchScheduleGenerator', () => {
  const user = { uid: 'user-1' };
  const selectedChurch = {
    id: 'church-1',
    name: 'Igreja Central',
    rehearsal: {
      weekOfMonth: 1,
      weekday: 'thursday',
      time: '19:30',
      notes: '',
    },
  };
  const churchConfig = {
    tuesday: [SERVICE_TEMPLATES.MeiaHora, SERVICE_TEMPLATES.Culto],
  };
  const organists = [
    { id: 'org-1', name: 'Ana', availability: { tuesday: true } },
    { id: 'org-2', name: 'Bia', availability: { tuesday: true } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
    mockGetOrganistsByChurch.mockResolvedValue(organists);
    mockGetChurch.mockResolvedValue({
      id: 'church-1',
      name: 'Igreja da Rota',
      rehearsal: {
        weekOfMonth: 3,
        weekday: 'tuesday',
        time: '20:00',
        notes: 'Usar igreja da rota.',
      },
      config: churchConfig,
    });
    mockGetChurchSchedules.mockResolvedValue([]);
  });

  test('bloqueia geração quando o período entra no quarto mês', async () => {
    const { result } = renderHook(() => useChurchScheduleGenerator(user, selectedChurch));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.church).toEqual(expect.objectContaining({ config: churchConfig }));

    act(() => {
      result.current.setStartDate('2026-04-01');
      result.current.setEndDate('2026-07-01');
    });

    await act(async () => {
      await result.current.handleGenerate();
    });

    expect(mockSaveScheduleToChurch).not.toHaveBeenCalled();
    expect(result.current.generatedSchedule).toEqual([]);
    expect(result.current.error).toBe(
      'A escala deve ficar dentro de até 3 meses. Ajuste a data final para não entrar no 4º mês.'
    );
  });

  test('gera, salva e recarrega escala válida dentro de três meses', async () => {
    const savedSchedule = {
      id: 'saved-1',
      period: { start: '2026-03-03', end: '2026-05-26' },
      generatedAt: '2026-03-01T10:00:00.000Z',
      data: [{ date: '03/03/2026', assignments: { MeiaHoraCulto: 'Ana', Culto: 'Bia' } }],
      organistCount: 2,
    };
    mockGetChurchSchedules.mockResolvedValueOnce([]).mockResolvedValueOnce([savedSchedule]);

    const { result } = renderHook(() => useChurchScheduleGenerator(user, selectedChurch));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setStartDate('2026-03-03');
      result.current.setEndDate('2026-05-26');
    });

    await act(async () => {
      await result.current.handleGenerate();
    });

    expect(mockSaveScheduleToChurch).toHaveBeenCalledTimes(1);
    expect(mockSaveScheduleToChurch).toHaveBeenCalledWith(
      'user-1',
      'church-1',
      expect.stringMatching(/^escala_2026-03-03_2026-05-26_/),
      expect.objectContaining({
        period: { start: '2026-03-03', end: '2026-05-26' },
        organistCount: 2,
        data: expect.any(Array),
      })
    );
    expect(result.current.generatedSchedule.length).toBeGreaterThan(0);
    expect(result.current.savedSchedules).toEqual([savedSchedule]);
    expect(result.current.successMessage).toBe(
      'Escala de 03/03/2026 até 26/05/2026 gerada e salva com sucesso.'
    );
  });

  test('reabre escala salva preservando período e dados', async () => {
    const savedSchedule = {
      id: 'saved-1',
      period: { start: '2026-03-03', end: '2026-03-31' },
      data: [{ date: '03/03/2026', assignments: { MeiaHoraCulto: 'Ana', Culto: 'Bia' } }],
    };

    const { result } = renderHook(() => useChurchScheduleGenerator(user, selectedChurch));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleViewSaved(savedSchedule);
    });

    expect(result.current.startDate).toBe('2026-03-03');
    expect(result.current.endDate).toBe('2026-03-31');
    expect(result.current.generatedSchedule).toEqual(savedSchedule.data);
    expect(result.current.successMessage).toBe(
      'Visualizando escala salva de 03/03/2026 até 31/03/2026.'
    );
  });

  test('usa a igreja da rota ao exportar quando selectedChurch diverge do id', async () => {
    const staleSelectedChurch = {
      id: 'church-2',
      name: 'Igreja Antiga',
      rehearsal: {
        weekOfMonth: 1,
        weekday: 'thursday',
        time: '19:30',
        notes: 'Nao usar.',
      },
    };

    const { result } = renderHook(() => useChurchScheduleGenerator(user, staleSelectedChurch));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleViewSaved({
        id: 'saved-1',
        period: { start: '2026-03-03', end: '2026-03-31' },
        data: [{ date: '03/03/2026', assignments: { MeiaHoraCulto: 'Ana', Culto: 'Bia' } }],
      });
    });

    act(() => {
      result.current.handleExportClick();
    });

    expect(exportScheduleToPDF).toHaveBeenCalledWith(
      expect.any(Array),
      '2026-03-03',
      '2026-03-31',
      'Igreja da Rota',
      expect.objectContaining({
        weekOfMonth: 3,
        weekday: 'tuesday',
        time: '20:00',
        notes: 'Usar igreja da rota.',
      })
    );
  });
});
