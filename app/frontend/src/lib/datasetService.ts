import { client } from './api';
import type { SalesRow, DeparturesRow } from './excelParser';

export interface StoredDataset {
  id: number;
  name: string;
  dataset_type: 'sales' | 'departures';
  row_count: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Save a parsed dataset to backend.
 */
export async function saveDataset(
  datasetType: 'sales' | 'departures',
  name: string,
  rows: (SalesRow | DeparturesRow)[],
): Promise<void> {
  const payload = JSON.stringify(rows);
  await client.entities.datasets.create({
    data: {
      name,
      dataset_type: datasetType,
      row_count: rows.length,
      payload,
    },
  });
}

/**
 * Load the latest dataset of a given type.
 */
export async function loadLatestDataset<T>(
  datasetType: 'sales' | 'departures',
): Promise<{ meta: StoredDataset; rows: T[] } | null> {
  const resp = await client.entities.datasets.query({
    query: { dataset_type: datasetType },
    sort: '-created_at',
    limit: 1,
  });
  const items = resp?.data?.items || [];
  if (items.length === 0) return null;
  const item = items[0];
  try {
    const rows = JSON.parse(item.payload || '[]') as T[];
    return {
      meta: {
        id: item.id,
        name: item.name,
        dataset_type: item.dataset_type,
        row_count: item.row_count,
        created_at: item.created_at,
        updated_at: item.updated_at,
      },
      rows,
    };
  } catch (e) {
    console.error('Failed to parse dataset payload', e);
    return null;
  }
}

/**
 * List available datasets metadata (without payload bytes).
 */
export async function listDatasets(): Promise<StoredDataset[]> {
  const resp = await client.entities.datasets.query({
    query: {},
    sort: '-created_at',
    limit: 50,
    fields: ['id', 'name', 'dataset_type', 'row_count', 'created_at', 'updated_at'],
  });
  const items = resp?.data?.items || [];
  return items as StoredDataset[];
}