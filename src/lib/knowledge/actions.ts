"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin-session";
import { db } from "@/lib/db";
import { z } from "zod";

import type { ActionState } from "@/lib/courses/actions";

const customSchema = z.object({
  title: z.string().trim().min(2).max(160),
  content: z.string().trim().min(2).max(8000),
});

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/knowledge");
}

export async function addCustomKnowledge(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = customSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Enter a title and knowledge text." };
  }
  await db.customKnowledge.create({ data: parsed.data });
  refresh();
  return { ok: true, message: "Custom knowledge saved. Update AI knowledge to index it." };
}

export async function deleteKnowledge(formData: FormData): Promise<void> {
  await requireAdmin();
  const chunkId = String(formData.get("chunkId") ?? "");
  const customId = String(formData.get("customId") ?? "");
  if (customId) {
    await db.customKnowledge.delete({ where: { id: customId } });
  } else if (chunkId) {
    await db.knowledgeChunk.delete({ where: { id: chunkId } });
  }
  refresh();
}

export async function listIndexedKnowledge(query: string) {
  await requireAdmin();
  const term = query.trim();
  return db.knowledgeChunk.findMany({
    where: term
      ? {
          OR: [
            { title: { contains: term, mode: "insensitive" } },
            { content: { contains: term, mode: "insensitive" } },
            { sourceType: { contains: term, mode: "insensitive" } },
          ],
        }
      : {},
    select: {
      id: true,
      title: true,
      content: true,
      sourceType: true,
      updatedAt: true,
      customKnowledgeId: true,
      course: { select: { id: true, title: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });
}
