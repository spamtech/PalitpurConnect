export default function Card({
  children,
  className = "",
  hover = false,
  ...props
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-200/80 bg-white/80",
        "shadow-sm backdrop-blur-xl",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}