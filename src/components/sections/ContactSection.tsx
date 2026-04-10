"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  GithubLogo,
  LinkedinLogo,
  MediumLogo,
} from "@phosphor-icons/react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

const contactLinks = [
  {
    name: "GitHub",
    url: "https://github.com/oandersonmagalhaes",
    Icon: GithubLogo,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/andersonbmagalhaes/",
    Icon: LinkedinLogo,
  },
  {
    name: "Medium",
    url: "https://oandersonbm.medium.com/",
    Icon: MediumLogo,
  },
];

export default function ContactSection() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-20 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading title={t("title")} className="mb-12" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl"
        >
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-10">
            {t("description")}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4"
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
