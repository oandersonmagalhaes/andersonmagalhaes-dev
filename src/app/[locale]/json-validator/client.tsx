"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";

interface ValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
}

function validateJson(input: string): ValidationResult {
  if (!input.trim()) return { valid: false };
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    const message = e instanceof SyntaxError ? e.message : "Invalid JSON";
    // Try to extract line number from error message
    const lineMatch = message.match(/position (\d+)/);
    let line: number | undefined;
    if (lineMatch) {
      const pos = parseInt(lineMatch[1]);
      line = input.slice(0, pos).split("\n").length;
    }
    return { valid: false, error: message, line };
  }
}

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
      {/* Status indicator */}
      {validation && (
        <div
          className={`mb-4 p-3 rounded-lg border text-sm font-mono ${
            validation.valid
              ? "bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {validation.valid
            ? t("jsonValidator.valid")
            : validation.error && (
                <>
                  {validation.line && (
                    <span className="text-red-300">
                      {t("jsonValidator.line")} {validation.line}:{" "}
                    </span>
                  )}
                  {validation.error}
                </>
              )}
        </div>
      )}

      {/* Input */}
      <div className="bg-brand-card border border-gray-800 rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-400">
            {t("input")}
          </label>
          <div className="flex items-center gap-2">
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
          className="w-full h-64 bg-brand-surface border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-100 placeholder:text-gray-600 resize-y focus:outline-none focus:border-brand-orange/50 transition-colors"
        />
      </div>

      {/* Output */}
      {output && (
        <div className="bg-brand-card border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-400">
              {t("output")}
            </label>
            <CopyButton text={output} />
          </div>
          <pre className="bg-brand-surface border border-gray-800 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
            <code className="font-mono text-sm text-brand-emerald whitespace-pre">
              {output}
            </code>
          </pre>
        </div>
      )}
    </ToolLayout>
  );
}
