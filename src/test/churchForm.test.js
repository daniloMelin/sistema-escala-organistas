import { fireEvent, render, screen } from '@testing-library/react';
import ChurchForm from '../components/ChurchForm';
import { INITIAL_AVAILABILITY } from '../constants/days';

const buildProps = (overrides = {}) => ({
  editingId: null,
  churchName: 'Central',
  churchCode: 'ABC',
  selectedDays: { ...INITIAL_AVAILABILITY, sunday_culto: true },
  isSubmitting: false,
  isLoading: false,
  error: '',
  successMessage: '',
  onChurchNameChange: jest.fn(),
  onChurchCodeChange: jest.fn(),
  onDayChange: jest.fn(),
  onSubmit: jest.fn((e) => e.preventDefault()),
  onCancelEdit: jest.fn(),
  ...overrides,
});

describe('ChurchForm', () => {
  test('submits form and triggers callbacks', () => {
    const props = buildProps();
    render(<ChurchForm {...props} />);

    const textInputs = screen.getAllByRole('textbox');
    fireEvent.change(textInputs[0], {
      target: { value: 'Nova Igreja' },
    });
    fireEvent.change(textInputs[1], {
      target: { value: 'NEW' },
    });
    fireEvent.click(screen.getByLabelText('Domingo (RJM)'));
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }));

    expect(props.onChurchNameChange).toHaveBeenCalledWith('Nova Igreja');
    expect(props.onChurchCodeChange).toHaveBeenCalledWith('NEW');
    expect(props.onDayChange).toHaveBeenCalledWith('sunday_rjm');
    expect(props.onSubmit).toHaveBeenCalled();
  });

  test('shows cancel button only while editing', () => {
    const { rerender } = render(<ChurchForm {...buildProps({ editingId: null })} />);
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument();

    const props = buildProps({ editingId: 'church-1' });
    rerender(<ChurchForm {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(props.onCancelEdit).toHaveBeenCalled();
  });
});
