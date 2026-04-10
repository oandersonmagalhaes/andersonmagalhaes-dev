"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { decodeJwt, decodeProtectedHeader } from "jose";
import { CaretDown, CaretRight } from "@phosphor-icons/react";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import CopyButton from "@/components/ui/CopyButton";
import tools from "../tools.module.css";
import styles from "./Jwt.module.css";

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
  titleClass,
  children,
  copyText,
}: {
  title: string;
  defaultOpen?: boolean;
  titleClass: string;
  children: React.ReactNode;
  copyText?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.collapsible}>
      <button
        onClick={() => setOpen(!open)}
        className={styles.collapsibleTrigger}
      >
        <div className={styles.collapsibleHeading}>
          {open ? (
            <CaretDown size={16} color="var(--color-text-muted)" />
          ) : (
            <CaretRight size={16} color="var(--color-text-muted)" />
          )}
          <span className={`${styles.collapsibleTitle} ${titleClass}`}>
            {title}
          </span>
        </div>
        {copyText && open && <CopyButton text={copyText} />}
      </button>
      {open && <div className={styles.collapsibleBody}>{children}</div>}
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
      <div className={tools.stack}>
        <div className={tools.field}>
          <label className={tools.fieldLabel}>{t("input")}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("jwt.inputPlaceholder")}
            className={`${tools.textarea} ${tools.textareaMd}`}
          />
        </div>

        <div className={tools.actionRow}>
          <Button onClick={handleDecode}>{t("jwt.decode")}</Button>
          <Button onClick={handleClear} variant="ghost">
            {t("clear")}
          </Button>
        </div>

        {error && <div className={tools.errorBox}>{error}</div>}

        {expInfo && (
          <div
            className={`${styles.expBox} ${
              expInfo.expired ? styles.expExpired : styles.expValid
            }`}
          >
            <span className={styles.expIcon}>⏱ </span>
            {expInfo.label}
            <span className={styles.expDate}>
              ({new Date(expClaim! * 1000).toLocaleString()})
            </span>
          </div>
        )}

        {decoded && (
          <div className={styles.sections}>
            <CollapsibleSection
              title="Header"
              titleClass={styles.titleOrange}
              copyText={JSON.stringify(decoded.header, null, 2)}
            >
              <pre className={`${styles.pre} ${styles.preOrange}`}>
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </CollapsibleSection>

            <CollapsibleSection
              title="Payload"
              titleClass={styles.titleEmerald}
              copyText={JSON.stringify(decoded.payload, null, 2)}
            >
              <pre className={`${styles.pre} ${styles.preEmerald}`}>
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </CollapsibleSection>

            <CollapsibleSection
              title="Signature"
              titleClass={styles.titlePurple}
              defaultOpen={false}
            >
              <pre className={`${styles.pre} ${styles.preXs} ${styles.prePurple}`}>
                {decoded.signature}
              </pre>
            </CollapsibleSection>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
