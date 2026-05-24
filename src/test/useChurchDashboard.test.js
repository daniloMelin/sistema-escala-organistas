import { renderHook, act, waitFor } from '@testing-library/react';
import { useChurchDashboard } from '../hooks/useChurchDashboard';
import { INITIAL_AVAILABILITY } from '../constants/days';

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

const mockGetOrganistsByChurch = jest.fn();
const mockAddOrganistToChurch = jest.fn();
const mockDeleteOrganistFromChurch = jest.fn();
const mockUpdateOrganistInChurch = jest.fn();
const mockGetChurch = jest.fn();

jest.mock('../services/firebaseService', () => ({
  getOrganistsByChurch: (...args) => mockGetOrganistsByChurch(...args),
  addOrganistToChurch: (...args) => mockAddOrganistToChurch(...args),
  deleteOrganistFromChurch: (...args) => mockDeleteOrganistFromChurch(...args),
  updateOrganistInChurch: (...args) => mockUpdateOrganistInChurch(...args),
  getChurch: (...args) => mockGetChurch(...args),
}));

describe('useChurchDashboard', () => {
  const user = { uid: 'user-1', email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
    mockGetOrganistsByChurch.mockResolvedValue([
      { id: 'org-1', name: 'Ana', availability: { sunday_culto: true } },
    ]);
    mockGetChurch.mockResolvedValue({
      config: {
        sunday: [{ id: 'RJM' }, { id: 'Culto' }, { id: 'Reserva' }],
        tuesday: [{ id: 'MeiaHoraCulto' }, { id: 'Parte1' }, { id: 'Parte2' }],
      },
    });
  });

  test('carrega organistas e dias visiveis com base na configuracao da igreja', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockGetOrganistsByChurch).toHaveBeenCalledWith('user-1', 'church-1');
    expect(mockGetChurch).toHaveBeenCalledWith('user-1', 'church-1');
    expect(result.current.organists).toHaveLength(1);
    expect(result.current.visibleDays.map((d) => d.key)).toEqual(
      expect.arrayContaining(['sunday_rjm', 'sunday_culto', 'tuesday'])
    );
  });

  test('usa todos os dias quando a igreja nao possui configuracao', async () => {
    mockGetChurch.mockResolvedValue({});

    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.visibleDays).toHaveLength(8);
  });

  test('exibe erro quando falha ao carregar dados da igreja', async () => {
    mockGetOrganistsByChurch.mockRejectedValue(new Error('falha'));

    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.error).toBe('Falha ao carregar dados da igreja.'));

    expect(result.current.loading).toBe(false);
  });

  test('salva nova organista e redefine o estado de edicao', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setNewOrganistName('  Maria  ');
      result.current.handleCheckboxChange({
        target: { name: 'tuesday', checked: true },
      });
    });

    await act(async () => {
      await result.current.handleSaveOrganist({ preventDefault: jest.fn() });
    });

    expect(mockAddOrganistToChurch).toHaveBeenCalledTimes(1);
    expect(mockAddOrganistToChurch).toHaveBeenCalledWith(
      'user-1',
      'church-1',
      expect.objectContaining({
        name: 'Maria',
        availability: expect.objectContaining({ tuesday: true }),
      })
    );
    expect(result.current.newOrganistName).toBe('');
    expect(result.current.editingId).toBe(null);
    expect(result.current.availability).toEqual(INITIAL_AVAILABILITY);
  });

  test('impede cadastrar organista com nome duplicado na mesma igreja', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setNewOrganistName(' ana ');
      result.current.handleCheckboxChange({
        target: { name: 'sunday_culto', checked: true },
      });
    });

    await act(async () => {
      await result.current.handleSaveOrganist({ preventDefault: jest.fn() });
    });

    expect(mockAddOrganistToChurch).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Já existe uma organista com este nome nesta igreja.');
  });

  test('preenche erro por campo ao validar nome invalido da organista', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleOrganistNameChange('Ana Maria Silva');
    });

    act(() => {
      result.current.handleOrganistNameBlur();
    });

    expect(result.current.fieldErrors.organistName).toBe(
      'Informe somente o primeiro nome ou nome e sobrenome.'
    );
  });

  test('bloqueia envio com nome invalido da organista', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleOrganistNameChange('Ana 1');
    });

    await act(async () => {
      await result.current.handleSaveOrganist({ preventDefault: jest.fn() });
    });

    expect(mockAddOrganistToChurch).not.toHaveBeenCalled();
    expect(result.current.fieldErrors.organistName).toBe(
      'Use apenas letras e espaços no nome da organista.'
    );
    expect(result.current.error).toBe('');
  });

  test('bloqueia envio sem disponibilidade selecionada', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setNewOrganistName('Ana Maria');
    });

    await act(async () => {
      await result.current.handleSaveOrganist({ preventDefault: jest.fn() });
    });

    expect(mockAddOrganistToChurch).not.toHaveBeenCalled();
    expect(result.current.fieldErrors.availability).toBe(
      'Selecione pelo menos um dia de disponibilidade da organista.'
    );
    expect(result.current.error).toBe('');
  });

  test('limpa erro de disponibilidade ao marcar um dia', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setNewOrganistName('Ana Maria');
    });

    await act(async () => {
      await result.current.handleSaveOrganist({ preventDefault: jest.fn() });
    });

    expect(result.current.fieldErrors.availability).toBeTruthy();

    act(() => {
      result.current.handleCheckboxChange({
        target: { name: 'sunday_culto', checked: true },
      });
    });

    expect(result.current.fieldErrors.availability).toBe('');
  });

  test('limpa erro por campo ao voltar a digitar', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleOrganistNameChange('Ana Maria Silva');
    });

    act(() => {
      result.current.handleOrganistNameBlur();
    });

    expect(result.current.fieldErrors.organistName).toBeTruthy();

    act(() => {
      result.current.handleOrganistNameChange('Ana Maria');
    });

    expect(result.current.fieldErrors.organistName).toBe('');
  });

  test('permite salvar alteracoes de disponibilidade com nome legado inalterado', async () => {
    mockGetOrganistsByChurch.mockResolvedValue([
      {
        id: 'org-1',
        name: 'Anastacia Bernardina Conceicao Alexandrina',
        availability: { sunday_culto: true },
      },
    ]);

    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleStartEdit({
        id: 'org-1',
        name: 'Anastacia Bernardina Conceicao Alexandrina',
        availability: { sunday_culto: true },
      });
      result.current.handleCheckboxChange({
        target: { name: 'friday', checked: true },
      });
    });

    act(() => {
      result.current.handleOrganistNameBlur();
    });

    expect(result.current.fieldErrors.organistName).toBe('');

    await act(async () => {
      await result.current.handleSaveOrganist({ preventDefault: jest.fn() });
    });

    expect(mockUpdateOrganistInChurch).toHaveBeenCalledWith(
      'user-1',
      'church-1',
      'org-1',
      expect.objectContaining({
        name: 'Anastacia Bernardina Conceicao Alexandrina',
        availability: expect.objectContaining({ friday: true }),
      })
    );
  });

  test('permite editar a mesma organista sem bloquear pelo proprio nome', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleStartEdit({
        id: 'org-1',
        name: 'Ana',
        availability: { sunday_culto: true },
      });
      result.current.setNewOrganistName(' Ana ');
    });

    await act(async () => {
      await result.current.handleSaveOrganist({ preventDefault: jest.fn() });
    });

    expect(mockUpdateOrganistInChurch).toHaveBeenCalledWith(
      'user-1',
      'church-1',
      'org-1',
      expect.objectContaining({ name: 'Ana' })
    );
    expect(result.current.error).toBe('');
  });

  test('mapeia disponibilidade antiga de sunday para sunday_culto ao editar', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleStartEdit({
        id: 'org-1',
        name: 'Ana',
        availability: { sunday: true },
      });
    });

    expect(result.current.availability.sunday_culto).toBe(true);
  });

  test('retorna erro de identificacao quando faltam dados obrigatorios', async () => {
    const { result } = renderHook(() => useChurchDashboard(null));

    act(() => {
      result.current.handleOrganistNameChange('Maria');
      result.current.handleCheckboxChange({
        target: { name: 'sunday_culto', checked: true },
      });
    });

    await act(async () => {
      await result.current.handleSaveOrganist({ preventDefault: jest.fn() });
    });

    expect(result.current.error).toBe('Erro de identificação.');
  });

  test('exibe erro quando falha ao salvar organista', async () => {
    mockAddOrganistToChurch.mockRejectedValue(new Error('falha ao salvar'));

    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleOrganistNameChange('Maria');
      result.current.handleCheckboxChange({
        target: { name: 'sunday_culto', checked: true },
      });
    });

    await act(async () => {
      await result.current.handleSaveOrganist({ preventDefault: jest.fn() });
    });

    expect(result.current.error).toBe('Erro ao salvar organista.');
  });

  test('solicita e confirma a exclusao de organista', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleRequestDeleteOrganist('org-1', 'Ana');
    });
    expect(result.current.pendingDeleteOrganist).toEqual({ id: 'org-1', name: 'Ana' });

    await act(async () => {
      await result.current.handleConfirmDeleteOrganist();
    });

    expect(mockDeleteOrganistFromChurch).toHaveBeenCalledWith('user-1', 'church-1', 'org-1');
    expect(result.current.pendingDeleteOrganist).toBe(null);
  });

  test('limpa edicao ao excluir a organista em edicao', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleStartEdit({
        id: 'org-1',
        name: 'Ana',
        availability: { sunday_culto: true },
      });
      result.current.handleRequestDeleteOrganist('org-1', 'Ana');
    });

    await act(async () => {
      await result.current.handleConfirmDeleteOrganist();
    });

    expect(mockDeleteOrganistFromChurch).toHaveBeenCalledWith('user-1', 'church-1', 'org-1');
    expect(result.current.editingId).toBe(null);
    expect(result.current.newOrganistName).toBe('');
    expect(result.current.pendingDeleteOrganist).toBe(null);
    expect(result.current.availability).toEqual(INITIAL_AVAILABILITY);
  });

  test('exibe erro quando falha ao excluir organista', async () => {
    mockDeleteOrganistFromChurch.mockRejectedValue(new Error('falha ao excluir'));

    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleRequestDeleteOrganist('org-1', 'Ana');
    });

    await act(async () => {
      await result.current.handleConfirmDeleteOrganist();
    });

    expect(result.current.error).toBe('Erro ao excluir organista.');
    expect(result.current.pendingDeleteOrganist).toBe(null);
  });
});
