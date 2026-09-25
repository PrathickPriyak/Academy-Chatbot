import { createHash } from "node:crypto";

import type { KnowledgeDocument } from "./chunk";

export function hashDocument(document: KnowledgeDocument): string {
  return createHash("sha256")
    .update(
      [
        document.courseId ?? "",
        document.customKnowledgeId ?? "",
        document.sourceType,
        document.title,
        document.content,
      ].join("\0"),
    )
    .digest("hex");
}
