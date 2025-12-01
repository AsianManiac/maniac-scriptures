/**
 * Sanitizes any string to be a valid SecureStore key
 * Allowed chars: alphanumeric, ".", "-", "_"
 */
export function sanitizeKey(input: string): string {
  if (!input) return "empty";
  return input
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 200)
    .toLowerCase();
}
