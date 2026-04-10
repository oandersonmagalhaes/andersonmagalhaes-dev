import { cn } from "@/lib/cn";
import styles from "./Badge.module.css";

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
    <span className={cn(styles.badge, styles[variant], className)}>
      {children}
    </span>
  );
}
