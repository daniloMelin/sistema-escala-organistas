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
        sunday: [{ id: 'RJM' }, { id: 'Culto' }],
        tuesday: [{ id: 'MeiaHoraCulto' }, { id: 'Culto' }],
      },
    });
  });

  test('loads organists and visible days based on church config', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockGetOrganistsByChurch).toHaveBeenCalledWith('user-1', 'church-1');
    expect(mockGetChurch).toHaveBeenCalledWith('user-1', 'church-1');
    expect(result.current.organists).toHaveLength(1);
    expect(result.current.visibleDays.map((d) => d.key)).toEqual(
      expect.arrayContaining(['sunday_rjm', 'sunday_culto', 'tuesday'])
    );
  });

  test('saves new organist and resets edit state', async () => {
    const { result } = renderHook(() => useChurchDashboard(user));

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setNewOrganistName('  Maria  ');
      result.current.handleCheckboxChange({
        target: { name: 'friday', checked: true },
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
        availability: expect.objectContaining({ friday: true }),
      })
    );
    expect(result.current.newOrganistName).toBe('');
    expect(result.current.editingId).toBe(null);
    expect(result.current.availability).toEqual(INITIAL_AVAILABILITY);
  });

  test('requests and confirms organist deletion', async () => {
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
});
