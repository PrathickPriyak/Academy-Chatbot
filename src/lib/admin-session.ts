import { cookies } from "next/headers";

import { adminCookieName, createAdminToken, verifyAdminToken } from "@/lib/admin-token";

export const demoAdmin = {
  email: "admin@infozub.academy",
  password: "academy-preview",
};

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
  if (email !== demoAdmin.email || password !== demoAdmin.password) {
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
