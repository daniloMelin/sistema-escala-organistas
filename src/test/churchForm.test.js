import { fireEvent, render, screen } from '@testing-library/react';
import ChurchForm from '../components/ChurchForm';
import { INITIAL_AVAILABILITY } from '../constants/days';

const buildProps = (overrides = {}) => ({
  editingId: null,
  churchName: 'Central',
  churchCode: 'ABC',
  selectedDays: { ...INITIAL_AVAILABILITY, sunday_culto: true },
  cultoModel: 'meia_hora_e_culto',
  isSubmitting: false,
  isLoading: false,
  error: '',
  successMessage: '',
  onChurchNameChange: jest.fn(),
  onChurchCodeChange: jest.fn(),
  onCultoModelChange: jest.fn(),
  onDayChange: jest.fn(),
  onSubmit: jest.fn((e) => e.preventDefault()),
  onCancelEdit: jest.fn(),
  ...overrides,
});

describe('ChurchForm', () => {
  test('envia o formulario e dispara os callbacks', () => {
    const props = buildProps();
    render(<ChurchForm {...props} />);

    const textInputs = screen.getAllByRole('textbox');
    fireEvent.change(textInputs[0], {
      target: { value: 'Nova Igreja' },
    });
    fireEvent.change(textInputs[1], {
      target: { value: 'NEW' },
    });
    fireEvent.change(screen.getByLabelText('Modelo de culto:'), {
      target: { value: 'culto_unico_com_reserva' },
    });
    fireEvent.click(screen.getByLabelText('Domingo (RJM)'));
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar Igreja' }));

    expect(props.onChurchNameChange).toHaveBeenCalledWith('Nova Igreja');
    expect(props.onChurchCodeChange).toHaveBeenCalledWith('NEW');
    expect(props.onCultoModelChange).toHaveBeenCalledWith('culto_unico_com_reserva');
    expect(props.onDayChange).toHaveBeenCalledWith('sunday_rjm');
    expect(props.onSubmit).toHaveBeenCalled();
  });

  test('exibe o botao cancelar apenas durante a edicao', () => {
    const { rerender } = render(<ChurchForm {...buildProps({ editingId: null })} />);
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument();

    const props = buildProps({ editingId: 'church-1' });
    rerender(<ChurchForm {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(props.onCancelEdit).toHaveBeenCalled();
  });

  test('exibe a descricao do modelo de culto selecionado', () => {
    const { rerender } = render(
      <ChurchForm {...buildProps({ cultoModel: 'meia_hora_e_culto' })} />
    );

    expect(screen.getByText('2 organistas por culto: meia hora e culto.')).toBeInTheDocument();

    rerender(<ChurchForm {...buildProps({ cultoModel: 'culto_unico_com_reserva' })} />);

    expect(
      screen.getByText('1 organista no culto e 1 reserva por dia de culto.')
    ).toBeInTheDocument();
  });
});
