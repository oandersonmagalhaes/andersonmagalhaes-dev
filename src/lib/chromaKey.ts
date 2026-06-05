export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ChromaKeyOptions {
  /** Background color to remove (0-255 per channel). */
  keyColor: RGB;
  /** 0-100. How far a pixel may be from keyColor and still count as background. */
  tolerance: number;
  /** 0-100. Width of the soft edge band where alpha is interpolated; 0 = hard cut. */
  softness: number;
  /** Remove residual key-color tint from partially transparent pixels. */
  despill: boolean;
}

/** Maximum possible Euclidean distance in RGB space (~441.67). */
const MAX_DISTANCE = Math.sqrt(3 * 255 * 255);

function clamp255(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

/** Euclidean RGB distance between two colors. */
export function colorDistance(a: RGB, b: RGB): number {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/** Read the RGB color of pixel `index` (0-based) from RGBA pixel data. */
export function pixelColorAt(data: Uint8ClampedArray, index: number): RGB {
  const i = index * 4;
  return { r: data[i], g: data[i + 1], b: data[i + 2] };
}

/**
 * Remove a solid background color from RGBA pixel data, mutating it in place.
 *
 * Pixels within `inner` distance of keyColor become fully transparent; pixels
 * beyond `outer` keep their original alpha; in between, alpha is interpolated
 * (feather). When `despill` is on, partially-removed pixels have the key color
 * un-blended from their RGB (background decontamination):
 *   observed = a*F + (1-a)*K  ->  F = (observed - (1-a)*K) / a
 */
export function applyChromaKey(
  data: Uint8ClampedArray,
  { keyColor, tolerance, softness, despill }: ChromaKeyOptions,
): void {
  const tol = (tolerance / 100) * MAX_DISTANCE;
  const band = (softness / 100) * MAX_DISTANCE;
  const inner = Math.max(0, tol - band / 2);
  const outer = tol + band / 2;

  for (let i = 0; i < data.length; i += 4) {
    const px: RGB = { r: data[i], g: data[i + 1], b: data[i + 2] };
    const d = colorDistance(px, keyColor);

    // alphaFactor: 1 = keep fully, 0 = fully removed.
    let alphaFactor: number;
    if (d <= inner) {
      alphaFactor = 0;
    } else if (d >= outer || outer <= inner) {
      alphaFactor = 1;
    } else {
      alphaFactor = (d - inner) / (outer - inner);
    }

    if (alphaFactor >= 1) continue;

    if (despill && alphaFactor > 0) {
      data[i] = clamp255((px.r - (1 - alphaFactor) * keyColor.r) / alphaFactor);
      data[i + 1] = clamp255((px.g - (1 - alphaFactor) * keyColor.g) / alphaFactor);
      data[i + 2] = clamp255((px.b - (1 - alphaFactor) * keyColor.b) / alphaFactor);
    }

    data[i + 3] = clamp255(data[i + 3] * alphaFactor);
  }
}
