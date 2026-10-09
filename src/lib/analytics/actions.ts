"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin-session";
import { db } from "@/lib/db";

export async function deleteConversationAnalytics(): Promise<void> {
  await requireAdmin();
  await db.analyticsEvent.deleteMany();
  await db.conversationMessage.deleteMany();
  await db.conversation.deleteMany();
  revalidatePath("/admin");
}
