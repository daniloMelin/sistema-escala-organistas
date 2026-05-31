import { render, screen } from '@testing-library/react';
import ChurchDashboard from '../components/ChurchDashboard';

const mockNavigate = jest.fn();
const mockUseChurch = jest.fn();
const mockUseChurchDashboard = jest.fn();

jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => mockNavigate,
  }),
  { virtual: true }
);

jest.mock('../contexts/ChurchContext', () => ({
  useChurch: () => mockUseChurch(),
}));

jest.mock('../hooks/useChurchDashboard', () => ({
  useChurchDashboard: () => mockUseChurchDashboard(),
}));

jest.mock('../components/OrganistForm', () => () => <div>OrganistForm</div>);
jest.mock('../components/OrganistList', () => () => <div>OrganistList</div>);
jest.mock('../components/ui/ConfirmDialog', () => () => null);

const hookState = {
  id: 'church-1',
  church: {
    id: 'church-1',
    name: 'Jardim Satélite',
    rehearsal: {
      weekOfMonth: 1,
      weekday: 'friday',
      time: '19:30',
      notes: 'Chegar 15 minutos antes.',
    },
  },
  organists: [],
  loading: false,
  visibleDays: [],
  newOrganistName: '',
  availability: {},
  isSubmitting: false,
  editingId: null,
  error: '',
  fieldErrors: { organistName: '' },
  successMessage: '',
  pendingDeleteOrganist: null,
  setNewOrganistName: jest.fn(),
  setPendingDeleteOrganist: jest.fn(),
  handleOrganistNameChange: jest.fn(),
  handleOrganistNameBlur: jest.fn(),
  handleCheckboxChange: jest.fn(),
  handleStartEdit: jest.fn(),
  handleCancelEdit: jest.fn(),
  handleSaveOrganist: jest.fn(),
  handleRequestDeleteOrganist: jest.fn(),
  handleConfirmDeleteOrganist: jest.fn(),
  formatOrganistAvailability: jest.fn(),
};

describe('ChurchDashboard', () => {
  beforeEach(() => {
    mockUseChurch.mockReturnValue({ selectedChurch: null });
    mockUseChurchDashboard.mockReturnValue(hookState);
  });

  test('usa o mesmo tamanho base pequeno nos botoes do topo', () => {
    render(<ChurchDashboard user={{ uid: 'user-1', email: 'test@example.com' }} />);

    expect(screen.getByRole('button', { name: /Voltar para Igrejas/i })).toHaveClass('btn--sm');
    expect(screen.getByRole('button', { name: /Gerar Escala/i })).toHaveClass('btn--sm');
  });

  test('exibe resumo do ensaio local da igreja selecionada', () => {
    render(<ChurchDashboard user={{ uid: 'user-1', email: 'test@example.com' }} />);

    expect(screen.getByText('Gerenciamento de Organistas')).toBeInTheDocument();
    expect(screen.getByText('Ensaio local')).toBeInTheDocument();
    expect(screen.getByText('1 sexta-feira do mês às 19:30')).toBeInTheDocument();
    expect(screen.getByText('Chegar 15 minutos antes.')).toBeInTheDocument();
  });

  test('ignora selectedChurch divergente da rota atual', () => {
    mockUseChurch.mockReturnValue({
      selectedChurch: {
        id: 'church-2',
        name: 'Igreja Antiga',
        rehearsal: {
          weekOfMonth: 2,
          weekday: 'monday',
          time: '20:00',
          notes: 'Nao deveria aparecer.',
        },
      },
    });

    render(<ChurchDashboard user={{ uid: 'user-1', email: 'test@example.com' }} />);

    expect(screen.getByText('Jardim Satélite')).toBeInTheDocument();
    expect(screen.queryByText('Igreja Antiga')).not.toBeInTheDocument();
    expect(screen.queryByText('Nao deveria aparecer.')).not.toBeInTheDocument();
  });
});
