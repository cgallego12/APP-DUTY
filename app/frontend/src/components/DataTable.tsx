import { useMemo, useState } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DataTableProps<T extends Record<string, unknown>> {
  rows: T[];
  columns: { key: keyof T; label: string; format?: (v: unknown) => string }[];
  filename?: string;
  title?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  filename = 'datos',
  title = 'Datos',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const pageSize = 20;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows;
    if (q) {
      list = rows.filter((r) =>
        columns.some((c) => {
          const v = r[c.key];
          return v !== null && v !== undefined && String(v).toLowerCase().includes(q);
        }),
      );
    }
    if (sortKey) {
      const k = sortKey;
      list = [...list].sort((a, b) => {
        const av = a[k];
        const bv = b[k];
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av;
        }
        const as = String(av ?? '');
        const bs = String(bv ?? '');
        return sortDir === 'asc' ? as.localeCompare(bs) : bs.localeCompare(as);
      });
    }
    return list;
  }, [rows, columns, query, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handleSort = (k: keyof T) => {
    if (sortKey === k) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(k);
      setSortDir('asc');
    }
  };

  const handleExport = () => {
    const data = filtered.map((r) => {
      const obj: Record<string, unknown> = {};
      for (const c of columns) {
        const v = r[c.key];
        obj[c.label] = c.format ? c.format(v) : (v as unknown);
      }
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{filtered.length.toLocaleString()} registros</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              className="bg-slate-950 border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-100 w-56 focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-950/60">
            <tr>
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  onClick={() => handleSort(c.key)}
                  className="px-3 py-2.5 text-left font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-100 whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    <ArrowUpDown className="h-3 w-3 opacity-50" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => (
              <tr
                key={i}
                className="border-t border-slate-800 hover:bg-slate-800/40 transition"
              >
                {columns.map((c) => {
                  const v = r[c.key];
                  const display = c.format ? c.format(v) : v === null || v === undefined ? '' : String(v);
                  return (
                    <td key={String(c.key)} className="px-3 py-2 text-slate-200 whitespace-nowrap">
                      {display}
                    </td>
                  );
                })}
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-12 text-center text-slate-500">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-3 border-t border-slate-800">
        <p className="text-xs text-slate-500">
          Página {currentPage + 1} de {pageCount}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="p-1.5 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
            disabled={currentPage >= pageCount - 1}
            className="p-1.5 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}