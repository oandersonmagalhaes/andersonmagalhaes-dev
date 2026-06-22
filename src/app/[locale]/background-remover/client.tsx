"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import {
  removeImageBackground,
  type ProgressStage,
} from "@/lib/removeBackground";
import tools from "../tools.module.css";
import styles from "./BackgroundRemover.module.css";

type Status = "idle" | "processing" | "done" | "error";

export default function BackgroundRemoverClient() {
  const t = useTranslations("tools");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("image");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<ProgressStage | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Track object URLs so we can revoke them on replace/unmount.
  const urlsRef = useRef<string[]>([]);
  const trackUrl = (url: string) => {
    urlsRef.current.push(url);
    return url;
  };
  const revokeAll = () => {
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    urlsRef.current = [];
  };
  useEffect(() => revokeAll, []);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError(t("bgRemover.errorInvalidFile"));
        setStatus("error");
        return;
      }
      revokeAll();
      setError(null);
      setCutoutUrl(null);
      setFileName(file.name.replace(/\.[^.]+$/, "") || "image");
      setOriginalUrl(trackUrl(URL.createObjectURL(file)));
      setStatus("processing");
      setProgress(0);
      setStage("loadingModel");

      try {
        const blob = await removeImageBackground(file, (ratio, s) => {
          setProgress(Math.round(ratio * 100));
          setStage(s);
        });
        setCutoutUrl(trackUrl(URL.createObjectURL(blob)));
        setStatus("done");
      } catch (err) {
        console.error("Background removal failed:", err);
        setError(t("bgRemover.errorGeneric"));
        setStatus("error");
      }
    },
    [t],
  );

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function download() {
    if (!cutoutUrl) return;
    const a = document.createElement("a");
    a.href = cutoutUrl;
    a.download = `${fileName}-no-bg.png`;
    a.click();
  }

  function reset() {
    revokeAll();
    setOriginalUrl(null);
    setCutoutUrl(null);
    setStatus("idle");
    setProgress(0);
    setStage(null);
    setError(null);
  }

  const hasImage = status !== "idle";
  const previewUrl = cutoutUrl ?? originalUrl;

  return (
    <ToolLayout titleKey="bgRemover.title" descriptionKey="bgRemover.description">
      <div className={tools.stack}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className={styles.hiddenInput}
        />

        {!hasImage && (
          <>
            <button
              type="button"
              className={styles.uploadArea}
              onClick={() => fileInputRef.current?.click()}
            >
              {t("bgRemover.upload")}
            </button>
            <p className={styles.hint}>{t("bgRemover.dropHint")}</p>
          </>
        )}

        {hasImage && previewUrl && (
          <div className={styles.canvasWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="" className={styles.image} />
          </div>
        )}

        {status === "processing" && (
          <div className={styles.progressBlock}>
            <div className={styles.progressLabel}>
              <span>{stage ? t(`bgRemover.${stage}`) : ""}</span>
              <span>{progress}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === "error" && error && (
          <div className={tools.errorBox}>{error}</div>
        )}

        {hasImage && (
          <div className={tools.actionRow}>
            <Button onClick={download} disabled={status !== "done"}>
              {t("bgRemover.download")}
            </Button>
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              {t("bgRemover.changeImage")}
            </Button>
            <Button variant="ghost" onClick={reset}>
              {t("bgRemover.reset")}
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
