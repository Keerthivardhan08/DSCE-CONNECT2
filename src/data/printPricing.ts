import { PrintBinding, PrintLayout, PrintOrder, PrintRates } from '../types';

export const initialPrintRates: PrintRates = {
  blackWhitePerPage: 2,
  colorPerPage: 10,
  spiralBinding: 20,
  lamination: 15,
};

export const printLayoutLabels: Record<PrintLayout, string> = {
  ALL_PAGES: '1 page per sheet',
  FOUR_UP: '4 pages per sheet',
  EIGHT_UP: '8 pages per sheet',
};

export const printBindingLabels: Record<PrintBinding, string> = {
  NONE: 'No binding',
  SPIRAL: 'Spiral binding',
  LAMINATION: 'Lamination',
  SPIRAL_LAMINATION: 'Spiral + lamination',
};

export const getPrintSheetCount = (pageCount: number, layout: PrintLayout) => {
  const pagesPerSheet = layout === 'FOUR_UP' ? 4 : layout === 'EIGHT_UP' ? 8 : 1;
  return Math.max(1, Math.ceil(pageCount / pagesPerSheet));
};

export const getPrintAmount = (input: Pick<PrintOrder, 'pageCount' | 'layout' | 'colorMode' | 'binding' | 'copies'>, rates: PrintRates) => {
  const sheets = getPrintSheetCount(input.pageCount, input.layout);
  const printRate = input.colorMode === 'COLOR' ? rates.colorPerPage : rates.blackWhitePerPage;
  const bindingAmount = input.binding === 'SPIRAL' || input.binding === 'SPIRAL_LAMINATION'
    ? rates.spiralBinding
    : 0;
  const laminationAmount = input.binding === 'LAMINATION' || input.binding === 'SPIRAL_LAMINATION'
    ? rates.lamination
    : 0;
  return Math.max(0, Math.round((sheets * printRate + bindingAmount + laminationAmount) * input.copies));
};

