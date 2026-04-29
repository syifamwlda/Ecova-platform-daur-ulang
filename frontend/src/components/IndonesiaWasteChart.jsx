import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './IndonesiaWasteChart.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="iw-tooltip">
      <p className="iw-tooltip__year">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: <strong>{p.value} juta ton</strong>
        </p>
      ))}
    </div>
  );
};

export default function IndonesiaWasteChart({ data }) {
  return (
    <div className="iw-chart">
      <div className="iw-chart__header">
        <h2 className="iw-chart__title">Timbulan Sampah Indonesia 2020–2026</h2>
        <p className="iw-chart__subtitle">
          "2026 merupakan proyeksi berdasarkan tren data 2020–2025"
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          barGap={4}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: '#6b7c6d' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6b7c6d' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Legend
            iconType="square"
            iconSize={10}
            formatter={(val) => (
              <span style={{ fontSize: 12, color: '#4a5e4e' }}>
                {val === 'managed' ? 'Terkelola' : 'Tidak Terkelola'}
              </span>
            )}
          />
          <Bar dataKey="managed"   name="managed"   fill="#4a8c5c" radius={[4,4,0,0]} />
          <Bar dataKey="unmanaged" name="unmanaged" fill="#b8ddc8" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
