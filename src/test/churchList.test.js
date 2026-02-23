import { fireEvent, render, screen } from '@testing-library/react';
import ChurchList from '../components/ChurchList';

describe('ChurchList', () => {
  test('calls select, edit and delete handlers', () => {
    const props = {
      churches: [{ id: 'c1', name: 'Jardim', code: 'JDG' }],
      isLoading: false,
      onChurchSelect: jest.fn(),
      onStartEdit: jest.fn(),
      onRequestDeleteChurch: jest.fn(),
    };

    render(<ChurchList {...props} />);

    fireEvent.click(screen.getByText('Jardim'));
    expect(props.onChurchSelect).toHaveBeenCalledWith(props.churches[0]);

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(props.onStartEdit).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(props.onRequestDeleteChurch).toHaveBeenCalled();
  });
});
