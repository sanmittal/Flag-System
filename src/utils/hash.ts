import crypto from "crypto";

export function isInRollout(userId: string, percentage: number) {
  const hash = crypto.createHash("sha256").update(userId).digest("hex");
  const bucket = parseInt(hash.substring(0, 8), 16) % 100;
  return bucket < percentage;
}
