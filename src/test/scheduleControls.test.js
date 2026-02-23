import { fireEvent, render, screen } from '@testing-library/react';
import ScheduleControls from '../components/ScheduleControls';

describe('ScheduleControls', () => {
  test('changes dates and triggers generation', () => {
    const props = {
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      isGenerating: false,
      isLoading: false,
      error: '',
      successMessage: '',
      onStartDateChange: jest.fn(),
      onEndDateChange: jest.fn(),
      onGenerate: jest.fn(),
    };

    render(<ScheduleControls {...props} />);

    fireEvent.change(screen.getByDisplayValue('2026-03-01'), { target: { value: '2026-04-01' } });
    fireEvent.change(screen.getByDisplayValue('2026-03-31'), { target: { value: '2026-04-30' } });
    fireEvent.click(screen.getByRole('button', { name: 'Gerar Nova Escala' }));

    expect(props.onStartDateChange).toHaveBeenCalledWith('2026-04-01');
    expect(props.onEndDateChange).toHaveBeenCalledWith('2026-04-30');
    expect(props.onGenerate).toHaveBeenCalled();
  });
});
