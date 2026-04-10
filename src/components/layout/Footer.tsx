"use client";

import { useTranslations } from "next-intl";
import { GithubLogo, LinkedinLogo, MediumLogo } from "@phosphor-icons/react";
import { socialLinks } from "@/data/social";
import styles from "./Footer.module.css";

const iconMap = {
  GithubLogo,
  LinkedinLogo,
  MediumLogo,
} as const;

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} Anderson Magalhaes. {t("rights")}
        </p>

        <div className={styles.socials}>
          {socialLinks.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={link.name}
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>

        <p className={styles.tagline}>{t("built")}</p>
      </div>
    </footer>
  );
}
