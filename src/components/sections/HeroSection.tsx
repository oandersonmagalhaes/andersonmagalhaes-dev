"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  MediumLogoIcon,
  ArrowDown,
} from "@phosphor-icons/react";
import Button from "@/components/ui/Button";
import styles from "./HeroSection.module.css";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/oandersonmagalhaes",
    Icon: GithubLogoIcon,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/andersonbmagalhaes/",
    Icon: LinkedinLogoIcon,
  },
  {
    name: "Medium",
    url: "https://oandersonbm.medium.com/",
    Icon: MediumLogoIcon,
  },
];

export default function HeroSection() {
  const t = useTranslations("hero");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className={styles.section}>
      <div className={styles.bg}>
        <div className={`${styles.blob} ${styles.blobOrange}`} />
        <div className={`${styles.blob} ${styles.blobEmerald}`} />
        {Array.from({ length: 6 }, (_, i) => `dot-${i}`).map((dotKey, i) => (
          <motion.div
            key={dotKey}
            className={styles.dot}
            style={{
              top: `${15 + i * 15}%`,
              left: `${10 + i * 14}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className={`container ${styles.content}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.greeting}>{t("greeting")}</p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={styles.name}
        >
          Anderson Magalhaes
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={styles.role}
        >
          {t("role")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className={styles.description}
        >
          {t("description")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={styles.socials}
        >
          {socialLinks.map(({ name, url, Icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className={styles.socialLink}
            >
              <Icon size={24} weight="regular" />
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className={styles.actions}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => scrollTo("projects")}
          >
            {t("cta.projects")}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => scrollTo("contact")}
          >
            {t("cta.contact")}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className={styles.scrollIndicator}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown
              size={20}
              className={styles.scrollIcon}
              onClick={() => scrollTo("about")}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
