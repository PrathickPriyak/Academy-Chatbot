import { NextResponse } from "next/server";

import { site } from "@/data/site";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
};

const rateMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string, limit = 12, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || entry.resetAt < now) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const body = (await request.json()) as ContactBody;
    const name = asTrimmedString(body.name, 120);
    const email = asTrimmedString(body.email, 200);
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
    const subject = asTrimmedString(body.subject, 160);
    const message = asTrimmedString(body.message, 4000);

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }
    if (!subject || subject.length < 3) {
      return NextResponse.json({ error: "Subject is required." }, { status: 400 });
    }
    if (!message || message.length < 10) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const composed = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Subject: ${subject}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`[Academy] ${subject}`)}&body=${encodeURIComponent(composed)}`;

    return NextResponse.json({ ok: true, mailto });
  } catch {
    return NextResponse.json({ error: "Unable to process that request right now." }, { status: 500 });
  }
}
