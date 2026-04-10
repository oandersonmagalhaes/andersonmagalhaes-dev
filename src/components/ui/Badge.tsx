import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "orange" | "emerald" | "gray";
  className?: string;
}

export default function Badge({
  children,
  variant = "gray",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-mono",
        variant === "orange" &&
          "bg-brand-orange/10 text-brand-orange border border-brand-orange/20",
        variant === "emerald" &&
          "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20",
        variant === "gray" &&
          "bg-gray-800/50 text-gray-400 border border-gray-700/50",
        className
      )}
    >
      {children}
    </span>
  );
}
