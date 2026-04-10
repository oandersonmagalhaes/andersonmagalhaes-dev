"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { skillCategories } from "@/data/skills";
import styles from "./SkillsSection.module.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const groupVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function SkillsSection() {
  const t = useTranslations("skills");

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading title={t("title")} />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={styles.list}
        >
          {skillCategories.map((category, categoryIndex) => {
            const isOrange = categoryIndex % 2 === 0;
            const variant = isOrange ? "orange" : "emerald";
            const accentClass = isOrange
              ? styles.accentOrange
              : styles.accentEmerald;

            return (
              <motion.div key={category.key} variants={groupVariants}>
                <h3 className={styles.categoryLabel}>
                  <span className={accentClass}>{"//"}</span>{" "}
                  {t(`categories.${category.key}`)}
                </h3>

                <motion.div
                  variants={containerVariants}
                  className={styles.chips}
                >
                  {category.skills.map((skill) => (
                    <motion.div key={skill} variants={chipVariants}>
                      <Badge variant={variant}>{skill}</Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
