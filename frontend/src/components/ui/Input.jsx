import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    error,
    helper,
    required = false,
    id,
    className = "",
    ...props
  },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
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

      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error
            ? `${inputId}-error`
            : helper
              ? `${inputId}-helper`
              : undefined
        }
        className={[
          "w-full rounded-xl border bg-white px-4 py-3",
          "text-sm text-slate-900 placeholder:text-slate-400",
          "outline-none transition-all duration-200",
          "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
            : "border-slate-200",
          "disabled:cursor-not-allowed disabled:bg-slate-50",
          className,
        ].join(" ")}
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      {!error && helper && (
        <p id={`${inputId}-helper`} className="text-xs text-slate-500">
          {helper}
        </p>
      )}
    </div>
  );
});

export default Input;