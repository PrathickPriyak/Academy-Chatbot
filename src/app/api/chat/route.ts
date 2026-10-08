import { NextResponse } from "next/server";

import { answerQuestion } from "@/lib/chat/answer";

const rateMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string, limit = 20, windowMs = 60_000): boolean {
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

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const body = (await request.json()) as { message?: unknown };
    if (typeof body.message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const message = body.message.trim();
    if (!message || message.length > 1000) {
      return NextResponse.json({ error: "Message must be between 1 and 1000 characters." }, { status: 400 });
    }

    const reply = await answerQuestion(message);
    return NextResponse.json({
      answer: reply.answer,
      outOfScope: reply.outOfScope,
      unknown: reply.unknown,
      contactSuggested: reply.contactSuggested,
      contactCtaLabel: reply.contactCtaLabel,
      sources: reply.sources,
    });
  } catch {
    return NextResponse.json({ error: "Unable to process that request right now." }, { status: 500 });
  }
}
