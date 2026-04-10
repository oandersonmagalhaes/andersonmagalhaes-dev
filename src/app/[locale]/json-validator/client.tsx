"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import { validateJson, type ValidationResult } from "@/lib/json-validate";
import tools from "../tools.module.css";
import styles from "./Json.module.css";

export default function JsonValidatorClient() {
  const t = useTranslations("tools");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    if (value.trim()) {
      setValidation(validateJson(value));
    } else {
      setValidation(null);
      setOutput("");
    }
  }, []);

  function handleFormat() {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setInput(formatted);
      setOutput(formatted);
      setValidation({ valid: true });
    } catch {
      setValidation(validateJson(input));
    }
  }

  function handleMinify() {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      setOutput(minified);
      setValidation({ valid: true });
    } catch {
      setValidation(validateJson(input));
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setValidation(null);
  }

  return (
    <ToolLayout
      titleKey="jsonValidator.title"
      descriptionKey="jsonValidator.description"
    >
      {validation && (
        <div
          className={`${styles.statusBox} ${
            validation.valid ? styles.statusValid : styles.statusInvalid
          }`}
        >
          {validation.valid
            ? t("jsonValidator.valid")
            : validation.error && (
                <>
                  {validation.line && (
                    <span className={styles.statusLine}>
                      {t("jsonValidator.line")} {validation.line}:{" "}
                    </span>
                  )}
                  {validation.error}
                </>
              )}
        </div>
      )}

      <div className={`${tools.panel} ${styles.inputPanel}`}>
        <div className={tools.fieldRow}>
          <label className={tools.fieldLabel}>{t("input")}</label>
          <div className={tools.actionRowEnd}>
            <Button onClick={handleFormat} size="sm">
              {t("format")}
            </Button>
            <Button onClick={handleMinify} variant="secondary" size="sm">
              {t("minify")}
            </Button>
            <Button onClick={handleClear} variant="ghost" size="sm">
              {t("clear")}
            </Button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={t("jsonValidator.inputPlaceholder")}
          spellCheck={false}
          className={`${tools.textarea} ${tools.textareaInset} ${tools.textareaResizeY} ${tools.textareaHuge}`}
        />
      </div>

      {output && (
        <div className={tools.panel}>
          <div className={tools.fieldRow}>
            <label className={tools.fieldLabel}>{t("output")}</label>
            <CopyButton text={output} />
          </div>
          <pre className={styles.codeBlock}>
            <code className={styles.code}>{output}</code>
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
