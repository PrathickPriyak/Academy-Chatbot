import { reindexKnowledge } from "../src/lib/knowledge/reindex";

reindexKnowledge()
  .then((count) => {
    console.log(`Indexed ${count} knowledge chunks.`);
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
