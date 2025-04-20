import crypto from "crypto";

export function generateVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h from now
  return { token, expires };
}
