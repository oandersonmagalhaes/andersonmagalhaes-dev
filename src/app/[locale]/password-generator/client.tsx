"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

type CharsetKey = keyof typeof CHARSETS;

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
  level: number;
  label: string;
  color: string;
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

  if (score <= 2) return { level: 1, label: "weak", color: "bg-red-500" };
  if (score <= 4) return { level: 2, label: "medium", color: "bg-yellow-500" };
  if (score <= 5) return { level: 3, label: "strong", color: "bg-brand-emerald" };
  return { level: 4, label: "veryStrong", color: "bg-brand-orange" };
}

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
      {/* Password display */}
      <div className="bg-brand-card border border-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">
            {t("output")}
          </span>
          <CopyButton text={password} />
        </div>
        <div className="bg-brand-surface rounded-lg p-4 mb-4 select-all">
          <p className="font-mono text-lg md:text-xl text-gray-100 break-all text-center leading-relaxed">
            {password || (
              <span className="text-gray-600">{t("password.noCharset")}</span>
            )}
          </p>
        </div>

        {/* Strength indicator */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs text-gray-500 shrink-0">
            {t(`password.${strength.label}`)}
          </span>
          <div className="flex-1 flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= strength.level ? strength.color : "bg-gray-800"
                }`}
              />
            ))}
          </div>
        </div>

        <Button onClick={generate} className="w-full" disabled={!hasAnyOption}>
          {t("generate")}
        </Button>
      </div>

      {/* Options */}
      <div className="bg-brand-card border border-gray-800 rounded-lg p-6">
        {/* Length slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-400">
              {t("password.length")}
            </label>
            <span className="font-mono text-sm text-brand-orange">{length}</span>
          </div>
          <input
            type="range"
            min={8}
            max={128}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-brand-orange"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>8</span>
            <span>128</span>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(CHARSETS) as CharsetKey[]).map((key) => (
            <label
              key={key}
              className="flex items-center gap-3 p-3 rounded-lg bg-brand-surface border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => toggleOption(key)}
                className="w-4 h-4 accent-brand-orange rounded"
              />
              <div>
                <span className="text-sm text-gray-200">
                  {t(`password.${key}`)}
                </span>
                <span className="block text-xs text-gray-500 font-mono mt-0.5">
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
