import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 cursor-pointer",
        variant === "primary" &&
          "bg-brand-orange text-white hover:bg-brand-orange-light",
        variant === "secondary" &&
          "border border-brand-emerald text-brand-emerald hover:bg-brand-emerald/10",
        variant === "ghost" &&
          "text-gray-400 hover:text-gray-100 hover:bg-brand-surface",
        size === "sm" && "text-sm px-3 py-1.5",
        size === "md" && "text-sm px-4 py-2",
        size === "lg" && "text-base px-6 py-3",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
