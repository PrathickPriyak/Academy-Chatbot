import { reindexKnowledge } from "../src/lib/knowledge/reindex";

reindexKnowledge((progress) => {
  if (progress.error) {
    console.error(progress.error);
  }
})
  .then((result) => {
    console.log(
      `Indexed ${result.embedded} changed chunks. Skipped ${result.skipped}. Deleted ${result.deleted}.`,
    );
    if (result.errors.length > 0) {
      process.exitCode = 1;
    }
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
