import { render, screen } from '@testing-library/react';
import ChurchDashboard from '../components/ChurchDashboard';

const mockNavigate = jest.fn();

jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => mockNavigate,
  }),
  { virtual: true }
);

jest.mock('../contexts/ChurchContext', () => ({
  useChurch: () => ({
    selectedChurch: { name: 'Jardim Satélite' },
  }),
}));

jest.mock('../hooks/useChurchDashboard', () => ({
  useChurchDashboard: () => ({
    id: 'church-1',
    organists: [],
    loading: false,
    visibleDays: [],
    newOrganistName: '',
    availability: {},
    isSubmitting: false,
    editingId: null,
    error: '',
    successMessage: '',
    pendingDeleteOrganist: null,
    setNewOrganistName: jest.fn(),
    setPendingDeleteOrganist: jest.fn(),
    handleCheckboxChange: jest.fn(),
    handleStartEdit: jest.fn(),
    handleCancelEdit: jest.fn(),
    handleSaveOrganist: jest.fn(),
    handleRequestDeleteOrganist: jest.fn(),
    handleConfirmDeleteOrganist: jest.fn(),
    formatOrganistAvailability: jest.fn(),
  }),
}));

jest.mock('../components/OrganistForm', () => () => <div>OrganistForm</div>);
jest.mock('../components/OrganistList', () => () => <div>OrganistList</div>);
jest.mock('../components/ui/ConfirmDialog', () => () => null);

describe('ChurchDashboard', () => {
  test('usa o mesmo tamanho base pequeno nos botoes do topo', () => {
    render(<ChurchDashboard user={{ uid: 'user-1', email: 'test@example.com' }} />);

    expect(screen.getByRole('button', { name: /Voltar para Igrejas/i })).toHaveClass('btn--sm');
    expect(screen.getByRole('button', { name: /Gerar Escala/i })).toHaveClass('btn--sm');
  });
});
