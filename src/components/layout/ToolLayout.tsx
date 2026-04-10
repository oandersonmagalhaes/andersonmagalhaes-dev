"use client";

import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import styles from "./ToolLayout.module.css";

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
    <div className={styles.shell}>
      <div className="container-tool">
        <Link href={`/${locale}/`} className={styles.backLink}>
          <ArrowLeft size={16} />
          {t("back")}
        </Link>

        <div className={styles.headingBlock}>
          <h1 className={styles.title}>{t(titleKey)}</h1>
          <p className={styles.description}>{t(descriptionKey)}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
