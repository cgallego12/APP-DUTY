import type { SalesRow, DeparturesRow } from './excelParser';

export interface SalesKPIs {
  totalSalesUSD: number;
  totalSalesPES: number;
  totalTransactions: number;
  totalUnits: number;
  avgTicketUSD: number;
  totalDiscount: number;
  uniqueCustomers: number;
  uniqueSKUs: number;
}

export function computeSalesKPIs(rows: SalesRow[]): SalesKPIs {
  const active = rows.filter((r) => r.STATUS === 'ACTIVO');
  const totalSalesUSD = active.reduce((s, r) => s + r.AMOUNT_USD, 0);
  const totalSalesPES = active.reduce((s, r) => s + r.AMOUNT_PES, 0);
  const folios = new Set(active.map((r) => r.FOLIO));
  const totalUnits = active.reduce((s, r) => s + r.QUANTITY, 0);
  const customers = new Set(active.map((r) => r.PASSPORT_NUMBER).filter(Boolean));
  const skus = new Set(active.map((r) => r.SKU).filter(Boolean));
  const totalDiscount = active.reduce((s, r) => s + r.DISCOUNT, 0);
  return {
    totalSalesUSD,
    totalSalesPES,
    totalTransactions: folios.size,
    totalUnits,
    avgTicketUSD: folios.size > 0 ? totalSalesUSD / folios.size : 0,
    totalDiscount,
    uniqueCustomers: customers.size,
    uniqueSKUs: skus.size,
  };
}

export interface SeriesPoint {
  key: string;
  value: number;
  value2?: number;
  count?: number;
}

export function groupByDate(rows: SalesRow[]): SeriesPoint[] {
  const map = new Map<string, { value: number; count: number }>();
  for (const r of rows) {
    if (!r.DATE) continue;
    const key = r.DATE.toISOString().slice(0, 10);
    const cur = map.get(key) ?? { value: 0, count: 0 };
    cur.value += r.AMOUNT_USD;
    cur.count += 1;
    map.set(key, cur);
  }
  return Array.from(map.entries())
    .map(([key, v]) => ({ key, value: v.value, count: v.count }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

export function groupByHour(rows: SalesRow[]): SeriesPoint[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const h = r.TIME ? r.TIME.slice(0, 2) : '';
    if (!h) continue;
    map.set(h, (map.get(h) ?? 0) + r.AMOUNT_USD);
  }
  return Array.from(map.entries())
    .map(([key, value]) => ({ key: `${key}:00`, value }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

export function topBy<T>(
  rows: T[],
  keyFn: (r: T) => string,
  valueFn: (r: T) => number,
  limit = 10,
): SeriesPoint[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = keyFn(r);
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + valueFn(r));
  }
  return Array.from(map.entries())
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function groupByCategorical(
  rows: SalesRow[],
  keyFn: (r: SalesRow) => string,
): SeriesPoint[] {
  return topBy(rows, keyFn, (r) => r.AMOUNT_USD, 20);
}

// Departures analytics
export interface InventoryKPIs {
  totalSKUs: number;
  totalStockValueUSD: number;
  totalUnitsInStock: number;
  skusWithoutSales: number;
  deadStockSKUs: number; // > 180 days without sales
  lowStockSKUs: number; // final stock 1-5
  outOfStockSKUs: number; // final stock 0 but had sales
}

export function computeInventoryKPIs(rows: DeparturesRow[]): InventoryKPIs {
  const totalSKUs = rows.length;
  const totalStockValueUSD = rows.reduce((s, r) => s + r.TOTAL_COST_USD, 0);
  const totalUnitsInStock = rows.reduce((s, r) => s + r.FINAL_STOCK, 0);
  const skusWithoutSales = rows.filter((r) => r.UNIT_SALES === 0 && r.FINAL_STOCK > 0).length;
  const deadStockSKUs = rows.filter((r) => r.DAYS_WITHOUT_SALES > 180 && r.DAYS_WITHOUT_SALES < 9999 && r.FINAL_STOCK > 0).length;
  const lowStockSKUs = rows.filter((r) => r.FINAL_STOCK > 0 && r.FINAL_STOCK <= 5).length;
  const outOfStockSKUs = rows.filter((r) => r.FINAL_STOCK === 0 && r.UNIT_SALES > 0).length;
  return {
    totalSKUs,
    totalStockValueUSD,
    totalUnitsInStock,
    skusWithoutSales,
    deadStockSKUs,
    lowStockSKUs,
    outOfStockSKUs,
  };
}

export function stockBuckets(rows: DeparturesRow[]): SeriesPoint[] {
  const buckets = [
    { key: 'Sin stock', test: (r: DeparturesRow) => r.FINAL_STOCK === 0 },
    { key: '1-5 uds', test: (r: DeparturesRow) => r.FINAL_STOCK >= 1 && r.FINAL_STOCK <= 5 },
    { key: '6-20 uds', test: (r: DeparturesRow) => r.FINAL_STOCK >= 6 && r.FINAL_STOCK <= 20 },
    { key: '21-50 uds', test: (r: DeparturesRow) => r.FINAL_STOCK >= 21 && r.FINAL_STOCK <= 50 },
    { key: '51+ uds', test: (r: DeparturesRow) => r.FINAL_STOCK > 50 },
  ];
  return buckets.map((b) => ({ key: b.key, value: rows.filter(b.test).length }));
}

export function rotationBuckets(rows: DeparturesRow[]): SeriesPoint[] {
  const buckets = [
    { key: '0-30 días', min: 0, max: 30 },
    { key: '31-90 días', min: 31, max: 90 },
    { key: '91-180 días', min: 91, max: 180 },
    { key: '181-365 días', min: 181, max: 365 },
    { key: '+365 días', min: 366, max: 9998 },
  ];
  return buckets.map((b) => ({
    key: b.key,
    value: rows.filter((r) => r.DAYS_WITHOUT_SALES >= b.min && r.DAYS_WITHOUT_SALES <= b.max).length,
  }));
}

export function topMovingSKUs(rows: DeparturesRow[], limit = 10): SeriesPoint[] {
  return rows
    .filter((r) => r.UNIT_SALES > 0)
    .sort((a, b) => b.UNIT_SALES - a.UNIT_SALES)
    .slice(0, limit)
    .map((r) => ({ key: r.SKU_CODE, value: r.UNIT_SALES, value2: r.FINAL_STOCK }));
}

export function topStockValueSKUs(rows: DeparturesRow[], limit = 10): SeriesPoint[] {
  return rows
    .filter((r) => r.TOTAL_COST_USD > 0)
    .sort((a, b) => b.TOTAL_COST_USD - a.TOTAL_COST_USD)
    .slice(0, limit)
    .map((r) => ({ key: r.SKU_CODE, value: r.TOTAL_COST_USD }));
}

export function formatCurrency(n: number, currency: 'USD' | 'COP' = 'USD'): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  }
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}