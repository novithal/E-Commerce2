
export default function StatusBadge({ status }) {
  const className = String(status || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return <span className={`status-badge status-${className}`}>{status || "Unknown"}</span>;
}
