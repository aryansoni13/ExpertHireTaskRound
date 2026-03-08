import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-white/70">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3",
            "text-white placeholder:text-white/30 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50",
            "transition-all duration-200",
            error && "border-red-500/50 focus:ring-red-500/30",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-white/70">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3",
            "text-white placeholder:text-white/30 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50",
            "transition-all duration-200 resize-none",
            error && "border-red-500/50 focus:ring-red-500/30",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
