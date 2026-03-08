import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl",
        "transition-all duration-300",
        glow && "hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10",
        className
      )}
    >
      {children}
    </div>
  );
}
