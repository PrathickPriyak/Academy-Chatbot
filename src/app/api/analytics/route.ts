import { z } from "zod";

import { recordAnalyticsEvent } from "@/lib/analytics/events";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const publicEventSchema = z.object({
  type: z.enum(["chat_started", "course_clicked", "contact_clicked"]),
  courseTitle: z.string().trim().min(1).max(160).optional(),
});

export async function POST(request: Request): Promise<Response> {
  const parsed = publicEventSchema.safeParse(await request.json());
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
