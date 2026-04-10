"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { GithubLogo, ArrowSquareOut } from "@phosphor-icons/react";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { projects } from "@/data/projects";
import styles from "./ProjectsSection.module.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProjectsSection() {
  const t = useTranslations("projects");
  const locale = useLocale();

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading title={t("title")} />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={styles.grid}
        >
          {projects.map((project) => (
            <motion.div key={project.name} variants={itemVariants}>
              <Card className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.name}>{project.name}</h3>
                  <div className={styles.actions}>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} GitHub`}
                        className={styles.actionGithub}
                      >
                        <GithubLogo size={20} weight="regular" />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={
                          project.demo.startsWith("/")
                            ? `/${locale}${project.demo}/`
                            : project.demo
                        }
                        aria-label={`${project.name} Demo`}
                        className={styles.actionDemo}
                      >
                        <ArrowSquareOut size={20} weight="regular" />
                      </a>
                    )}
                  </div>
                </div>

                <p className={styles.description}>
                  {locale === "en"
                    ? project.description.en
                    : project.description.ptBr}
                </p>

                <div className={styles.tags}>
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="gray">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
