"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { List, X, Wrench, CaretDown } from "@phosphor-icons/react";
import Link from "next/link";
import { cn } from "@/lib/cn";

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

  // Detect if we're on the home page (root of locale)
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Build nav anchor href: if on home, use #section; otherwise link to home with anchor
  const navHref = (section: string) =>
    isHome ? `#${section}` : `/${locale}/#${section}`;

  // Build language switch href: preserve current path, just swap locale
  const switchLocaleHref = () => {
    if (!pathname) return `/${otherLocale}/`;
    // Replace the leading /locale/ with /otherLocale/
    const newPath = pathname.replace(
      new RegExp(`^/${locale}(/|$)`),
      `/${otherLocale}/`
    );
    return newPath.endsWith("/") ? newPath : `${newPath}/`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-black/80 backdrop-blur-md border-b border-gray-800/50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}/`}
          className="font-mono text-lg font-bold text-brand-orange hover:text-brand-orange-light transition-colors"
        >
          {"<AM />"}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) =>
            isHome ? (
              <a
                key={item}
                href={navHref(item)}
                className={cn(
                  "text-sm transition-colors hover:text-brand-orange",
                  activeSection === item
                    ? "text-brand-orange"
                    : "text-gray-400"
                )}
              >
                {t(item)}
              </a>
            ) : (
              <Link
                key={item}
                href={navHref(item)}
                className="text-sm text-gray-400 hover:text-brand-orange transition-colors"
              >
                {t(item)}
              </Link>
            )
          )}

          {/* Tools dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              onBlur={() => setTimeout(() => setToolsOpen(false), 200)}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-brand-orange transition-colors cursor-pointer"
            >
              <Wrench size={16} />
              {t("tools")}
              <CaretDown
                size={12}
                className={cn(
                  "transition-transform",
                  toolsOpen && "rotate-180"
                )}
              />
            </button>
            {toolsOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-brand-card border border-gray-800 rounded-lg py-2 shadow-xl">
                {toolRoutes.map((tool) => (
                  <Link
                    key={tool.key}
                    href={`/${locale}${tool.href}/`}
                    className="block px-4 py-2 text-sm text-gray-400 hover:text-brand-orange hover:bg-brand-surface transition-colors"
                  >
                    {tTools(`${tool.key}.title`)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Language switcher */}
          <Link
            href={switchLocaleHref()}
            className="text-xs font-mono px-2 py-1 border border-gray-700 rounded text-gray-400 hover:text-brand-emerald hover:border-brand-emerald transition-colors"
          >
            {otherLocaleLabel}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-400 hover:text-brand-orange transition-colors cursor-pointer"
        >
          {mobileOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-card border-t border-gray-800">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item}
                href={navHref(item)}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block text-sm transition-colors",
                  isHome && activeSection === item
                    ? "text-brand-orange"
                    : "text-gray-400 hover:text-brand-orange"
                )}
              >
                {t(item)}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-800">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Wrench size={12} /> {t("tools")}
              </p>
              {toolRoutes.map((tool) => (
                <Link
                  key={tool.key}
                  href={`/${locale}${tool.href}/`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-1.5 text-sm text-gray-400 hover:text-brand-orange transition-colors"
                >
                  {tTools(`${tool.key}.title`)}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-800">
              <Link
                href={switchLocaleHref()}
                onClick={() => setMobileOpen(false)}
                className="text-xs font-mono text-gray-400 hover:text-brand-emerald"
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
