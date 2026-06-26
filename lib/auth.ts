import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "cv_admin";

/** Token de sesión derivado de la contraseña (no se guarda la clave en claro). */
export function sessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "cv-fallback-secret";
  const pass = process.env.ADMIN_PASSWORD || "";
  return crypto.createHmac("sha256", secret).update(pass).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** Compara la contraseña ingresada con ADMIN_PASSWORD. */
export function checkPassword(input: string): boolean {
  const pass = process.env.ADMIN_PASSWORD || "";
  if (!pass) return false;
  return safeEqual(input, pass);
}

/** ¿La request actual tiene una sesión de admin válida? */
export function isAuthed(): boolean {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, sessionToken());
}
