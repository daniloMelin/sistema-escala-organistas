import { fireEvent, render, screen } from '@testing-library/react';
import OrganistForm from '../components/OrganistForm';

const visibleDays = [
  { key: 'monday', label: 'Segunda' },
  { key: 'sunday_culto', label: 'Domingo (Culto)' },
];

const buildProps = (overrides = {}) => ({
  editingId: null,
  newOrganistName: 'Ana',
  isSubmitting: false,
  error: '',
  successMessage: '',
  visibleDays,
  availability: { monday: true, sunday_culto: false },
  onNameChange: jest.fn(),
  onCheckboxChange: jest.fn(),
  onSubmit: jest.fn((e) => e.preventDefault()),
  onCancelEdit: jest.fn(),
  ...overrides,
});

describe('OrganistForm', () => {
  test('handles form interactions', () => {
    const props = buildProps();
    render(<OrganistForm {...props} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Bea' },
    });
    fireEvent.click(screen.getByLabelText('Domingo (Culto)'));
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar Organista' }));

    expect(props.onNameChange).toHaveBeenCalledWith('Bea');
    expect(props.onCheckboxChange).toHaveBeenCalled();
    expect(props.onSubmit).toHaveBeenCalled();
  });

  test('shows empty-days warning', () => {
    render(<OrganistForm {...buildProps({ visibleDays: [] })} />);
    expect(screen.getByText(/Nenhum dia de culto configurado/i)).toBeInTheDocument();
  });
});
