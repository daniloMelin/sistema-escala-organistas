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
              detail: 'Base mínima atendida e histórico disponível.',
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
                detail: 'Ainda não possui escala salva.',
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
    expect(screen.getByText('Ainda não possui escala salva.')).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.textContent === 'Modelo: Culto único com reserva')
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.textContent === 'Organistas: 7')
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.textContent === 'Escalas: 3')
    ).toBeInTheDocument();
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

  test('aplica destaque visual por status operacional', () => {
    const { container } = render(
      <ChurchList
        churches={[
          {
            id: 'c-incomplete',
            name: 'Igreja Incompleta',
            operationalSummary: {
              cultoModelLabel: 'Culto único com reserva',
              organistCount: 0,
              scheduleCount: 0,
              readiness: {
                label: 'Incompleta',
                tone: 'incomplete',
                detail: 'Nenhuma organista cadastrada.',
              },
            },
          },
          {
            id: 'c-warning',
            name: 'Igreja Atenção',
            operationalSummary: {
              cultoModelLabel: 'Culto único com reserva',
              organistCount: 2,
              scheduleCount: 0,
              readiness: {
                label: 'Atenção',
                tone: 'warning',
                detail: 'Ainda não possui escala salva.',
              },
            },
          },
          {
            id: 'c-ready',
            name: 'Igreja Pronta',
            operationalSummary: {
              cultoModelLabel: 'Meia hora e culto',
              organistCount: 3,
              scheduleCount: 2,
              readiness: {
                label: 'Pronta',
                tone: 'ready',
                detail: 'Base mínima atendida e histórico disponível.',
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

    expect(container.querySelector('.church-list__item--incomplete')).not.toBeNull();
    expect(container.querySelector('.church-list__item--warning')).not.toBeNull();
    expect(container.querySelector('.church-list__item--ready')).not.toBeNull();
  });

  test('explica a priorizacao operacional quando ha mais de uma igreja com resumo', () => {
    render(
      <ChurchList
        churches={[
          {
            id: 'c-incomplete',
            name: 'Igreja Incompleta',
            operationalSummary: {
              cultoModelLabel: 'Culto único com reserva',
              organistCount: 0,
              scheduleCount: 0,
              readiness: {
                label: 'Incompleta',
                tone: 'incomplete',
                detail: 'Nenhuma organista cadastrada.',
              },
            },
          },
          {
            id: 'c-ready',
            name: 'Igreja Pronta',
            operationalSummary: {
              cultoModelLabel: 'Meia hora e culto',
              organistCount: 3,
              scheduleCount: 2,
              readiness: {
                label: 'Pronta',
                tone: 'ready',
                detail: 'Base mínima atendida e histórico disponível.',
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

    expect(screen.getByText(/Igrejas mais críticas aparecem primeiro/)).toBeInTheDocument();
    expect(screen.getByText('Prioridade incompleta')).toBeInTheDocument();
    expect(screen.getByText('Prioridade pronta')).toBeInTheDocument();
  });
});
