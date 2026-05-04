import { Calendar, Globe, Filter as FilterIcon, RotateCcw } from 'lucide-react';

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  origin: string;
  destination: string;
  nationality: string;
  seller: string;
}

interface FiltersProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  origins: string[];
  destinations: string[];
  nationalities: string[];
  sellers: string[];
  onReset: () => void;
}

export default function Filters({
  filters,
  onChange,
  origins,
  destinations,
  nationalities,
  sellers,
  onReset,
}: FiltersProps) {
  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-100">Filtros</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-100 transition"
        >
          <RotateCcw className="h-3 w-3" />
          Limpiar
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Calendar className="h-3 w-3" /> Desde
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set({ dateFrom: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Calendar className="h-3 w-3" /> Hasta
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => set({ dateTo: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Globe className="h-3 w-3" /> Origen
          </label>
          <select
            value={filters.origin}
            onChange={(e) => set({ origin: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
          >
            <option value="">Todos</option>
            {origins.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 flex items-center gap-1 mb-1">
            <Globe className="h-3 w-3" /> Destino
          </label>
          <select
            value={filters.destination}
            onChange={(e) => set({ destination: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
          >
            <option value="">Todos</option>
            {destinations.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Nacionalidad</label>
          <select
            value={filters.nationality}
            onChange={(e) => set({ nationality: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
          >
            <option value="">Todas</option>
            {nationalities.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Vendedor</label>
          <select
            value={filters.seller}
            onChange={(e) => set({ seller: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
          >
            <option value="">Todos</option>
            {sellers.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}