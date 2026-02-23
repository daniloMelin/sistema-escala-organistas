import { fireEvent, render, screen } from '@testing-library/react';
import OrganistList from '../components/OrganistList';

describe('OrganistList', () => {
  test('renders list and triggers actions', () => {
    const props = {
      loading: false,
      organists: [{ id: 'o1', name: 'Maria', availability: { monday: true } }],
      formatOrganistAvailability: jest.fn(() => 'Seg'),
      onStartEdit: jest.fn(),
      onRequestDeleteOrganist: jest.fn(),
    };

    render(<OrganistList {...props} />);

    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText(/Seg/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(props.onStartEdit).toHaveBeenCalledWith(props.organists[0]);
    expect(props.onRequestDeleteOrganist).toHaveBeenCalledWith('o1', 'Maria');
  });
});
