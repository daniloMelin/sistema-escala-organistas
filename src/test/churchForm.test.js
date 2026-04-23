import { fireEvent, render, screen } from '@testing-library/react';
import ChurchForm from '../components/ChurchForm';
import { INITIAL_AVAILABILITY } from '../constants/days';
import { INITIAL_REHEARSAL } from '../constants/rehearsal';

const buildProps = (overrides = {}) => ({
  editingId: null,
  churchName: 'Central',
  selectedDays: { ...INITIAL_AVAILABILITY, sunday_culto: true },
  cultoModel: 'meia_hora_e_culto',
  rehearsal: INITIAL_REHEARSAL,
  isSubmitting: false,
  isLoading: false,
  error: '',
  fieldErrors: {
    churchName: '',
    rehearsalWeekOfMonth: '',
    rehearsalWeekday: '',
    rehearsalTime: '',
    rehearsalNotes: '',
  },
  successMessage: '',
  onChurchNameChange: jest.fn(),
  onChurchNameBlur: jest.fn(),
  onCultoModelChange: jest.fn(),
  onRehearsalChange: jest.fn(),
  onRehearsalBlur: jest.fn(),
  onDayChange: jest.fn(),
  onSubmit: jest.fn((e) => e.preventDefault()),
  onCancelEdit: jest.fn(),
  ...overrides,
});

describe('ChurchForm', () => {
  test('envia o formulario e dispara os callbacks', () => {
    const props = buildProps();
    render(<ChurchForm {...props} />);

    fireEvent.change(screen.getByLabelText(/Nome da Congregação:/i), {
      target: { value: 'Nova Igreja' },
    });
    fireEvent.change(screen.getByLabelText('Modelo de culto:'), {
      target: { value: 'culto_unico_com_reserva' },
    });
    fireEvent.click(screen.getByLabelText('Domingo (RJM)'));
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar Igreja' }));

    expect(props.onChurchNameChange).toHaveBeenCalledWith('Nova Igreja');
    expect(props.onCultoModelChange).toHaveBeenCalledWith('culto_unico_com_reserva');
    expect(props.onDayChange).toHaveBeenCalledWith('sunday_rjm');
    expect(props.onSubmit).toHaveBeenCalled();
  });

  test('nao exibe mais o campo codigo na interface principal', () => {
    render(<ChurchForm {...buildProps()} />);

    expect(screen.queryByLabelText(/Código \(opcional\):/i)).not.toBeInTheDocument();
  });

  test('exibe e altera os campos de ensaio local', () => {
    const props = buildProps({
      rehearsal: {
        weekOfMonth: '1',
        weekday: 'thursday',
        time: '19:30',
        notes: '',
      },
    });

    render(<ChurchForm {...props} />);

    fireEvent.change(screen.getByLabelText(/Semana do mês:/i), {
      target: { value: '2' },
    });
    fireEvent.change(screen.getByLabelText(/Dia da semana:/i), {
      target: { value: 'friday' },
    });
    fireEvent.change(screen.getByLabelText(/Horário:/i), {
      target: { value: '20:00' },
    });
    fireEvent.change(screen.getByLabelText(/Observação \(opcional\):/i), {
      target: { value: 'Culto começa às 19:00.' },
    });

    expect(props.onRehearsalChange).toHaveBeenCalledWith('weekOfMonth', '2');
    expect(props.onRehearsalChange).toHaveBeenCalledWith('weekday', 'friday');
    expect(props.onRehearsalChange).toHaveBeenCalledWith('time', '20:00');
    expect(props.onRehearsalChange).toHaveBeenCalledWith('notes', 'Culto começa às 19:00.');
  });

  test('exibe erros por campo nos inputs e selects do ensaio', () => {
    render(
      <ChurchForm
        {...buildProps({
          fieldErrors: {
            churchName: 'Nome inválido.',
            rehearsalWeekOfMonth: 'Selecione a semana.',
            rehearsalWeekday: '',
            rehearsalTime: 'Selecione o horário.',
            rehearsalNotes: 'Observação muito longa.',
          },
        })}
      />
    );

    expect(screen.getByText('Nome inválido.')).toBeInTheDocument();
    expect(screen.getByText('Selecione a semana.')).toBeInTheDocument();
    expect(screen.getByText('Selecione o horário.')).toBeInTheDocument();
    expect(screen.getByText('Observação muito longa.')).toBeInTheDocument();
    expect(screen.getByLabelText(/Semana do mês:/i)).toHaveClass(
      'church-form__model-select--error'
    );
    expect(screen.getByLabelText(/Horário:/i)).toHaveClass('church-form__model-select--error');
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
