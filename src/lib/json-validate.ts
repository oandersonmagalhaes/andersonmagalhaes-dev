/**
 * Pure JSON validation helper for the JSON Validator tool.
 *
 * Returns a structured result instead of throwing so the UI can render
 * inline errors with line numbers.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
}

export function validateJson(input: string): ValidationResult {
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
