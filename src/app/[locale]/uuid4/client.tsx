"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";

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
      {/* Single UUID */}
      <div className="bg-brand-card border border-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-400">UUID v4</span>
          <CopyButton text={uuid} />
        </div>
        <div className="bg-brand-surface rounded-lg p-4 mb-4 select-all">
          <p className="font-mono text-xl md:text-2xl text-brand-orange break-all text-center">
            {uuid}
          </p>
        </div>
        <Button onClick={generateSingle} className="w-full">
          {t("generate")}
        </Button>
      </div>

      {/* Bulk generation */}
      <div className="bg-brand-card border border-gray-800 rounded-lg p-6">
        <h2 className="text-sm font-medium text-gray-400 mb-4">
          {t("uuid4.bulkGenerate")}
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm text-gray-400">{t("uuid4.count")}</label>
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
            className="w-20 bg-brand-surface border border-gray-800 rounded-lg px-3 py-1.5 font-mono text-sm text-gray-100 focus:outline-none focus:border-brand-orange/50 transition-colors"
          />
          <Button onClick={generateBulk} variant="secondary" size="sm">
            {t("generate")}
          </Button>
        </div>

        {bulkUuids.length > 0 && (
          <div className="bg-brand-surface rounded-lg border border-gray-800 max-h-80 overflow-y-auto">
            {bulkUuids.map((id, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-2 border-b border-gray-800/50 last:border-b-0 hover:bg-brand-card/50 transition-colors"
              >
                <span className="font-mono text-sm text-gray-300 break-all">
                  {id}
                </span>
                <CopyButton text={id} className="shrink-0 ml-3" />
              </div>
            ))}
          </div>
        )}

        {bulkUuids.length > 0 && (
          <div className="mt-3 flex justify-end">
            <CopyButton text={bulkUuids.join("\n")} className="text-xs" />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
