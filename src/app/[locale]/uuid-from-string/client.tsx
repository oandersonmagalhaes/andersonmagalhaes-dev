"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import CopyButton from "@/components/ui/CopyButton";

const NAMESPACES: Record<string, string> = {
  DNS: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  URL: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
  OID: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
  X500: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
};

function uuidToBytes(uuid: string): Uint8Array {
  const hex = uuid.replace(/-/g, "");
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToUuid(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

async function generateUuidV5(
  name: string,
  namespaceUuid: string
): Promise<string> {
  const namespaceBytes = uuidToBytes(namespaceUuid);
  const encoder = new TextEncoder();
  const nameBytes = encoder.encode(name);

  const data = new Uint8Array(namespaceBytes.length + nameBytes.length);
  data.set(namespaceBytes);
  data.set(nameBytes, namespaceBytes.length);

  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashBytes = new Uint8Array(hashBuffer);

  // Set version 5
  hashBytes[6] = (hashBytes[6] & 0x0f) | 0x50;
  // Set variant RFC4122
  hashBytes[8] = (hashBytes[8] & 0x3f) | 0x80;

  return bytesToUuid(hashBytes.slice(0, 16));
}

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
      <div className="space-y-6">
        {/* Source string input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-400">
            {t("input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("uuidFromString.inputPlaceholder")}
            className="w-full h-32 bg-brand-card border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-100 placeholder:text-gray-600 resize-none focus:outline-none focus:border-brand-orange/50 transition-colors"
          />
        </div>

        {/* Namespace selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-400">
            {t("uuidFromString.namespace")}
          </label>
          <select
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            className="w-full sm:w-64 bg-brand-card border border-gray-800 rounded-lg px-4 py-2.5 font-mono text-sm text-gray-100 focus:outline-none focus:border-brand-orange/50 transition-colors appearance-none cursor-pointer"
          >
            {Object.keys(NAMESPACES).map((ns) => (
              <option key={ns} value={ns}>
                {ns}
              </option>
            ))}
          </select>
        </div>

        {/* Generated UUID */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">
              {t("output")}
            </label>
            {uuid && <CopyButton text={uuid} />}
          </div>
          <div className="bg-brand-card border border-gray-800 rounded-lg p-4 min-h-[3.5rem] flex items-center">
            {uuid ? (
              <span className="font-mono text-lg text-brand-emerald select-all break-all">
                {uuid}
              </span>
            ) : (
              <span className="font-mono text-sm text-gray-600">
                {t("uuidFromString.emptyState")}
              </span>
            )}
          </div>
        </div>

        {/* Namespace reference */}
        <div className="bg-brand-surface border border-gray-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">
            {t("uuidFromString.namespaceRef")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {Object.entries(NAMESPACES).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 text-xs">
                <span className="text-gray-400 font-medium w-10">{key}</span>
                <span className="font-mono text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
