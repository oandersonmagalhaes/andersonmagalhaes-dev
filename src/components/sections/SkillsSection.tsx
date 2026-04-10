"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { skillCategories } from "@/data/skills";

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
    <section id="skills" className="py-20 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading title={t("title")} className="mb-12" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-10"
        >
          {skillCategories.map((category, categoryIndex) => {
            const variant = categoryIndex % 2 === 0 ? "orange" : "emerald";

            return (
              <motion.div key={category.key} variants={groupVariants}>
                <h3 className="text-sm font-mono font-semibold text-gray-300 uppercase tracking-wider mb-4">
                  <span
                    className={
                      categoryIndex % 2 === 0
                        ? "text-brand-orange"
                        : "text-brand-emerald"
                    }
                  >
                    {"//"}
                  </span>{" "}
                  {t(`categories.${category.key}`)}
                </h3>

                <motion.div
                  variants={containerVariants}
                  className="flex flex-wrap gap-2"
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
