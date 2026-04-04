import crypto from "crypto";

export const createSignature = (input = "") => {
  if (!input) return "";
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 32);
};
