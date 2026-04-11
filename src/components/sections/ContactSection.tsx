"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  GithubLogoIcon,
  LinkedinLogoIcon,
  MediumLogoIcon,
} from "@phosphor-icons/react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import styles from "./ContactSection.module.css";

const contactLinks = [
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

export default function ContactSection() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeading title={t("title")} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles.wrapper}
        >
          <p className={styles.description}>{t("description")}</p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={styles.actions}
          >
            {contactLinks.map(({ name, url, Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="lg">
                  <Icon size={22} weight="regular" />
                  {name}
                </Button>
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
