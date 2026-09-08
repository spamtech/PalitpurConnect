const variants = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  teal: "bg-teal-50 text-teal-700 border-teal-100",
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  red: "bg-red-50 text-red-700 border-red-100",
  slate: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function Badge({
  children,
  variant = "emerald",
  className = "",
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border",
        "px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}