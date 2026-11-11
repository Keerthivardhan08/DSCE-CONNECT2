import { PrintBinding, PrintLayout, PrintOrder, PrintRates } from '../types';

export const initialPrintRates: PrintRates = {
  blackWhitePerPage: 3,
  colorPerPage: 10,
  spiralBinding: 25,
  lamination: 20,
  tapeBinding: 15,
};

export const printLayoutLabels: Record<PrintLayout, string> = {
  ALL_PAGES: '1 page per sheet',
  TWO_UP: '2 pages per sheet',
  FOUR_UP: '4 pages per sheet',
  EIGHT_UP: '8 pages per sheet',
};

export const printBindingLabels: Record<PrintBinding, string> = {
  NONE: 'No binding',
  SPIRAL: 'Spiral binding',
  TAPE: 'Tape binding',
  LAMINATION: 'Lamination',
  SPIRAL_LAMINATION: 'Spiral + lamination',
};

export const getPrintSheetCount = (pageCount: number, layout: PrintLayout) => {
  const pagesPerSheet = layout === 'TWO_UP' ? 2 : layout === 'FOUR_UP' ? 4 : layout === 'EIGHT_UP' ? 8 : 1;
  return Math.max(1, Math.ceil(pageCount / pagesPerSheet));
};

export const getPrintAmount = (input: Pick<PrintOrder, 'pageCount' | 'layout' | 'colorMode' | 'binding' | 'copies'>, rates: PrintRates) => {
  const sheets = getPrintSheetCount(input.pageCount, input.layout);
  const printRate = input.colorMode === 'COLOR' ? rates.colorPerPage : rates.blackWhitePerPage;
  let bindingAmount = 0;
  if (input.binding === 'SPIRAL') bindingAmount = rates.spiralBinding;
  else if (input.binding === 'TAPE') bindingAmount = rates.tapeBinding || 15;
  else if (input.binding === 'LAMINATION') bindingAmount = rates.lamination;
  else if (input.binding === 'SPIRAL_LAMINATION') bindingAmount = rates.spiralBinding + rates.lamination;

  return Math.max(0, Math.round((sheets * printRate + bindingAmount) * input.copies));
};

