import { fireEvent, render, screen } from '@testing-library/react';
import ScheduleGridView from '../components/ScheduleGridView';

const groupedSchedule = {
  'Março 2026': [
    {
      originalIndex: 0,
      date: '01/03/2026',
      dayName: 'Domingo',
      assignments: { Culto: 'Ana', MeiaHoraCulto: 'Bia' },
    },
    {
      originalIndex: 1,
      date: '08/03/2026',
      dayName: 'Domingo',
      assignments: { Culto: undefined, MeiaHoraCulto: undefined },
    },
  ],
};

const buildProps = (overrides = {}) => ({
  groupedSchedule,
  isEditing: false,
  isGenerating: false,
  organists: [{ id: '1', name: 'Ana' }, { id: '2', name: 'Bia' }],
  onToggleEditing: jest.fn(),
  onSaveChanges: jest.fn(),
  onExportClick: jest.fn(),
  onAssignmentChange: jest.fn(),
  ...overrides,
});

describe('ScheduleGridView', () => {
  test('shows non-empty day cards while not editing', () => {
    render(<ScheduleGridView {...buildProps()} />);
    expect(screen.getByText('Domingo, 01/03/2026')).toBeInTheDocument();
    expect(screen.queryByText('Domingo, 08/03/2026')).not.toBeInTheDocument();
  });

  test('handles toolbar and assignment change while editing', () => {
    const props = buildProps({ isEditing: true });
    render(<ScheduleGridView {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(props.onToggleEditing).toHaveBeenCalledWith(false);

    fireEvent.click(screen.getByRole('button', { name: 'Salvar Alterações' }));
    expect(props.onSaveChanges).toHaveBeenCalled();

    fireEvent.change(screen.getAllByRole('combobox')[0], {
      target: { value: 'Bia' },
    });
    expect(props.onAssignmentChange).toHaveBeenCalled();
  });
});
