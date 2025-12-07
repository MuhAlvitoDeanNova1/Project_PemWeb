import React from "react";

export default function InputField({
  id,
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-gray-300 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />
      </div>
    </div>
  );
}