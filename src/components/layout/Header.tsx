"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { List, X, Wrench, CaretDown } from "@phosphor-icons/react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import styles from "./Header.module.css";

const navItems = ["about", "experience", "projects", "skills", "contact"] as const;

const toolRoutes = [
  { key: "base64", href: "/base64-translator" },
  { key: "uuid4", href: "/uuid4" },
  { key: "uuidFromString", href: "/uuid-from-string" },
  { key: "password", href: "/password-generator" },
  { key: "crontab", href: "/easy-crontab" },
  { key: "jwt", href: "/jwt-validator" },
  { key: "json", href: "/json-validator" },
  { key: "textCompare", href: "/text-compare" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const tTools = useTranslations("tools");
  const locale = useLocale();
  const pathname = usePathname();
  const activeSection = useActiveSection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const otherLocale = locale === "en" ? "br" : "en";
  const otherLocaleLabel = locale === "en" ? "BR" : "EN";

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const navHref = (section: string) =>
    isHome ? `#${section}` : `/${locale}/#${section}`;

  const switchLocaleHref = () => {
    if (!pathname) return `/${otherLocale}/`;
    const newPath = pathname.replace(
      new RegExp(`^/${locale}(/|$)`),
      `/${otherLocale}/`
    );
    return newPath.endsWith("/") ? newPath : `${newPath}/`;
  };

  return (
    <header className={styles.header}>
      <nav className={`container ${styles.nav}`}>
        <Link href={`/${locale}/`} className={styles.logo}>
          {"<AM />"}
        </Link>

        <div className={styles.desktopNav}>
          {navItems.map((item) =>
            isHome ? (
              <a
                key={item}
                href={navHref(item)}
                className={cn(
                  styles.navLink,
                  activeSection === item && styles.navLinkActive
                )}
              >
                {t(item)}
              </a>
            ) : (
              <Link key={item} href={navHref(item)} className={styles.navLink}>
                {t(item)}
              </Link>
            )
          )}

          <div className={styles.toolsWrapper}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              onBlur={() => setTimeout(() => setToolsOpen(false), 200)}
              className={styles.toolsTrigger}
            >
              <Wrench size={16} />
              {t("tools")}
              <CaretDown
                size={12}
                className={cn(styles.caret, toolsOpen && styles.caretOpen)}
              />
            </button>
            {toolsOpen && (
              <div className={styles.toolsMenu}>
                {toolRoutes.map((tool) => (
                  <Link
                    key={tool.key}
                    href={`/${locale}${tool.href}/`}
                    className={styles.toolItem}
                  >
                    {tTools(`${tool.key}.title`)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href={switchLocaleHref()} className={styles.langSwitch}>
            {otherLocaleLabel}
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={styles.mobileToggle}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileInner}>
            {navItems.map((item) => (
              <Link
                key={item}
                href={navHref(item)}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  styles.navLink,
                  isHome && activeSection === item && styles.navLinkActive
                )}
              >
                {t(item)}
              </Link>
            ))}
            <div className={styles.mobileGroup}>
              <p className={styles.mobileGroupLabel}>
                <Wrench size={12} /> {t("tools")}
              </p>
              {toolRoutes.map((tool) => (
                <Link
                  key={tool.key}
                  href={`/${locale}${tool.href}/`}
                  onClick={() => setMobileOpen(false)}
                  className={styles.mobileToolItem}
                >
                  {tTools(`${tool.key}.title`)}
                </Link>
              ))}
            </div>
            <div className={styles.mobileGroup}>
              <Link
                href={switchLocaleHref()}
                onClick={() => setMobileOpen(false)}
                className={styles.mobileLangLink}
              >
                {otherLocaleLabel === "BR"
                  ? "Mudar para Português"
                  : "Switch to English"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
