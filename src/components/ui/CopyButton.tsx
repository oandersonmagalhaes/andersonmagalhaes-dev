"use client";

import { Copy, Check } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/cn";

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
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded transition-colors cursor-pointer",
        copied
          ? "text-brand-emerald bg-brand-emerald/10"
          : "text-gray-400 hover:text-brand-orange bg-brand-surface hover:bg-brand-surface/80",
        className
      )}
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
