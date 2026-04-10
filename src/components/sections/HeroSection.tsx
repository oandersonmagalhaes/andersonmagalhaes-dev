"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  GithubLogo,
  LinkedinLogo,
  MediumLogo,
  ArrowDown,
} from "@phosphor-icons/react";
import Button from "@/components/ui/Button";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/oandersonmagalhaes",
    Icon: GithubLogo,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/andersonbmagalhaes/",
    Icon: LinkedinLogo,
  },
  {
    name: "Medium",
    url: "https://oandersonbm.medium.com/",
    Icon: MediumLogo,
  },
];

export default function HeroSection() {
  const t = useTranslations("hero");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-emerald/5 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        {/* Floating dots */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-brand-orange/30"
            style={{
              top: `${15 + i * 15}%`,
              left: `${10 + i * 14}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-brand-emerald font-mono text-sm sm:text-base mb-4">
            {t("greeting")}
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-mono font-bold text-brand-orange mb-4"
        >
          Anderson Magalhaes
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl sm:text-2xl lg:text-3xl font-sans font-semibold text-gray-100 mb-6"
        >
          {t("role")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("description")}
        </motion.p>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-5 mb-10"
        >
          {socialLinks.map(({ name, url, Icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="text-gray-400 hover:text-brand-orange transition-colors duration-200"
            >
              <Icon size={24} weight="regular" />
            </a>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => scrollTo("projects")}
          >
            {t("cta.projects")}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => scrollTo("contact")}
          >
            {t("cta.contact")}
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown
              size={20}
              className="text-gray-500 cursor-pointer"
              onClick={() => scrollTo("about")}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
