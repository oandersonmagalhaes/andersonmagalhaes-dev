"use client";

import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";

interface ToolLayoutProps {
  titleKey: string;
  descriptionKey: string;
  children: React.ReactNode;
}

export default function ToolLayout({
  titleKey,
  descriptionKey,
  children,
}: ToolLayoutProps) {
  const t = useTranslations("tools");
  const locale = useLocale();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href={`/${locale}/`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-orange transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          {t("back")}
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-mono font-bold text-gray-100 mb-2">
            {t(titleKey)}
          </h1>
          <p className="text-gray-400">{t(descriptionKey)}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
