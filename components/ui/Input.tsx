"use client";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full space-y-1.5">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">{label}</label>}
        <div className="relative">
          {leftIcon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</span>}
          <input
            ref={ref} id={inputId}
            className={cn(
              "w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900",
              "placeholder:text-gray-400 transition-colors",
              "focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-400 focus:border-red-500 focus:ring-red-100",
              className,
            )}
            {...props}
          />
          {rightIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{rightIcon}</span>}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";
export default Input;
