"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { decodeJwt, decodeProtectedHeader } from "jose";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";

interface DecodedToken {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function getSignatureHex(token: string): string {
  const parts = token.split(".");
  if (parts.length !== 3) return "";
  const sig = parts[2];
  // base64url to hex
  const raw = atob(sig.replace(/-/g, "+").replace(/_/g, "/"));
  return Array.from(raw)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

function formatExpiration(exp: number): {
  expired: boolean;
  label: string;
} {
  const now = Math.floor(Date.now() / 1000);
  const diff = exp - now;
  const expired = diff < 0;
  const absDiff = Math.abs(diff);

  const days = Math.floor(absDiff / 86400);
  const hours = Math.floor((absDiff % 86400) / 3600);
  const minutes = Math.floor((absDiff % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (parts.length === 0) parts.push("< 1m");

  const timeStr = parts.join(" ");
  const label = expired ? `Expired ${timeStr} ago` : `Expires in ${timeStr}`;

  return { expired, label };
}

function CollapsibleSection({
  title,
  defaultOpen = true,
  color,
  children,
  copyText,
}: {
  title: string;
  defaultOpen?: boolean;
  color: string;
  children: React.ReactNode;
  copyText?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-brand-surface hover:bg-brand-surface/80 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {open ? (
            <CaretDown size={16} className="text-gray-400" />
          ) : (
            <CaretRight size={16} className="text-gray-400" />
          )}
          <span className={`text-sm font-medium ${color}`}>{title}</span>
        </div>
        {copyText && open && <CopyButton text={copyText} />}
      </button>
      {open && (
        <div className="p-4 bg-brand-card border-t border-gray-800">
          {children}
        </div>
      )}
    </div>
  );
}

export default function JwtValidatorClient() {
  const t = useTranslations("tools");
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [error, setError] = useState("");

  function handleDecode() {
    setError("");
    setDecoded(null);

    const token = input.trim();
    if (!token) return;

    try {
      const header = decodeProtectedHeader(token) as Record<string, unknown>;
      const payload = decodeJwt(token) as Record<string, unknown>;
      const signature = getSignatureHex(token);

      setDecoded({ header, payload, signature });
    } catch {
      setError(t("jwt.invalidToken"));
    }
  }

  function handleClear() {
    setInput("");
    setDecoded(null);
    setError("");
  }

  const expClaim =
    decoded?.payload?.exp !== undefined
      ? Number(decoded.payload.exp)
      : null;
  const expInfo = expClaim ? formatExpiration(expClaim) : null;

  return (
    <ToolLayout titleKey="jwt.title" descriptionKey="jwt.description">
      <div className="space-y-6">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-400">
            {t("input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("jwt.inputPlaceholder")}
            className="w-full h-40 bg-brand-card border border-gray-800 rounded-lg p-4 font-mono text-sm text-gray-100 placeholder:text-gray-600 resize-none focus:outline-none focus:border-brand-orange/50 transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button onClick={handleDecode}>{t("jwt.decode")}</Button>
          <Button onClick={handleClear} variant="ghost">
            {t("clear")}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-mono">
            {error}
          </div>
        )}

        {/* Expiration info */}
        {expInfo && (
          <div
            className={`p-3 rounded-lg border text-sm font-mono ${
              expInfo.expired
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald"
            }`}
          >
            <span className="font-medium">
              {expInfo.expired ? "⏱ " : "⏱ "}
            </span>
            {expInfo.label}
            <span className="text-gray-500 ml-2">
              ({new Date(expClaim! * 1000).toLocaleString()})
            </span>
          </div>
        )}

        {/* Decoded sections */}
        {decoded && (
          <div className="space-y-3">
            <CollapsibleSection
              title="Header"
              color="text-brand-orange"
              copyText={JSON.stringify(decoded.header, null, 2)}
            >
              <pre className="font-mono text-sm text-brand-orange whitespace-pre-wrap break-all">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </CollapsibleSection>

            <CollapsibleSection
              title="Payload"
              color="text-brand-emerald"
              copyText={JSON.stringify(decoded.payload, null, 2)}
            >
              <pre className="font-mono text-sm text-brand-emerald whitespace-pre-wrap break-all">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </CollapsibleSection>

            <CollapsibleSection
              title="Signature"
              color="text-purple-400"
              defaultOpen={false}
            >
              <pre className="font-mono text-xs text-purple-400 whitespace-pre-wrap break-all">
                {decoded.signature}
              </pre>
            </CollapsibleSection>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
