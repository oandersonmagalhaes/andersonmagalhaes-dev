"use client";

import { Copy, Check } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/cn";
import styles from "./CopyButton.module.css";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className }: CopyButtonProps) {
  const t = useTranslations("tools");
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      onClick={() => copy(text)}
      className={cn(styles.button, copied && styles.copied, className)}
    >
      {copied ? (
        <>
          <Check size={14} /> {t("copied")}
        </>
      ) : (
        <>
          <Copy size={14} /> {t("copy")}
        </>
      )}
    </button>
  );
}
