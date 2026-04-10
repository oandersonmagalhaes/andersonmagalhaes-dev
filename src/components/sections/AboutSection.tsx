"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";

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
    <section id="about" className="py-20 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading title={t("title")} className="mb-12" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-3xl mb-10">
            {t("bio")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap gap-3"
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
