"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import styles from "./AboutSection.module.css";

const highlights = [
  "Project Lead",
  "Fullstack",
  "Backend",
  "Infra & Quality",
  "SAST & DAST",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AboutSection() {
  const t = useTranslations("about");

  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading title={t("title")} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className={styles.bio}>{t("bio")}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={styles.highlights}
        >
          {highlights.map((label) => (
            <motion.div key={label} variants={itemVariants}>
              <Badge variant="emerald">{label}</Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
