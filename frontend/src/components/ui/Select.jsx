import { forwardRef } from "react";

const Select = forwardRef(function Select(
  {
    label,
    error,
    helper,
    required = false,
    id,
    children,
    className = "",
    ...props
  },
  ref
) {
  const selectId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-semibold text-slate-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error)}
        className={[
          "w-full rounded-xl border bg-white px-4 py-3",
          "text-sm text-slate-900 outline-none",
          "transition-all duration-200",
          "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
          error
            ? "border-red-300 focus:border-red-500"
            : "border-slate-200",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </select>

      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}

      {!error && helper && (
        <p className="text-xs text-slate-500">{helper}</p>
      )}
    </div>
  );
});

export default Select;