import { z } from "zod";

import { recordAnalyticsEvent } from "@/lib/analytics/events";
import { db } from "@/lib/db";
import { clientKey, rateLimit, tooManyRequests } from "@/lib/security/rate-limit";
import { readJson } from "@/lib/security/requests";

export const runtime = "nodejs";

const publicEventSchema = z.object({
  type: z.enum(["chat_started", "course_clicked", "contact_clicked"]),
  courseTitle: z.string().trim().min(1).max(160).optional(),
});

export async function POST(request: Request): Promise<Response> {
  const limit = rateLimit(clientKey(request, "analytics"), 60, 60_000);
  if (!limit.ok) {
    return tooManyRequests(limit.retryAfter);
  }

  let payload: unknown;
  try {
    payload = await readJson(request, 2_000);
  } catch {
    return Response.json({ error: "Invalid analytics event." }, { status: 400 });
  }

  const parsed = publicEventSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: "Invalid analytics event." }, { status: 400 });
  }

  if (parsed.data.type === "course_clicked") {
    const course = await db.course.findFirst({
      where: { title: parsed.data.courseTitle, published: true },
      select: { title: true },
    });
    if (!course) {
      return Response.json({ error: "Unknown course." }, { status: 400 });
    }
    await recordAnalyticsEvent({ type: "course_clicked", courseTitle: course.title });
    return Response.json({ ok: true });
  }

  await recordAnalyticsEvent({ type: parsed.data.type });
  return Response.json({ ok: true });
}
