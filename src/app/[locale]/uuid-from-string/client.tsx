"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import CopyButton from "@/components/ui/CopyButton";
import { NAMESPACES, generateUuidV5 } from "@/lib/uuid";
import tools from "../tools.module.css";
import styles from "./UuidFromString.module.css";

export default function UuidFromStringClient() {
  const t = useTranslations("tools");
  const [input, setInput] = useState("");
  const [namespace, setNamespace] = useState("DNS");
  const [uuid, setUuid] = useState("");

  const generate = useCallback(async () => {
    if (!input.trim()) {
      setUuid("");
      return;
    }
    try {
      const result = await generateUuidV5(input, NAMESPACES[namespace]);
      setUuid(result);
    } catch {
      setUuid("");
    }
  }, [input, namespace]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <ToolLayout
      titleKey="uuidFromString.title"
      descriptionKey="uuidFromString.description"
    >
      <div className={tools.stack}>
        <div className={tools.field}>
          <label className={tools.fieldLabel}>{t("input")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("uuidFromString.inputPlaceholder")}
            className={`${tools.textarea} ${tools.textareaSm}`}
          />
        </div>

        <div className={tools.field}>
          <label className={tools.fieldLabel}>
            {t("uuidFromString.namespace")}
          </label>
          <select
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            className={`${tools.select} ${styles.namespaceSelect}`}
          >
            {Object.keys(NAMESPACES).map((ns) => (
              <option key={ns} value={ns}>
                {ns}
              </option>
            ))}
          </select>
        </div>

        <div className={tools.field}>
          <div className={tools.labelRow}>
            <label className={tools.fieldLabel}>{t("output")}</label>
            {uuid && <CopyButton text={uuid} />}
          </div>
          <div className={styles.outputBox}>
            {uuid ? (
              <span className={styles.outputValue}>{uuid}</span>
            ) : (
              <span className={styles.outputEmpty}>
                {t("uuidFromString.emptyState")}
              </span>
            )}
          </div>
        </div>

        <div className={styles.refPanel}>
          <p className={styles.refLabel}>{t("uuidFromString.namespaceRef")}</p>
          <div className={styles.refList}>
            {Object.entries(NAMESPACES).map(([key, value]) => (
              <div key={key} className={styles.refItem}>
                <span className={styles.refKey}>{key}</span>
                <span className={styles.refValue}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
