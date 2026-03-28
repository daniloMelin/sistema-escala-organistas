import { exportScheduleToPDF } from '../utils/pdfGenerator';

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
  roundedRect: jest.fn(),
  getTextWidth: jest.fn(() => 10),
  save: jest.fn(),
  setPage: jest.fn(),
};

jest.mock('jspdf', () => {
  return {
    __esModule: true,
    default: class MockJsPDF {
      constructor() {
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
  });

  test('exporta labels dinamicos para reserva e partes do culto', () => {
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
            Reserva: 'Eva',
          },
        },
      ],
      '2026-03-01',
      '2026-03-01',
      'Igreja PDF'
    );

    const renderedLabels = mockDoc.text.mock.calls.map(([text]) => text);

    expect(renderedLabels).toEqual(
      expect.arrayContaining(['RJM:', 'Meia Hora:', 'Parte 1:', 'Parte 2:', 'Reserva:'])
    );
    expect(mockDoc.save).toHaveBeenCalled();
  });
});
