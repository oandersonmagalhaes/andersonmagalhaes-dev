"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  className?: string;
}

export default function SectionHeading({ title, className }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <h2 className="text-3xl sm:text-4xl font-mono font-bold text-gray-100 mb-2">
        <span className="text-brand-orange">#</span> {title}
      </h2>
      <div className="w-16 h-1 bg-brand-emerald rounded-full" />
    </motion.div>
  );
}
