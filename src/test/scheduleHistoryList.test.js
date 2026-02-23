import { fireEvent, render, screen } from '@testing-library/react';
import ScheduleHistoryList from '../components/ScheduleHistoryList';

describe('ScheduleHistoryList', () => {
  test('does not render while editing', () => {
    const { container } = render(
      <ScheduleHistoryList isEditing savedSchedules={[]} onViewSaved={jest.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders items and triggers view action', () => {
    const onViewSaved = jest.fn();
    const schedule = {
      id: 's1',
      generatedAt: '2026-03-01T10:00:00.000Z',
      period: { start: '2026-03-01', end: '2026-03-31' },
    };

    render(
      <ScheduleHistoryList
        isEditing={false}
        savedSchedules={[schedule]}
        onViewSaved={onViewSaved}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Visualizar' }));
    expect(onViewSaved).toHaveBeenCalledWith(schedule);
  });
});
