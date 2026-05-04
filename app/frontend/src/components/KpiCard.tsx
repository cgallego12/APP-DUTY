import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: 'sky' | 'amber' | 'emerald' | 'rose' | 'violet';
}

const accentMap = {
  sky: 'from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/30',
  amber: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
  emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30',
  rose: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/30',
  violet: 'from-violet-500/20 to-violet-500/5 text-violet-400 border-violet-500/30',
};

export default function KpiCard({ label, value, sub, icon: Icon, accent = 'sky' }: KpiCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 backdrop-blur',
        accentMap[accent],
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white tabular-nums truncate">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className={cn('rounded-lg bg-slate-900/60 p-2 shrink-0')}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}