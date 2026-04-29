import './DashboardCard.css';

export default function DashboardCard({ label, value, badge, icon, trend }) {
  return (
    <div className="dash-card">
      <div className="dash-card__header">
        <span className="dash-card__label">{label}</span>
        {icon && <span className="dash-card__icon">{icon}</span>}
      </div>
      <div className="dash-card__value">{value}</div>
      {(badge || trend) && (
        <div className="dash-card__footer">
          {badge && <span className="dash-card__badge">{badge}</span>}
          {trend && <span className="dash-card__trend">{trend}</span>}
        </div>
      )}
    </div>
  );
}
