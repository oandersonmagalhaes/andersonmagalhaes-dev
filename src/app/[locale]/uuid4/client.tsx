"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import tools from "../tools.module.css";
import styles from "./Uuid4.module.css";

export default function Uuid4Client() {
  const t = useTranslations("tools");
  const [uuid, setUuid] = useState("");
  const [bulkCount, setBulkCount] = useState(5);
  const [bulkUuids, setBulkUuids] = useState<string[]>([]);

  const generateSingle = useCallback(() => {
    setUuid(crypto.randomUUID());
  }, []);

  // Generate initial UUID after mount to avoid hydration mismatch
  useEffect(() => {
    generateSingle();
  }, [generateSingle]);

  const generateBulk = useCallback(() => {
    const uuids = Array.from({ length: bulkCount }, () =>
      crypto.randomUUID()
    );
    setBulkUuids(uuids);
  }, [bulkCount]);

  return (
    <ToolLayout titleKey="uuid4.title" descriptionKey="uuid4.description">
      <div className={`${tools.panel} ${styles.singlePanel}`}>
        <div className={tools.fieldRow}>
          <span className={tools.fieldLabel}>UUID v4</span>
          <CopyButton text={uuid} />
        </div>
        <div className={styles.display}>
          <p className={styles.value}>{uuid}</p>
        </div>
        <Button onClick={generateSingle} className={tools.fullWidthBtn}>
          {t("generate")}
        </Button>
      </div>

      <div className={tools.panel}>
        <h2 className={styles.bulkLabel}>{t("uuid4.bulkGenerate")}</h2>
        <div className={styles.bulkRow}>
          <label className={styles.countLabel}>{t("uuid4.count")}</label>
          <input
            type="number"
            min={1}
            max={100}
            value={bulkCount}
            onChange={(e) =>
              setBulkCount(
                Math.min(100, Math.max(1, parseInt(e.target.value) || 1))
              )
            }
            className={styles.countInput}
          />
          <Button onClick={generateBulk} variant="secondary" size="sm">
            {t("generate")}
          </Button>
        </div>

        {bulkUuids.length > 0 && (
          <div className={styles.bulkList}>
            {bulkUuids.map((id) => (
              <div key={id} className={styles.bulkItem}>
                <span className={styles.bulkValue}>{id}</span>
                <CopyButton text={id} className={styles.bulkItemCopy} />
              </div>
            ))}
          </div>
        )}

        {bulkUuids.length > 0 && (
          <div className={styles.bulkFooter}>
            <CopyButton text={bulkUuids.join("\n")} />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
