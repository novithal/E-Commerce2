
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const Icon = toast.type === "error" ? AlertCircle : CheckCircle2;

  return (
    <div className={`toast ${toast.type === "error" ? "toast-error" : ""}`} role="status">
      <Icon size={19} />
      <span>{toast.message}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss notification">
        <X size={15} />
      </button>
    </div>
  );
}
