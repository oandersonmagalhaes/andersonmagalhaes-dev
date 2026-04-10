"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import tools from "../tools.module.css";
import styles from "./Password.module.css";

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

type CharsetKey = keyof typeof CHARSETS;
type StrengthLevel = 1 | 2 | 3 | 4;

function generatePassword(length: number, options: Record<CharsetKey, boolean>): string {
  let chars = "";
  for (const [key, enabled] of Object.entries(options)) {
    if (enabled) chars += CHARSETS[key as CharsetKey];
  }
  if (!chars) return "";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => chars[n % chars.length]).join("");
}

function getStrength(password: string, options: Record<CharsetKey, boolean>): {
  level: StrengthLevel;
  label: string;
} {
  const len = password.length;
  const enabledSets = Object.values(options).filter(Boolean).length;

  let score = 0;
  if (len >= 8) score++;
  if (len >= 12) score++;
  if (len >= 20) score++;
  if (len >= 32) score++;
  if (enabledSets >= 2) score++;
  if (enabledSets >= 3) score++;
  if (enabledSets >= 4) score++;

  if (score <= 2) return { level: 1, label: "weak" };
  if (score <= 4) return { level: 2, label: "medium" };
  if (score <= 5) return { level: 3, label: "strong" };
  return { level: 4, label: "veryStrong" };
}

const strengthBarClass: Record<StrengthLevel, string> = {
  1: styles.strengthBarWeak,
  2: styles.strengthBarMedium,
  3: styles.strengthBarStrong,
  4: styles.strengthBarVeryStrong,
};

export default function PasswordGeneratorClient() {
  const t = useTranslations("tools");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<Record<CharsetKey, boolean>>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    setPassword(generatePassword(length, options));
  }, [length, options]);

  // Auto-generate on mount and param change
  useEffect(() => {
    generate();
  }, [generate]);

  const strength = getStrength(password, options);
  const hasAnyOption = Object.values(options).some(Boolean);

  function toggleOption(key: CharsetKey) {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <ToolLayout
      titleKey="password.title"
      descriptionKey="password.description"
    >
      <div className={`${tools.panel} ${styles.displayPanel}`}>
        <div className={tools.fieldRow}>
          <span className={tools.fieldLabel}>{t("output")}</span>
          <CopyButton text={password} />
        </div>
        <div className={styles.passwordBox}>
          <p className={styles.password}>
            {password || (
              <span className={styles.passwordPlaceholder}>
                {t("password.noCharset")}
              </span>
            )}
          </p>
        </div>

        <div className={styles.strength}>
          <span className={styles.strengthLabel}>
            {t(`password.${strength.label}`)}
          </span>
          <div className={styles.strengthBars}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`${styles.strengthBar} ${
                  i <= strength.level
                    ? strengthBarClass[strength.level]
                    : ""
                }`}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={generate}
          className={tools.fullWidthBtn}
          disabled={!hasAnyOption}
        >
          {t("generate")}
        </Button>
      </div>

      <div className={tools.panel}>
        <div className={styles.lengthBlock}>
          <div className={styles.lengthRow}>
            <label className={tools.fieldLabel}>
              {t("password.length")}
            </label>
            <span className={styles.lengthValue}>{length}</span>
          </div>
          <input
            type="range"
            min={8}
            max={128}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className={styles.lengthSlider}
          />
          <div className={styles.lengthBounds}>
            <span>8</span>
            <span>128</span>
          </div>
        </div>

        <div className={styles.optionsGrid}>
          {(Object.keys(CHARSETS) as CharsetKey[]).map((key) => (
            <label key={key} className={styles.option}>
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => toggleOption(key)}
                className={styles.optionCheckbox}
              />
              <div>
                <span className={styles.optionLabel}>
                  {t(`password.${key}`)}
                </span>
                <span className={styles.optionHint}>
                  {CHARSETS[key].slice(0, 10)}...
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
