import { Loader2 } from "lucide-react";

export default function Spinner({
  size = 20,
  label = "Loading",
  className = "",
}) {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 32,
    xl: 48,
  };

  const iconSize = typeof size === "number" ? size : (sizeMap[size] || 20);

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label={label}
    >
      <Loader2 size={iconSize} className="animate-spin text-emerald-600" />
      <span className="sr-only">{label}</span>
    </span>
  );
}