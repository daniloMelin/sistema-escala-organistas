import { renderHook, waitFor } from '@testing-library/react';
import { useChurchManager } from '../hooks/useChurchManager';

const mockNavigate = jest.fn();
const mockSetSelectedChurch = jest.fn();

jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => mockNavigate,
  }),
  { virtual: true }
);

jest.mock('../contexts/ChurchContext', () => ({
  useChurch: () => ({
    setSelectedChurch: mockSetSelectedChurch,
  }),
}));

jest.mock('../utils/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

const mockGetChurches = jest.fn();
const mockAddChurch = jest.fn();
const mockDeleteChurchWithSubcollections = jest.fn();
const mockUpdateChurch = jest.fn();
const mockGetOrganistsByChurch = jest.fn();
const mockGetChurchScheduleCount = jest.fn();

jest.mock('../services/firebaseService', () => ({
  getChurches: (...args) => mockGetChurches(...args),
  addChurch: (...args) => mockAddChurch(...args),
  deleteChurchWithSubcollections: (...args) => mockDeleteChurchWithSubcollections(...args),
  updateChurch: (...args) => mockUpdateChurch(...args),
  getOrganistsByChurch: (...args) => mockGetOrganistsByChurch(...args),
  getChurchScheduleCount: (...args) => mockGetChurchScheduleCount(...args),
}));

describe('useChurchManager', () => {
  const user = { uid: 'user-1' };

  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
    mockGetChurches.mockResolvedValue([
      {
        id: 'church-ready',
        name: 'Igreja Pronta',
        code: 'READY',
        config: {
          sunday: [{ id: 'MeiaHoraCulto' }, { id: 'Culto' }],
        },
        cultoModel: 'meia_hora_e_culto',
      },
      {
        id: 'church-fallback',
        name: 'Igreja Parcial',
        code: 'PART',
        config: {
          sunday: [{ id: 'Culto' }, { id: 'Reserva' }],
        },
        cultoModel: 'culto_unico_com_reserva',
      },
    ]);
    mockGetOrganistsByChurch.mockImplementation(async (_, churchId) => {
      if (churchId === 'church-ready') {
        return [
          { id: 'org-1', name: 'Ana' },
          { id: 'org-2', name: 'Bia' },
        ];
      }
      throw new Error('Falha ao carregar organistas');
    });
    mockGetChurchScheduleCount.mockImplementation(async (_, churchId) => {
      if (churchId === 'church-ready') {
        return 1205;
      }
      throw new Error('Falha ao contar escalas');
    });
  });

  test('mantem a lista carregada quando o resumo de uma igreja falha', async () => {
    const { result } = renderHook(() => useChurchManager(user));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.loadError).toBe('');
    expect(result.current.churches).toHaveLength(2);

    const readyChurch = result.current.churches.find((church) => church.id === 'church-ready');
    const fallbackChurch = result.current.churches.find(
      (church) => church.id === 'church-fallback'
    );

    expect(readyChurch.operationalSummary).toEqual(
      expect.objectContaining({
        organistCount: 2,
        scheduleCount: 1205,
      })
    );
    expect(fallbackChurch.operationalSummary).toBeUndefined();
    expect(fallbackChurch.cultoModel).toBe('culto_unico_com_reserva');
  });

  test('usa a contagem total de escalas no resumo operacional', async () => {
    const { result } = renderHook(() => useChurchManager(user));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const readyChurch = result.current.churches.find((church) => church.id === 'church-ready');

    expect(mockGetChurchScheduleCount).toHaveBeenCalledWith('user-1', 'church-ready');
    expect(readyChurch.operationalSummary.scheduleCount).toBe(1205);
    expect(readyChurch.operationalSummary.readiness.label).toBe('Pronta');
  });
});
