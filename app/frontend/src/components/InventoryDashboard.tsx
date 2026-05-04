import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Package,
  DollarSign,
  AlertTriangle,
  Boxes,
  PackageX,
  PackageMinus,
  Clock,
} from 'lucide-react';
import type { DeparturesRow } from '@/lib/excelParser';
import {
  computeInventoryKPIs,
  stockBuckets,
  rotationBuckets,
  topMovingSKUs,
  topStockValueSKUs,
  formatCurrency,
  formatNumber,
} from '@/lib/analytics';
import KpiCard from './KpiCard';
import ChartCard from './ChartCard';

const PIE_COLORS = ['#10B981', '#0EA5E9', '#F59E0B', '#EF4444', '#8B5CF6'];

interface InventoryDashboardProps {
  rows: DeparturesRow[];
}

export default function InventoryDashboard({ rows }: InventoryDashboardProps) {
  const kpis = useMemo(() => computeInventoryKPIs(rows), [rows]);
  const stockBkt = useMemo(() => stockBuckets(rows), [rows]);
  const rotationBkt = useMemo(() => rotationBuckets(rows), [rows]);
  const topMoving = useMemo(() => topMovingSKUs(rows, 12), [rows]);
  const topValue = useMemo(() => topStockValueSKUs(rows, 12), [rows]);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center">
        <Boxes className="h-12 w-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">Carga un archivo de inventario (Departures) para ver el análisis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total SKUs" value={formatNumber(kpis.totalSKUs)} icon={Package} accent="sky" />
        <KpiCard
          label="Valor inventario"
          value={formatCurrency(kpis.totalStockValueUSD, 'USD')}
          icon={DollarSign}
          accent="amber"
        />
        <KpiCard label="Unidades en stock" value={formatNumber(kpis.totalUnitsInStock)} icon={Boxes} accent="emerald" />
        <KpiCard
          label="Stock muerto (>180d)"
          value={formatNumber(kpis.deadStockSKUs)}
          sub="SKUs sin rotación"
          icon={Clock}
          accent="rose"
        />
        <KpiCard
          label="Stock bajo"
          value={formatNumber(kpis.lowStockSKUs)}
          sub="1-5 unidades"
          icon={PackageMinus}
          accent="amber"
        />
        <KpiCard
          label="Sin stock vendible"
          value={formatNumber(kpis.outOfStockSKUs)}
          sub="Con ventas pero en 0"
          icon={PackageX}
          accent="rose"
        />
        <KpiCard
          label="Sin ventas"
          value={formatNumber(kpis.skusWithoutSales)}
          sub="Con stock, sin venta"
          icon={AlertTriangle}
          accent="violet"
        />
        <KpiCard
          label="Prom. días sin venta"
          value={formatNumber(
            rows.length > 0
              ? rows.reduce((s, r) => s + Math.min(r.DAYS_WITHOUT_SALES, 9998), 0) / rows.length
              : 0,
          )}
          icon={Clock}
          accent="sky"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Distribución de stock" subtitle="SKUs por rango de unidades">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={stockBkt} dataKey="value" nameKey="key" cx="50%" cy="50%" outerRadius={90} label={(e) => e.key}>
                {stockBkt.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Rotación de inventario" subtitle="SKUs por días sin venta">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rotationBkt}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="key" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {rotationBkt.map((_, i) => (
                  <Cell key={i} fill={['#10B981', '#0EA5E9', '#F59E0B', '#F97316', '#EF4444'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Top SKUs con más ventas" subtitle="Unidades vendidas en el periodo">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={topMoving} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="key" stroke="#64748b" tick={{ fontSize: 10 }} width={80} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="value" name="Unidades vendidas" fill="#10B981" radius={[0, 4, 4, 0]} />
              <Bar dataKey="value2" name="Stock final" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top SKUs por valor en stock" subtitle="USD inmovilizado">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={topValue} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="key" stroke="#64748b" tick={{ fontSize: 10 }} width={80} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}