
export default function StatCard({ title, value, icon: Icon, tone = "purple", note }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <span className={`metric-icon ${tone}`}><Icon size={19} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot">
        {note || "Updated from current store data"}
      </div>
    </article>
  );
}
