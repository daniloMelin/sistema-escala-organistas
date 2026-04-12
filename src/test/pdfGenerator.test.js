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
    mockDoc.internal.pageSize.getWidth.mockReturnValue(210);
    mockDoc.internal.pageSize.getHeight.mockReturnValue(297);
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
      'Igreja PDF'
    );

    const renderedLabels = mockDoc.text.mock.calls.map(([text]) => text);

    expect(renderedLabels).toEqual(
      expect.arrayContaining(['Igreja PDF', 'Resumo do período', 'Data', 'M. Hora', 'Ana'])
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
});
