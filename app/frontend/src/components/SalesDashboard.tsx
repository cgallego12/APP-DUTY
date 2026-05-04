import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  Percent,
  Receipt,
  Tag,
} from 'lucide-react';
import type { SalesRow } from '@/lib/excelParser';
import {
  computeSalesKPIs,
  groupByDate,
  groupByHour,
  groupByCategorical,
  topBy,
  formatCurrency,
  formatNumber,
} from '@/lib/analytics';
import KpiCard from './KpiCard';
import ChartCard from './ChartCard';

const PIE_COLORS = ['#0EA5E9', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];

interface SalesDashboardProps {
  rows: SalesRow[];
}

export default function SalesDashboard({ rows }: SalesDashboardProps) {
  const kpis = useMemo(() => computeSalesKPIs(rows), [rows]);
  const byDate = useMemo(() => groupByDate(rows), [rows]);
  const byHour = useMemo(() => groupByHour(rows), [rows]);
  const byOrigin = useMemo(() => groupByCategorical(rows, (r) => r.ORIGIN).slice(0, 8), [rows]);
  const byDestination = useMemo(() => groupByCategorical(rows, (r) => r.DESTINATION).slice(0, 8), [rows]);
  const byNationality = useMemo(() => groupByCategorical(rows, (r) => r.NATIONALITY).slice(0, 8), [rows]);
  const bySeller = useMemo(() => groupByCategorical(rows, (r) => r.SELLER).slice(0, 8), [rows]);
  const byGender = useMemo(() => groupByCategorical(rows, (r) => r.GENDER || 'N/D'), [rows]);
  const topSkus = useMemo(
    () => topBy(rows, (r) => r.SKU, (r) => r.AMOUNT_USD, 10),
    [rows],
  );
  const byCurrency = useMemo(() => groupByCategorical(rows, (r) => r.CURRENCY || 'N/D'), [rows]);
  const byPromo = useMemo(
    () => topBy(rows.filter((r) => r.APPLIED_PROMOTION), (r) => r.APPLIED_PROMOTION, (r) => r.AMOUNT_USD, 8),
    [rows],
  );

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center">
        <ShoppingBag className="h-12 w-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">Carga un archivo de ventas para ver el análisis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Ventas USD" value={formatCurrency(kpis.totalSalesUSD, 'USD')} icon={DollarSign} accent="sky" />
        <KpiCard label="Ventas COP" value={formatCurrency(kpis.totalSalesPES, 'COP')} icon={Receipt} accent="amber" />
        <KpiCard label="Transacciones" value={formatNumber(kpis.totalTransactions)} icon={ShoppingBag} accent="emerald" />
        <KpiCard label="Unidades" value={formatNumber(kpis.totalUnits)} icon={Package} accent="violet" />
        <KpiCard label="Ticket promedio" value={formatCurrency(kpis.avgTicketUSD, 'USD')} icon={TrendingUp} accent="sky" />
        <KpiCard label="Clientes únicos" value={formatNumber(kpis.uniqueCustomers)} icon={Users} accent="amber" />
        <KpiCard label="SKUs vendidos" value={formatNumber(kpis.uniqueSKUs)} icon={Tag} accent="emerald" />
        <KpiCard label="Descuentos" value={formatCurrency(kpis.totalDiscount, 'USD')} icon={Percent} accent="rose" />
      </div>

      {/* Time Series */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Ventas por día" subtitle="Monto en USD">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={byDate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="key" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Line type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Ventas por hora" subtitle="Distribución horaria">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byHour}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="key" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Routes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Top orígenes" subtitle="Aeropuertos de origen">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byOrigin} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="key" stroke="#64748b" tick={{ fontSize: 11 }} width={60} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Bar dataKey="value" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Top destinos" subtitle="Aeropuertos de destino">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byDestination} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="key" stroke="#64748b" tick={{ fontSize: 11 }} width={60} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Customer profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Por nacionalidad" subtitle="Top 8 nacionalidades">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byNationality}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="key" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Por género" subtitle="Distribución de clientes">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={byGender} dataKey="value" nameKey="key" cx="50%" cy="50%" outerRadius={80} label={(e) => e.key}>
                {byGender.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Por moneda" subtitle="Distribución de pagos">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={byCurrency} dataKey="value" nameKey="key" cx="50%" cy="50%" outerRadius={80} label={(e) => e.key}>
                {byCurrency.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Sellers + Top SKUs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Top vendedores" subtitle="Ventas generadas">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bySeller} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="key"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                width={140}
                tickFormatter={(v: string) => (v.length > 18 ? v.slice(0, 18) + '…' : v)}
              />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Top SKUs" subtitle="Productos más vendidos">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSkus} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="key" stroke="#64748b" tick={{ fontSize: 10 }} width={80} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Bar dataKey="value" fill="#EC4899" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Promotions */}
      {byPromo.length > 0 && (
        <ChartCard title="Promociones aplicadas" subtitle="Impacto por campaña">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byPromo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="key" stroke="#64748b" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
                formatter={(v: number) => formatCurrency(v)}
              />
              <Bar dataKey="value" fill="#14B8A6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}