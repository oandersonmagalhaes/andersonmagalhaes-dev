"use client";

import { useTranslations } from "next-intl";
import { GithubLogo, LinkedinLogo, MediumLogo } from "@phosphor-icons/react";
import { socialLinks } from "@/data/social";

const iconMap = {
  GithubLogo,
  LinkedinLogo,
  MediumLogo,
} as const;

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-gray-800/50 bg-brand-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Anderson Magalhaes. {t("rights")}
        </p>

        <div className="flex items-center gap-4">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-brand-orange transition-colors"
                aria-label={link.name}
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>

        <p className="text-xs text-gray-600">
          {t("built")}
        </p>
      </div>
    </footer>
  );
}
