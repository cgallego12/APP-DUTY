import * as XLSX from 'xlsx';

export interface SalesRow {
  DATE: Date | null;
  FOLIO: string;
  STORE: string;
  SKU: string;
  QUANTITY: number;
  COGS_PES: number;
  COGS_USD: number;
  AMOUNT_PES: number;
  AMOUNT_USD: number;
  PRECIO_REGULAR: number;
  DISCOUNT: number;
  TOTAL: number;
  CUSTOMER_CODE: string;
  CURRENCY: string;
  STATUS: string;
  TIME: string;
  APPLIED_PROMOTION: string;
  LINE: string;
  FLIGHT_CRUISE: string;
  SEAT: string;
  ORIGIN: string;
  DESTINATION: string;
  NATIONALITY: string;
  PASSPORT_NUMBER: string;
  PASSENGER_NAME: string;
  SELLER_CODE: string;
  SELLER: string;
  CASHIER: string;
  DATE_BIRTH: string;
  GENDER: string;
  _raw: Record<string, unknown>;
}

export interface DeparturesRow {
  SKU_CODE: string;
  INITIAL_STOCK: number;
  UNIT_SALES: number;
  UNIT_PURCHASE: number;
  DISPOSED_PRODUCT: number;
  FINAL_STOCK: number;
  EXCHANGE_RATE: number;
  UNIT_COST_USD: number;
  TOTAL_COST_USD: number;
  DAYS_IN_STOCK: number;
  LAST_PURCHASE_DATE: Date | null;
  LAST_RECEIVED_TRANSFER_DATE: Date | null;
  LAST_SALE_DATE: Date | null;
  DAYS_WITHOUT_SALES: number;
  A_LA_FECHA: string;
  LOCATION: string;
  _raw: Record<string, unknown>;
}

function toNumber(v: unknown): number {
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}

function toStr(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function excelDateToJSDate(serial: unknown): Date | null {
  if (serial === null || serial === undefined || serial === '') return null;
  if (serial instanceof Date) return serial;
  if (typeof serial === 'number') {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    return date_info;
  }
  // try parse string
  const s = String(serial).trim();
  // dd/mm/yyyy
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    return new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]));
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

async function readWorkbook(file: File): Promise<XLSX.WorkBook> {
  const buffer = await file.arrayBuffer();
  return XLSX.read(buffer, { type: 'array', cellDates: true });
}

export async function parseSalesFile(file: File): Promise<SalesRow[]> {
  const wb = await readWorkbook(file);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { raw: true, defval: '' });

  return rows.map((r) => ({
    DATE: excelDateToJSDate(r['DATE']),
    FOLIO: toStr(r['FOLIO']),
    STORE: toStr(r['STORE']),
    SKU: toStr(r['SKU']),
    QUANTITY: toNumber(r['QUANTITY']),
    COGS_PES: toNumber(r['COGS PES']),
    COGS_USD: toNumber(r['COGS USD']),
    AMOUNT_PES: toNumber(r['AMOUNT PES']),
    AMOUNT_USD: toNumber(r['AMOUNT USD']),
    PRECIO_REGULAR: toNumber(r['PRECIO REGULAR']),
    DISCOUNT: toNumber(r['DISCOUNT']),
    TOTAL: toNumber(r['TOTAL']),
    CUSTOMER_CODE: toStr(r['CUSTOMER CODE']),
    CURRENCY: toStr(r['CURRENCY']),
    STATUS: toStr(r['STATUS']),
    TIME: toStr(r['TIME']),
    APPLIED_PROMOTION: toStr(r['APPLIED PROMOTION']),
    LINE: toStr(r['LINE']),
    FLIGHT_CRUISE: toStr(r['FLIGHT/CRUISE']),
    SEAT: toStr(r['SEAT']),
    ORIGIN: toStr(r['ORIGIN']),
    DESTINATION: toStr(r['DESTINATION']),
    NATIONALITY: toStr(r['NATIONALITY']),
    PASSPORT_NUMBER: toStr(r['PASSPORT NUMBER']),
    PASSENGER_NAME: toStr(r['PASSENGER NAME']),
    SELLER_CODE: toStr(r['SELLER CODE']),
    SELLER: toStr(r['SELLER']),
    CASHIER: toStr(r['CASHIER']),
    DATE_BIRTH: toStr(r['DATE BIRTH']),
    GENDER: toStr(r['GENDER']),
    _raw: r,
  }));
}

export async function parseDeparturesFile(file: File): Promise<DeparturesRow[]> {
  const wb = await readWorkbook(file);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { raw: true, defval: '' });

  return rows.map((r) => ({
    SKU_CODE: toStr(r['SKU CODE']),
    INITIAL_STOCK: toNumber(r['INITIAL STOCK']),
    UNIT_SALES: toNumber(r['UNIT SALES']),
    UNIT_PURCHASE: toNumber(r['UNIT PURCHASE']),
    DISPOSED_PRODUCT: toNumber(r['DISPOSED PRODUCT']),
    FINAL_STOCK: toNumber(r['FINAL STOCK']),
    EXCHANGE_RATE: toNumber(r['EXCHANGE RATE']),
    UNIT_COST_USD: toNumber(r['UNIT  COST USD'] ?? r['UNIT COST USD']),
    TOTAL_COST_USD: toNumber(r['TOTAL COST USD']),
    DAYS_IN_STOCK: toNumber(r['DAYS IN STOCK']),
    LAST_PURCHASE_DATE: excelDateToJSDate(r['LAST PURCHASE DATE']),
    LAST_RECEIVED_TRANSFER_DATE: excelDateToJSDate(r['LAST RECEIVED TRANSFER DATE']),
    LAST_SALE_DATE: excelDateToJSDate(r['LAST SALE DATE']),
    DAYS_WITHOUT_SALES: toNumber(r['DAYS WITHOUT SALES']),
    A_LA_FECHA: toStr(r['A LA FECHA']),
    LOCATION: toStr(r['LOCATION']),
    _raw: r,
  }));
}