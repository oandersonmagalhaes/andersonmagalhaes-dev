"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { experiences } from "@/data/experience";
import styles from "./ExperienceSection.module.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function ExperienceSection() {
  const t = useTranslations("experience");
  const locale = useLocale();

  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeading title={t("title")} />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={styles.timeline}
        >
          <div className={styles.rail} />

          <div className={styles.list}>
            {experiences.map((exp) => (
              <motion.div
                key={`${exp.company}-${exp.period}`}
                variants={itemVariants}
                className={styles.item}
              >
                <div className={styles.dotWrapper}>
                  <div className={styles.dot} />
                </div>

                <Card>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.role}>
                      {locale === "en" ? exp.role.en : exp.role.ptBr}
                    </h3>
                    <p className={styles.company}>{exp.company}</p>
                  </div>

                  <p className={styles.description}>
                    {locale === "en"
                      ? exp.description.en
                      : exp.description.ptBr}
                  </p>

                  <div className={styles.tags}>
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="gray">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
