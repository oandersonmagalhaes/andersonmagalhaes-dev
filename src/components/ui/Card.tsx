import { cn } from "@/lib/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-brand-card border border-gray-800 rounded-lg p-6",
        hover && "hover:border-brand-orange/50 transition-colors duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
