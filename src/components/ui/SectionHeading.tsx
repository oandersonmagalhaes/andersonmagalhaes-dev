"use client";

import { motion } from "framer-motion";
import styles from "./SectionHeading.module.css";

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
      <h2 className={styles.heading}>
        <span className={styles.hash}>#</span> {title}
      </h2>
      <div className={styles.underline} />
    </motion.div>
  );
}
