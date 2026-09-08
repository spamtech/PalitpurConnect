import { Loader2 } from "lucide-react";

export default function Spinner({
  size = 20,
  label = "Loading",
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label={label}
    >
      <Loader2 size={size} className="animate-spin text-emerald-600" />
      <span className="sr-only">{label}</span>
    </span>
  );
}