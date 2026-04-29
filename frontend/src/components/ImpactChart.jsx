import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './ImpactChart.css';

const COLORS = ['#2d5a3d', '#4a8c5c', '#7ab893', '#b8ddc8', '#8b6b4a', '#b8924a'];

const LABELS = {
  plastik:  'Plastik',
  kertas:   'Kertas',
  organik:  'Sampah Organik',
  kardus:   'Kardus/Karton',
  kaca:     'Kaca',
  lainnya:  'Lainnya',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="impact-tooltip">
      <strong>{LABELS[d.type] ?? d.type}</strong>
      <p>{d.total_weight} kg · {d.percentage}%</p>
    </div>
  );
};

export default function ImpactChart({ wasteByType = [], monthly = {} }) {
  const pieData = wasteByType.map((w) => ({ ...w, name: LABELS[w.type] ?? w.type }));
  const totalWeight = wasteByType.reduce((s, w) => s + w.total_weight, 0);

  const monthlyWeight = monthly?.weight ?? 0;
  const monthlyTarget = monthly?.target ?? 20;
  const monthlyProgress = monthly?.progress ?? 0;
  const remaining = Math.max(monthlyTarget - monthlyWeight, 0);

  return (
    <div className="impact-chart">
      <div className="impact-chart__top">
        <h2 className="impact-chart__title">Analisis Dampak</h2>
        <span className="impact-chart__period">Tampilan Bulanan</span>
      </div>

      {/* Monthly progress */}
      <div className="impact-chart__monthly">
        <p className="impact-monthly__label">Target Bulanan</p>
        <p className="impact-monthly__target">Pengalihan {monthlyTarget}kg</p>
        <div className="impact-monthly__bar-bg">
          <div
            className="impact-monthly__bar-fill"
            style={{ width: `${monthlyProgress}%` }}
          />
        </div>
        <p className="impact-monthly__info">
          {monthlyWeight.toFixed(1)}kg didaur ulang bulan ini.
          {remaining > 0 ? ` Sisa ${remaining.toFixed(1)}kg lagi untuk mencapai target!` : ' Target tercapai! 🎉'}
        </p>
      </div>

      {/* Pie + legend */}
      <div className="impact-chart__bottom">
        <div className="impact-chart__pie-wrap">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={pieData.length > 0 ? pieData : [{ name: 'Belum ada data', value: 1 }]}
                dataKey="total_weight"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={90}
                paddingAngle={2}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="impact-chart__center-label">
            <span className="impact-chart__center-text">TOTAL</span>
            <span className="impact-chart__center-value">{totalWeight.toFixed(0)}kg</span>
          </div>
        </div>

        <div className="impact-chart__legend-col">
          <p className="impact-chart__legend-title">Top Materials</p>
          {wasteByType.slice(0, 4).map((w, i) => (
            <div key={w.type} className="impact-legend-item">
              <span className="impact-legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="impact-legend-name">{LABELS[w.type] ?? w.type}</span>
              <span className="impact-legend-pct">{w.percentage}%</span>
            </div>
          ))}

          <div className="impact-chart__color-legend">
            {wasteByType.map((w, i) => (
              <span key={w.type} className="impact-color-tag">
                <span style={{ background: COLORS[i % COLORS.length] }} className="impact-color-dot" />
                {LABELS[w.type] ?? w.type} ({w.percentage}%)
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
