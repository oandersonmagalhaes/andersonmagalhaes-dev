"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";

export default function Base64TranslatorClient() {
  const t = useTranslations("tools");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function handleEncode() {
    setError("");
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch {
      setError(t("base64.encodeError"));
    }
  }

  function handleDecode() {
    setError("");
    try {
      const decoded = decodeURIComponent(escape(atob(output)));
      setInput(decoded);
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
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-400">
            {t("input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("base64.inputPlaceholder")}
            className="w-full h-56 bg-brand-card border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-100 placeholder:text-gray-600 resize-none focus:outline-none focus:border-brand-orange/50 transition-colors"
          />
        </div>

        {/* Action buttons */}
        <div className="flex md:flex-col items-center justify-center gap-2 py-2">
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

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">
              {t("output")}
            </label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder={t("base64.outputPlaceholder")}
            className="w-full h-56 bg-brand-card border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-100 placeholder:text-gray-600 resize-none focus:outline-none focus:border-brand-orange/50 transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-mono">
          {error}
        </div>
      )}
    </ToolLayout>
  );
}
