import { fireEvent, render, screen } from '@testing-library/react';
import ScheduleHistoryList from '../components/ScheduleHistoryList';

describe('ScheduleHistoryList', () => {
  test('nao renderiza enquanto estiver em edicao', () => {
    const { container } = render(
      <ScheduleHistoryList isEditing savedSchedules={[]} onViewSaved={jest.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('mantem a ordem dos hooks ao alternar entre edicao e visualizacao', () => {
    const schedule = {
      id: 's1',
      generatedAt: '2026-03-01T10:00:00.000Z',
      period: { start: '2026-03-01', end: '2026-03-31' },
      organistCount: 2,
      data: [{ date: '2026-03-01' }],
    };

    const { rerender } = render(
      <ScheduleHistoryList isEditing={false} savedSchedules={[schedule]} onViewSaved={jest.fn()} />
    );

    expect(screen.getByText('Histórico de Escalas')).toBeInTheDocument();

    rerender(<ScheduleHistoryList isEditing savedSchedules={[schedule]} onViewSaved={jest.fn()} />);
    expect(screen.queryByText('Histórico de Escalas')).not.toBeInTheDocument();

    rerender(
      <ScheduleHistoryList isEditing={false} savedSchedules={[schedule]} onViewSaved={jest.fn()} />
    );
    expect(screen.getByText('Histórico de Escalas')).toBeInTheDocument();
  });

  test('renderiza itens e dispara a acao de visualizacao', () => {
    const onViewSaved = jest.fn();
    const schedule = {
      id: 's1',
      generatedAt: '2026-03-01T10:00:00.000Z',
      period: { start: '2026-03-01', end: '2026-03-31' },
      organistCount: 2,
      data: [{ date: '2026-03-01' }],
    };

    render(
      <ScheduleHistoryList
        isEditing={false}
        savedSchedules={[schedule]}
        onViewSaved={onViewSaved}
      />
    );

    expect(screen.getByText('Mais recente')).toBeInTheDocument();
    expect(screen.getByText('1 dia na escala • 2 organistas consideradas')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Visualizar' }));
    expect(onViewSaved).toHaveBeenCalledWith(schedule);
  });

  test('filtra o historico por texto e exibe estado vazio quando nao houver resultado', () => {
    const schedules = [
      {
        id: 's1',
        generatedAt: '2026-03-03T10:00:00.000Z',
        period: { start: '2026-03-02', end: '2026-03-02' },
        organistCount: 2,
        data: [{ date: '2026-03-02' }],
      },
      {
        id: 's2',
        generatedAt: '2026-02-02T10:00:00.000Z',
        period: { start: '2026-02-01', end: '2026-02-02' },
        organistCount: 3,
        data: [{ date: '2026-02-01' }, { date: '2026-02-02' }],
      },
    ];

    render(
      <ScheduleHistoryList isEditing={false} savedSchedules={schedules} onViewSaved={jest.fn()} />
    );

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar no histórico:' }), {
      target: { value: '2 dias na escala' },
    });

    expect(screen.getByText('01/02/2026 até 02/02/2026')).toBeInTheDocument();
    expect(screen.queryByText('02/03/2026 até 02/03/2026')).not.toBeInTheDocument();
    expect(screen.getByText('Mais recente')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar no histórico:' }), {
      target: { value: 'sem resultado' },
    });

    expect(
      screen.getByText('Nenhuma escala encontrada para a busca informada.')
    ).toBeInTheDocument();
  });
});
