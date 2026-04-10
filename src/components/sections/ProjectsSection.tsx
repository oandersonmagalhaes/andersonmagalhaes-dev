"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { GithubLogo, ArrowSquareOut } from "@phosphor-icons/react";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { projects } from "@/data/projects";

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
    <section id="projects" className="py-20 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading title={t("title")} className="mb-12" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project) => (
            <motion.div key={project.name} variants={itemVariants}>
              <Card className="h-full flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-100 font-mono">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} GitHub`}
                        className="text-gray-400 hover:text-brand-orange transition-colors duration-200"
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
                        className="text-gray-400 hover:text-brand-emerald transition-colors duration-200"
                      >
                        <ArrowSquareOut size={20} weight="regular" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                  {locale === "en"
                    ? project.description.en
                    : project.description.ptBr}
                </p>

                <div className="flex flex-wrap gap-2">
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
