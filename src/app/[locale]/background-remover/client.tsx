"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/layout/ToolLayout";
import Button from "@/components/ui/Button";
import { applyChromaKey, pixelColorAt, type RGB } from "@/lib/chromaKey";
import tools from "../tools.module.css";
import styles from "./BackgroundRemover.module.css";

function toHex({ r, g, b }: RGB): string {
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

export default function BackgroundRemoverClient() {
  const t = useTranslations("tools");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  // Pristine pixels of the loaded image; every preview re-derives from this.
  const originalRef = useRef<ImageData | null>(null);

  const [hasImage, setHasImage] = useState(false);
  const [fileName, setFileName] = useState("image");
  const [keyColor, setKeyColor] = useState<RGB | null>(null);
  const [tolerance, setTolerance] = useState(20);
  const [softness, setSoftness] = useState(10);
  const [despill, setDespill] = useState(true);

  // Render the preview from the pristine pixels, applying chroma key if a
  // color has been picked.
  const renderPreview = useCallback(() => {
    const original = originalRef.current;
    const canvas = displayCanvasRef.current;
    if (!original || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const copy = new ImageData(
      new Uint8ClampedArray(original.data),
      original.width,
      original.height,
    );
    if (keyColor) {
      applyChromaKey(copy.data, { keyColor, tolerance, softness, despill });
    }
    ctx.putImageData(copy, 0, 0);
  }, [keyColor, tolerance, softness, despill]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = displayCanvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      originalRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      setFileName(file.name.replace(/\.[^.]+$/, "") || "image");
      setKeyColor(null);
      setHasImage(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  // Eyedropper: map a click on the (CSS-scaled) canvas back to bitmap pixels.
  function onCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const original = originalRef.current;
    const canvas = displayCanvasRef.current;
    if (!original || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.min(
      canvas.width - 1,
      Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width)),
    );
    const y = Math.min(
      canvas.height - 1,
      Math.max(0, Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height)),
    );
    const index = y * canvas.width + x;
    setKeyColor(pixelColorAt(original.data, index));
  }

  function download() {
    const canvas = displayCanvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}-no-bg.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  function reset() {
    originalRef.current = null;
    setHasImage(false);
    setKeyColor(null);
    setTolerance(20);
    setSoftness(10);
    setDespill(true);
  }

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
          <button
            type="button"
            className={styles.uploadArea}
            onClick={() => fileInputRef.current?.click()}
          >
            {t("bgRemover.upload")}
          </button>
        )}

        <div
          className={styles.canvasWrap}
          style={{ display: hasImage ? "flex" : "none" }}
        >
          <canvas
            ref={displayCanvasRef}
            className={styles.canvas}
            onClick={onCanvasClick}
          />
        </div>

        {hasImage && (
          <>
            <p className={styles.hint}>{t("bgRemover.pickColorHint")}</p>

            <div className={tools.panel}>
              <div className={styles.swatchRow}>
                <span className={tools.fieldLabel}>
                  {t("bgRemover.selectedColor")}
                </span>
                {keyColor ? (
                  <span className={styles.swatchValue}>
                    <span
                      className={styles.swatch}
                      style={{ backgroundColor: toHex(keyColor) }}
                    />
                    {toHex(keyColor)}
                  </span>
                ) : (
                  <span className={styles.swatchValue}>
                    {t("bgRemover.noColor")}
                  </span>
                )}
              </div>

              <div className={styles.sliderBlock}>
                <div className={tools.labelRow}>
                  <label className={tools.fieldLabel}>
                    {t("bgRemover.tolerance")}
                  </label>
                  <span className={styles.sliderValue}>{tolerance}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={tolerance}
                  onChange={(e) => setTolerance(parseInt(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <div className={styles.sliderBlock}>
                <div className={tools.labelRow}>
                  <label className={tools.fieldLabel}>
                    {t("bgRemover.softness")}
                  </label>
                  <span className={styles.sliderValue}>{softness}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={softness}
                  onChange={(e) => setSoftness(parseInt(e.target.value))}
                  className={styles.slider}
                />
              </div>

              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={despill}
                  onChange={(e) => setDespill(e.target.checked)}
                />
                {t("bgRemover.despill")}
              </label>
            </div>

            <div className={tools.actionRow}>
              <Button onClick={download} disabled={!keyColor}>
                {t("bgRemover.download")}
              </Button>
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                {t("bgRemover.changeImage")}
              </Button>
              <Button variant="ghost" onClick={reset}>
                {t("bgRemover.reset")}
              </Button>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
