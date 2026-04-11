"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import { encodeBase64, decodeBase64 } from "@/lib/base64";
import tools from "../tools.module.css";
import styles from "./Base64.module.css";

export default function Base64TranslatorClient() {
  const t = useTranslations("tools");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function handleEncode() {
    setError("");
    try {
      setOutput(encodeBase64(input));
    } catch {
      setError(t("base64.encodeError"));
    }
  }

  function handleDecode() {
    setError("");
    try {
      setInput(decodeBase64(output));
    } catch {
      setError(t("base64.decodeError"));
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <ToolLayout titleKey="base64.title" descriptionKey="base64.description">
      <div className={styles.grid}>
        <div className={tools.field}>
          <label className={tools.fieldLabel}>{t("input")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("base64.inputPlaceholder")}
            className={`${tools.textarea} ${tools.textareaXl}`}
          />
        </div>

        <div className={styles.actions}>
          <Button onClick={handleEncode} size="sm">
            {t("encode")} →
          </Button>
          <Button onClick={handleDecode} variant="secondary" size="sm">
            ← {t("decode")}
          </Button>
          <Button onClick={handleClear} variant="ghost" size="sm">
            {t("clear")}
          </Button>
        </div>

        <div className={tools.field}>
          <div className={tools.labelRow}>
            <label className={tools.fieldLabel}>{t("output")}</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder={t("base64.outputPlaceholder")}
            className={`${tools.textarea} ${tools.textareaXl}`}
          />
        </div>
      </div>

      {error && (
        <div className={styles.errorWrap}>
          <div className={tools.errorBox}>{error}</div>
        </div>
      )}
    </ToolLayout>
  );
}
