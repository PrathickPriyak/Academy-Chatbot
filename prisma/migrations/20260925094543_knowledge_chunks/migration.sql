-- CreateTable
CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(768),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KnowledgeChunk_courseId_idx" ON "KnowledgeChunk"("courseId");

-- CreateIndex
CREATE INDEX "KnowledgeChunk_sourceType_idx" ON "KnowledgeChunk"("sourceType");

-- AddForeignKey
ALTER TABLE "KnowledgeChunk" ADD CONSTRAINT "KnowledgeChunk_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "KnowledgeChunk_embedding_idx" ON "KnowledgeChunk" USING hnsw ("embedding" vector_cosine_ops);
