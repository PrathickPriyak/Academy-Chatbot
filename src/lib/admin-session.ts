import { cookies } from "next/headers";

const cookieName = "infozub_admin";

export const demoAdmin = {
  email: "admin@infozub.academy",
  password: "academy-preview",
};

export async function isAdminSignedIn(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(cookieName)?.value === "signed-in";
}

export async function signInAdmin(email: string, password: string): Promise<boolean> {
  if (email !== demoAdmin.email || password !== demoAdmin.password) {
    return false;
  }
  const jar = await cookies();
  jar.set(cookieName, "signed-in", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return true;
}

export async function signOutAdmin(): Promise<void> {
  const jar = await cookies();
  jar.delete(cookieName);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminSignedIn())) {
    throw new Error("Admin sign-in is required.");
  }
}
