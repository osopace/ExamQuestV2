"use client";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm",
  secondary: "bg-primary-50 text-primary-700 hover:bg-primary-100",
  outline: "border-2 border-primary-200 text-primary-700 hover:bg-primary-50 bg-white",
  ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  danger: "bg-error text-white hover:bg-red-600",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant], sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? <Spinner /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  ),
);
Button.displayName = "Button";
export default Button;
