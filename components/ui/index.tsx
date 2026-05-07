"use client";
import { forwardRef, type HTMLAttributes, type ReactNode, useEffect } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/format";

/* ── Card ── */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}
const paddingMap = { sm: "p-4", md: "p-6", lg: "p-8", none: "" } as const;
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable, padding = "md", children, ...props }, ref) => (
    <div ref={ref} className={cn("bg-white rounded-2xl border border-gray-100 shadow-card", hoverable && "transition-all hover:shadow-hover hover:-translate-y-0.5 cursor-pointer", paddingMap[padding], className)} {...props}>
      {children}
    </div>
  ),
);
Card.displayName = "Card";

/* ── Badge ── */
type BadgeVariant = "primary" | "success" | "warning" | "error" | "info" | "neutral";
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
}
const badgeVariants: Record<BadgeVariant, string> = {
  primary: "bg-primary-50 text-primary-700",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  error: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
  neutral: "bg-gray-100 text-gray-600",
};
export function Badge({ variant = "neutral", size = "sm", className, children, ...props }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full font-medium", badgeVariants[variant], size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm", className)} {...props}>
      {children}
    </span>
  );
}

/* ── Avatar ── */
interface AvatarProps { name?: string; src?: string; size?: "xs" | "sm" | "md" | "lg" | "xl"; className?: string; }
const avatarSizes = { xs: "w-6 h-6 text-xs", sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base", xl: "w-20 h-20 text-xl" } as const;
export function Avatar({ name = "", src, size = "md", className }: AvatarProps) {
  if (src) return <img src={src} alt={name} className={cn("rounded-full object-cover", avatarSizes[size], className)} />;
  return (
    <div className={cn("rounded-full bg-gradient-to-br from-primary-600 to-primary-400 text-white font-semibold flex items-center justify-center", avatarSizes[size], className)}>
      {getInitials(name) || "U"}
    </div>
  );
}

/* ── ProgressBar ── */
interface ProgressBarProps { value: number; max?: number; size?: "sm" | "md" | "lg"; color?: "primary" | "success" | "warning" | "error"; className?: string; showLabel?: boolean; }
const pbSizes = { sm: "h-1.5", md: "h-2.5", lg: "h-3.5" } as const;
const pbColors = { primary: "bg-primary-600", success: "bg-green-500", warning: "bg-amber-500", error: "bg-red-500" } as const;
export function ProgressBar({ value, max = 100, size = "md", color = "primary", className, showLabel }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      {showLabel && <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Progress</span><span>{Math.round(pct)}%</span></div>}
      <div className={cn("w-full bg-gray-100 rounded-full overflow-hidden", pbSizes[size])}>
        <div className={cn("h-full rounded-full transition-all duration-500", pbColors[color])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── Modal ── */
interface ModalProps { open: boolean; onClose: () => void; title?: string; children: ReactNode; size?: "sm" | "md" | "lg"; }
const modalSizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" } as const;
export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative bg-white rounded-2xl shadow-modal w-full animate-slide-up overflow-hidden", modalSizes[size])}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
          </div>
        )}
        {!title && <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 z-10"><X size={18} /></button>}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ── Stepper ── */
interface StepperProps { steps: string[]; current: number; className?: string; }
export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-center w-full", className)}>
      {steps.map((label, i) => {
        const done = i < current; const active = i === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all", done && "bg-primary-600 text-white", active && "bg-primary-600 text-white ring-4 ring-primary-100", !done && !active && "bg-gray-100 text-gray-400")}>
                {done ? <Check size={16} /> : i + 1}
              </div>
              <span className={cn("text-xs font-medium", active ? "text-primary-600" : "text-gray-400")}>{label}</span>
            </div>
            {i < steps.length - 1 && <div className={cn("flex-1 h-0.5 mx-2 mb-4 transition-colors", done ? "bg-primary-600" : "bg-gray-200")} />}
          </div>
        );
      })}
    </div>
  );
}
