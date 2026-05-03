import { exportScheduleToPDF } from '../utils/pdfGenerator';

const mockJsPDFConstructor = jest.fn();

const mockDoc = {
  internal: {
    pageSize: {
      getWidth: jest.fn(() => 210),
      getHeight: jest.fn(() => 297),
    },
    getNumberOfPages: jest.fn(() => 1),
  },
  setFillColor: jest.fn(),
  rect: jest.fn(),
  setFontSize: jest.fn(),
  setTextColor: jest.fn(),
  setFont: jest.fn(),
  text: jest.fn(),
  addPage: jest.fn(),
  setDrawColor: jest.fn(),
  setLineWidth: jest.fn(),
  line: jest.fn(),
  roundedRect: jest.fn(),
  getTextWidth: jest.fn(() => 10),
  save: jest.fn(),
  setPage: jest.fn(),
};

jest.mock('jspdf', () => {
  return {
    __esModule: true,
    default: class MockJsPDF {
      constructor(...args) {
        mockJsPDFConstructor(...args);
        return mockDoc;
      }
    },
  };
});

jest.mock('../utils/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

describe('exportScheduleToPDF', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDoc.internal.pageSize.getWidth.mockReturnValue(297);
    mockDoc.internal.pageSize.getHeight.mockReturnValue(210);
    mockDoc.internal.getNumberOfPages.mockReturnValue(1);
  });

  test('exporta resumo por organista em layout tabular A4 paisagem', () => {
    exportScheduleToPDF(
      [
        {
          date: '01/03/2026',
          dayName: 'Domingo',
          assignments: {
            RJM: 'Ana',
            MeiaHoraCulto: 'Bia',
            Parte1: 'Clara',
            Parte2: 'Dani',
            Reserva: 'Ana',
          },
        },
      ],
      '2026-03-01',
      '2026-03-01',
      'Igreja PDF',
      {
        weekOfMonth: 1,
        weekday: 'tuesday',
        time: '19:30',
        notes: 'Cultos às terças-feiras têm início às 14:30 h.',
      }
    );

    const renderedLabels = mockDoc.text.mock.calls.map(([text]) => text);

    expect(renderedLabels).toEqual(
      expect.arrayContaining([
        'Igreja PDF',
        'Ensaio Local',
        '1 terça-feira do mês às 19:30',
        'Resumo do período',
        'Cultos às terças-feiras têm início às 14:30 h.',
        'Data',
        'M. Hora',
        'Ana',
      ])
    );
    expect(mockJsPDFConstructor).toHaveBeenCalledWith(
      expect.objectContaining({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })
    );
    expect(mockDoc.roundedRect).toHaveBeenCalled();
    expect(mockDoc.save).toHaveBeenCalled();
  });

  test('mantem no PDF servicos sem atribuicao que aparecem na visualizacao', () => {
    exportScheduleToPDF(
      [
        {
          date: '01/03/2026',
          dayName: 'Domingo',
          assignments: {
            MeiaHoraCulto: 'Ana',
            Parte1: undefined,
            Parte2: undefined,
          },
        },
      ],
      '2026-03-01',
      '2026-03-01',
      'Igreja PDF'
    );

    const renderedLabels = mockDoc.text.mock.calls.map(([text]) => text);

    expect(renderedLabels).toEqual(expect.arrayContaining(['M. Hora', 'P1', 'P2', '—']));
  });

  test('usa layout mais folgado para meses densos com multiplos servicos', () => {
    mockDoc.internal.getNumberOfPages.mockReturnValue(2);

    exportScheduleToPDF(
      [
        {
          date: '01/03/2026',
          dayName: 'Domingo',
          assignments: {
            RJM: 'Ana Clara',
            MeiaHoraCulto: 'Beatriz Lima',
            Parte1: 'Claudia Souza',
            Parte2: 'Daniela Rocha',
            Reserva: 'Eva Dias',
          },
        },
        {
          date: '01/04/2026',
          dayName: 'Quarta',
          assignments: {
            RJM: 'Ana Clara',
            MeiaHoraCulto: 'Beatriz Lima',
            Parte1: 'Claudia Souza',
            Parte2: 'Daniela Rocha',
            Reserva: 'Eva Dias',
          },
        },
        {
          date: '01/05/2026',
          dayName: 'Sexta',
          assignments: {
            RJM: 'Ana Clara',
            MeiaHoraCulto: 'Beatriz Lima',
            Parte1: 'Claudia Souza',
            Parte2: 'Daniela Rocha',
            Reserva: 'Eva Dias',
          },
        },
      ],
      '2026-03-01',
      '2026-05-01',
      'Igreja PDF'
    );

    const renderedLabels = mockDoc.text.mock.calls.map(([text]) => text);
    const assignmentFontCalls = mockDoc.setFontSize.mock.calls.filter(([size]) => size === 5.8);

    expect(mockDoc.addPage).toHaveBeenCalledTimes(1);
    expect(renderedLabels).toEqual(
      expect.arrayContaining(['MARÇO DE 2026', 'ABRIL DE 2026', 'MAIO DE 2026'])
    );
    expect(assignmentFontCalls.length).toBeGreaterThan(0);
  });
});
