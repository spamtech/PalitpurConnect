import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
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
  const textareaId = id || props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
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

      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={Boolean(error)}
        className={[
          "min-h-[120px] w-full resize-y rounded-xl border bg-white",
          "px-4 py-3 text-sm text-slate-900",
          "placeholder:text-slate-400 outline-none",
          "transition-all duration-200",
          "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
          error
            ? "border-red-300 focus:border-red-500"
            : "border-slate-200",
          className,
        ].join(" ")}
        {...props}
      />

      {error && (
        <p className="text-xs font-medium text-red-600">{error}</p>
      )}

      {!error && helper && (
        <p className="text-xs text-slate-500">{helper}</p>
      )}
    </div>
  );
});

export default Textarea;