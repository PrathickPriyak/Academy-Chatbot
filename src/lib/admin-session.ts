import { cookies } from "next/headers";

import { adminCookieName, createAdminToken, verifyAdminToken } from "@/lib/admin-token";
import { rateLimit } from "@/lib/security/rate-limit";

export const demoAdmin = {
  email: "admin@infozub.academy",
  password: "academy-preview",
};

export function adminCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL ?? demoAdmin.email;
  const password = process.env.ADMIN_PASSWORD ?? (process.env.NODE_ENV === "production" ? "" : demoAdmin.password);
  if (!email || !password) {
    return null;
  }
  return { email, password };
}

const weekSeconds = 60 * 60 * 24 * 7;

export async function isAdminSignedIn(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  if (!token) {
    return false;
  }
  return verifyAdminToken(token);
}

export async function signInAdmin(email: string, password: string): Promise<boolean> {
  const attempts = rateLimit(`login:${email.toLowerCase()}`, 8, 10 * 60_000);
  if (!attempts.ok) {
    return false;
  }
  const credentials = adminCredentials();
  if (!credentials || email !== credentials.email || password !== credentials.password) {
    return false;
  }
  const jar = await cookies();
  jar.set(adminCookieName, await createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: weekSeconds,
  });
  return true;
}

export async function signOutAdmin(): Promise<void> {
  const jar = await cookies();
  jar.delete(adminCookieName);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminSignedIn())) {
    throw new Error("Admin sign-in is required.");
  }
}
