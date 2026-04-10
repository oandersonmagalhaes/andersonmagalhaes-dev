import { cn } from "@/lib/cn";
import styles from "./Card.module.css";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <div className={cn(styles.card, hover && styles.hoverable, className)}>
      {children}
    </div>
  );
}
