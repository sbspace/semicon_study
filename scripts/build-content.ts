import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildContent, ContentBuildError } from '../src/content/write.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

try {
  const result = await buildContent(
    path.join(projectRoot, 'content'),
    path.join(projectRoot, '.generated', 'content'),
  );
  console.log(`Generated ${result.documentCount} content documents in ${result.outputDirectory}`);
  console.log(`sourceDigest: ${result.index.sourceDigest}`);
} catch (error) {
  if (error instanceof ContentBuildError) {
    for (const item of error.diagnostics) {
      console.error(`${item.severity.toUpperCase()} ${item.code} ${item.path}: ${item.message}`);
    }
  }
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
