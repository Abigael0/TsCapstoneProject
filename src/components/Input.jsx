// import { Loader2 } from "lucide-react";

// export default function Button({
//   children,
//   type = "button",
//   variant = "primary",
//   size = "medium",
//   loading = false,
//   disabled = false,
//   className = "",
//   ...props
// }) {
//   return (
//     <button
//       type={type}
//       className={`button button-${variant} button-${size} ${className}`}
//       disabled={disabled || loading}
//       {...props}
//     >
//       {loading && <Loader2 className="button-spinner" size={17} />}
//       {children}
//     </button>
//   );
// }

//import { Loader2 } from "lucide-react";

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error = "",
  className = "",
  ...props
}) {
  return (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input-field ${error ? "input-field-error" : ""} ${className}`}
        {...props}
      />
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}