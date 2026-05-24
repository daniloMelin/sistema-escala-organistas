import { act, renderHook, waitFor } from '@testing-library/react';
import { useChurchManager } from '../hooks/useChurchManager';
import { INITIAL_REHEARSAL } from '../constants/rehearsal';

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

  test('ordena as igrejas por prioridade operacional e depois por nome', async () => {
    mockGetChurches.mockResolvedValue([
      {
        id: 'church-ready-b',
        name: 'Beta',
        code: 'BET',
        config: {
          sunday: [{ id: 'MeiaHoraCulto' }, { id: 'Culto' }],
        },
        cultoModel: 'meia_hora_e_culto',
      },
      {
        id: 'church-incomplete',
        name: 'Alfa',
        code: 'ALF',
        config: {},
        cultoModel: 'culto_unico_com_reserva',
      },
      {
        id: 'church-warning',
        name: 'Gama',
        code: 'GAM',
        config: {
          sunday: [{ id: 'Culto' }, { id: 'Reserva' }],
        },
        cultoModel: 'culto_unico_com_reserva',
      },
      {
        id: 'church-ready-a',
        name: 'Aquarela',
        code: 'AQU',
        config: {
          sunday: [{ id: 'MeiaHoraCulto' }, { id: 'Culto' }],
        },
        cultoModel: 'meia_hora_e_culto',
      },
    ]);

    mockGetOrganistsByChurch.mockImplementation(async (_, churchId) => {
      if (churchId === 'church-incomplete') {
        return [];
      }

      if (churchId === 'church-warning') {
        return [
          { id: 'org-1', name: 'Ana' },
          { id: 'org-2', name: 'Bia' },
        ];
      }

      return [
        { id: 'org-1', name: 'Ana' },
        { id: 'org-2', name: 'Bia' },
        { id: 'org-3', name: 'Carla' },
      ];
    });

    mockGetChurchScheduleCount.mockImplementation(async (_, churchId) => {
      if (churchId === 'church-warning' || churchId === 'church-incomplete') {
        return 0;
      }

      return 2;
    });

    const { result } = renderHook(() => useChurchManager(user));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.churches.map((church) => church.name)).toEqual([
      'Alfa',
      'Gama',
      'Aquarela',
      'Beta',
    ]);
  });

  test('salva ensaio local estruturado ao cadastrar igreja', async () => {
    const { result } = renderHook(() => useChurchManager(user));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setChurchName('Igreja com Ensaio');
      result.current.handleRehearsalChange('weekOfMonth', '1');
      result.current.handleRehearsalChange('weekday', 'thursday');
      result.current.handleRehearsalChange('time', '19:30');
      result.current.handleRehearsalChange('notes', 'Culto começa às 19:00.');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() });
    });

    expect(mockAddChurch).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        name: 'Igreja com Ensaio',
        rehearsal: {
          weekOfMonth: 1,
          weekday: 'thursday',
          time: '19:30',
          notes: 'Culto começa às 19:00.',
        },
      })
    );
  });

  test('preenche erro por campo ao validar nome invalido da igreja', async () => {
    const { result } = renderHook(() => useChurchManager(user));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleChurchNameChange('Igreja <Central>');
    });

    act(() => {
      result.current.handleChurchNameBlur();
    });

    expect(result.current.fieldErrors.churchName).toBe(
      'Use apenas letras e espaços no nome da igreja.'
    );
  });

  test('carrega ensaio local ao iniciar edicao da igreja', async () => {
    mockGetChurches.mockResolvedValue([
      {
        id: 'church-ready',
        name: 'Igreja Pronta',
        code: 'READY',
        config: {
          sunday: [{ id: 'MeiaHoraCulto' }, { id: 'Culto' }],
        },
        cultoModel: 'meia_hora_e_culto',
        rehearsal: {
          enabled: true,
          weekOfMonth: 2,
          weekday: 'friday',
          time: '20:00',
          notes: 'Ensaio local mensal.',
        },
      },
    ]);

    const { result } = renderHook(() => useChurchManager(user));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleStartEdit(
        { stopPropagation: jest.fn() },
        result.current.churches.find((church) => church.id === 'church-ready')
      );
    });

    expect(result.current.rehearsal).toEqual({
      weekOfMonth: '2',
      weekday: 'friday',
      time: '20:00',
      notes: 'Ensaio local mensal.',
    });
    expect(result.current.rehearsal).not.toEqual(INITIAL_REHEARSAL);
  });

  test('preserva codigo legado e atualiza modelo de culto ao editar igreja', async () => {
    mockGetChurches.mockResolvedValue([
      {
        id: 'church-legacy',
        name: 'Igreja Legada',
        code: 'LEGACY',
        config: {
          thursday: [{ id: 'MeiaHoraCulto' }, { id: 'Culto' }],
        },
        cultoModel: 'meia_hora_e_culto',
        rehearsal: {
          weekOfMonth: 1,
          weekday: 'thursday',
          time: '19:30',
          notes: '',
        },
      },
    ]);
    mockGetOrganistsByChurch.mockResolvedValue([]);
    mockGetChurchScheduleCount.mockResolvedValue(0);

    const { result } = renderHook(() => useChurchManager(user));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleStartEdit(
        { stopPropagation: jest.fn() },
        result.current.churches.find((church) => church.id === 'church-legacy')
      );
      result.current.handleChurchNameChange('Igreja Legada Atualizada');
      result.current.setCultoModel('culto_unico_com_reserva');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() });
    });

    expect(mockUpdateChurch).toHaveBeenCalledWith(
      'user-1',
      'church-legacy',
      expect.objectContaining({
        name: 'Igreja Legada Atualizada',
        code: 'LEGACY',
        cultoModel: 'culto_unico_com_reserva',
        config: {
          thursday: [
            { id: 'Culto', label: 'Culto', needs: 1 },
            { id: 'Reserva', label: 'Reserva', needs: 1 },
          ],
        },
      })
    );
  });

  test('limpa edicao ao excluir a igreja em edicao', async () => {
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
    ]);
    mockGetOrganistsByChurch.mockResolvedValue([]);
    mockGetChurchScheduleCount.mockResolvedValue(0);

    const { result } = renderHook(() => useChurchManager(user));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      const church = result.current.churches.find((item) => item.id === 'church-ready');
      result.current.handleStartEdit({ stopPropagation: jest.fn() }, church);
      result.current.handleRequestDeleteChurch(
        { stopPropagation: jest.fn() },
        church.id,
        church.name
      );
    });

    await act(async () => {
      await result.current.handleConfirmDeleteChurch();
    });

    expect(mockDeleteChurchWithSubcollections).toHaveBeenCalledWith('user-1', 'church-ready');
    expect(result.current.editingId).toBe(null);
    expect(result.current.churchName).toBe('');
    expect(result.current.pendingDeleteChurch).toBe(null);
  });
});
