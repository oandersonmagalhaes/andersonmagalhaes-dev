import { removeBackground, type Config } from "@imgly/background-removal";

export type WorkerRequest = { file: Blob };

export type WorkerResponse =
  | { type: "progress"; current: number; total: number; key: string }
  | { type: "done"; blob: Blob }
  | { type: "error"; message: string };

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { file } = event.data;

  const reportProgress = (key: string, current: number, total: number) => {
    const message: WorkerResponse = { type: "progress", key, current, total };
    self.postMessage(message);
  };

  // "isnet" is the full-precision model — sharpest cutouts on hair/edges.
  const buildConfig = (device: "gpu" | "cpu"): Config => ({
    model: "isnet",
    output: { format: "image/png", quality: 1 },
    device,
    progress: reportProgress,
  });

  try {
    let blob: Blob;
    try {
      blob = await removeBackground(file, buildConfig("gpu"));
    } catch {
      // Browsers without WebGPU fall back to CPU.
      blob = await removeBackground(file, buildConfig("cpu"));
    }
    const message: WorkerResponse = { type: "done", blob };
    self.postMessage(message);
  } catch (err) {
    const message: WorkerResponse = {
      type: "error",
      message: err instanceof Error ? err.message : String(err),
    };
    self.postMessage(message);
  }
};
