"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { experiences } from "@/data/experience";

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
    <section id="experience" className="py-20 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading title={t("title")} className="mb-12" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-brand-emerald/30 sm:left-[11px]" />

          <div className="space-y-10">
            {experiences.map((exp) => (
              <motion.div
                key={`${exp.company}-${exp.period}`}
                variants={itemVariants}
                className="relative pl-8 sm:pl-10"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2.5 w-[15px] h-[15px] sm:w-[23px] sm:h-[23px] sm:left-0 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-brand-orange bg-brand-black sm:w-[18px] sm:h-[18px]" />
                </div>

                <Card>
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-100">
                      {locale === "en" ? exp.role.en : exp.role.ptBr}
                    </h3>
                    <p className="text-brand-orange font-mono text-sm">
                      {exp.company}
                    </p>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {locale === "en"
                      ? exp.description.en
                      : exp.description.ptBr}
                  </p>

                  <div className="flex flex-wrap gap-2">
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
