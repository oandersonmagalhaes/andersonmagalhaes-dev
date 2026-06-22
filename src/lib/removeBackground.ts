import type { WorkerResponse } from "@/app/[locale]/background-remover/bgRemover.worker";

export type ProgressStage = "loadingModel" | "removingBg";
export type ProgressHandler = (ratio: number, stage: ProgressStage) => void;

export function removeImageBackground(
  source: Blob,
  onProgress?: ProgressHandler,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL(
        "@/app/[locale]/background-remover/bgRemover.worker",
        import.meta.url,
      ),
    );

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const data = event.data;
      if (data.type === "progress") {
        if (onProgress) {
          const ratio = data.total > 0 ? data.current / data.total : 0;
          const stage: ProgressStage = data.key.startsWith("fetch")
            ? "loadingModel"
            : "removingBg";
          onProgress(ratio, stage);
        }
      } else if (data.type === "done") {
        resolve(data.blob);
        worker.terminate();
      } else if (data.type === "error") {
        reject(new Error(data.message));
        worker.terminate();
      }
    };

    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };

    worker.postMessage({ file: source } satisfies { file: Blob });
  });
}
