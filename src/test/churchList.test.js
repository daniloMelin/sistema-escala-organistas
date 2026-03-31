import { fireEvent, render, screen } from '@testing-library/react';
import ChurchList from '../components/ChurchList';

describe('ChurchList', () => {
  test('chama os manipuladores de selecionar, editar e excluir', () => {
    const props = {
      churches: [
        {
          id: 'c1',
          name: 'Jardim',
          code: 'JDG',
          operationalSummary: {
            cultoModelLabel: 'Culto único com reserva',
            organistCount: 8,
            scheduleCount: 5,
            readiness: {
              label: 'Pronta',
              tone: 'ready',
            },
          },
        },
      ],
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

  test('exibe resumo operacional da igreja quando disponivel', () => {
    render(
      <ChurchList
        churches={[
          {
            id: 'c1',
            name: 'Jardim Uirá',
            code: 'JUI',
            operationalSummary: {
              cultoModelLabel: 'Culto único com reserva',
              organistCount: 7,
              scheduleCount: 3,
              readiness: {
                label: 'Atenção',
                tone: 'warning',
              },
            },
          },
        ]}
        isLoading={false}
        onChurchSelect={jest.fn()}
        onStartEdit={jest.fn()}
        onRequestDeleteChurch={jest.fn()}
      />
    );

    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(screen.getByText('Modelo: Culto único com reserva')).toBeInTheDocument();
    expect(screen.getByText('Organistas: 7')).toBeInTheDocument();
    expect(screen.getByText('Escalas: 3')).toBeInTheDocument();
  });

  test('exibe mensagem quando nao ha igrejas cadastradas', () => {
    render(
      <ChurchList
        churches={[]}
        isLoading={false}
        onChurchSelect={jest.fn()}
        onStartEdit={jest.fn()}
        onRequestDeleteChurch={jest.fn()}
      />
    );

    expect(screen.getByText('Nenhuma igreja cadastrada.')).toBeInTheDocument();
  });

  test('nao exibe estado vazio quando ha erro de carregamento', () => {
    render(
      <ChurchList
        churches={[]}
        isLoading={false}
        hasLoadError
        onChurchSelect={jest.fn()}
        onStartEdit={jest.fn()}
        onRequestDeleteChurch={jest.fn()}
      />
    );

    expect(screen.queryByText('Nenhuma igreja cadastrada.')).not.toBeInTheDocument();
  });
});
