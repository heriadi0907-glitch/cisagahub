import { BarChart3, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { UmkmListing } from '../types/umkm';
import {
  getMonthlyUmkmRegistrationTrend,
  type MonthlyRegistrationTrendPoint,
} from '../utils/umkmLogic';

interface UmkmRegistrationTrendChartProps {
  listings: UmkmListing[];
}

type ChartMode = 'area' | 'bar';

interface CustomTooltipPayloadItem {
  payload?: MonthlyRegistrationTrendPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayloadItem[];
}

function CustomTrendTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-md px-3.5 py-2.5 text-xs">
      <p className="font-semibold text-[#0F2744] mb-1.5">{point.monthLabel}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[#475569]">Total Terdaftar</span>
          <span className="font-mono tabular-nums font-bold text-[#0F2744]">
            {point.total} UMKM
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 text-[#475569]">
            <span className="w-2 h-2 rounded-full bg-[#EA580C]" aria-hidden="true" />
            Premium
          </span>
          <span className="font-mono tabular-nums font-semibold text-[#C2410C]">
            {point.premium}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 text-[#475569]">
            <span className="w-2 h-2 rounded-full bg-[#047857]" aria-hidden="true" />
            Reguler (Free)
          </span>
          <span className="font-mono tabular-nums font-semibold text-[#047857]">
            {point.reguler}
          </span>
        </div>
      </div>
    </div>
  );
}

export function UmkmRegistrationTrendChart({ listings }: UmkmRegistrationTrendChartProps) {
  const [chartMode, setChartMode] = useState<ChartMode>('area');

  const trendData = useMemo(
    () => getMonthlyUmkmRegistrationTrend(listings),
    [listings]
  );

  const periodStats = useMemo(() => {
    const totalInPeriod = trendData.reduce((sum, p) => sum + p.total, 0);
    const currentMonth = trendData[trendData.length - 1];
    const peakPoint = trendData.reduce<MonthlyRegistrationTrendPoint | null>(
      (best, point) => (!best || point.total > best.total ? point : best),
      null
    );
    return {
      totalInPeriod,
      currentMonthCount: currentMonth?.total ?? 0,
      currentMonthLabel: currentMonth?.monthLabel ?? '-',
      peakLabel: peakPoint && peakPoint.total > 0 ? `${peakPoint.monthLabel} (${peakPoint.total})` : '-',
    };
  }, [trendData]);

  return (
    <section
      data-testid="admin-registration-trend-chart"
      aria-label="Grafik tren pendaftaran UMKM per bulan"
      className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 space-y-5"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C2410C] mb-1">
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Pertumbuhan Portal per Bulan</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F2744] tracking-tight">
            Tren Jumlah Pendaftaran UMKM
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Total <span className="font-mono font-semibold text-[#0F2744]">{periodStats.totalInPeriod} UMKM</span>{' '}
            terdaftar pada {trendData.length} bulan terakhir · Puncak:{' '}
            <span className="font-medium text-[#0F2744]">{periodStats.peakLabel}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 text-xs text-[#475569]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0F2744]" aria-hidden="true" />
              Total / Reguler
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#EA580C]" aria-hidden="true" />
              Premium
            </span>
          </div>

          <div
            role="group"
            aria-label="Mode tampilan grafik pendaftaran UMKM"
            className="inline-flex items-center gap-1 p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg"
          >
            <button
              type="button"
              data-testid="trend-mode-area"
              onClick={() => setChartMode('area')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                chartMode === 'area'
                  ? 'bg-[#0F2744] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0F2744]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Kurva Tren</span>
            </button>
            <button
              type="button"
              data-testid="trend-mode-bar"
              onClick={() => setChartMode('bar')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                chartMode === 'bar'
                  ? 'bg-[#0F2744] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0F2744]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Batang Rinci</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-[260px] min-w-0">
        <ResponsiveContainer width="100%" height={260} minWidth={0}>
          {chartMode === 'area' ? (
            <AreaChart data={trendData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="umkmTotalFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F2744" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#0F2744" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="umkmPremiumFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EA580C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="monthLabel"
                tick={{ fill: '#475569', fontSize: 12 }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#475569', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTrendTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                name="Total UMKM"
                stroke="#0F2744"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#umkmTotalFill)"
                dot={{ r: 4, fill: '#0F2744', stroke: '#FFFFFF', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#0F2744', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="premium"
                name="Premium"
                stroke="#EA580C"
                strokeWidth={2}
                strokeDasharray="4 3"
                fillOpacity={1}
                fill="url(#umkmPremiumFill)"
                dot={{ r: 3.5, fill: '#EA580C', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#EA580C', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={trendData} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="monthLabel"
                tick={{ fill: '#475569', fontSize: 12 }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#475569', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTrendTooltip />} />
              <Bar
                dataKey="reguler"
                name="Reguler (Free)"
                stackId="umkm"
                fill="#0F2744"
                radius={[0, 0, 0, 0]}
                maxBarSize={44}
              />
              <Bar
                dataKey="premium"
                name="Premium"
                stackId="umkm"
                fill="#EA580C"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
