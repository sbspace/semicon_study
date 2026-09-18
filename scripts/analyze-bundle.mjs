import { gzipSync } from 'node:zlib';

import { build } from 'vite';

let resolved;
const reports = [];

const reporter = {
  name: 'bundle-contribution-report',
  enforce: 'post',
  configResolved(config) {
    resolved = config;
  },
  generateBundle(_options, bundle) {
    for (const output of Object.values(bundle)) {
      if (output.type !== 'chunk') continue;
      const modules = Object.entries(output.modules)
        .map(([id, details]) => ({ id, renderedBytes: details.renderedLength }))
        .sort((left, right) => right.renderedBytes - left.renderedBytes);
      reports.push({
        file: output.fileName,
        bytes: Buffer.byteLength(output.code),
        gzipBytes: gzipSync(output.code).byteLength,
        entry: output.isEntry,
        dynamicEntry: output.isDynamicEntry,
        imports: output.imports,
        dynamicImports: output.dynamicImports,
        modules,
      });
    }
  },
};

await build({
  plugins: [reporter],
  build: { write: false },
  logLevel: 'silent',
});

const projectRoot = resolved?.root?.replaceAll('\\', '/') ?? process.cwd().replaceAll('\\', '/');
const clean = id => id.replaceAll('\\', '/').replace(projectRoot, '.');
const sorted = reports.sort((left, right) => right.bytes - left.bytes);

for (const chunk of sorted) {
  console.log(`${chunk.file}\t${chunk.bytes}\t${chunk.gzipBytes}\t${chunk.entry ? 'entry' : chunk.dynamicEntry ? 'dynamic' : 'shared'}`);
  for (const contribution of chunk.modules.slice(0, 20)) {
    console.log(`  ${contribution.renderedBytes}\t${clean(contribution.id)}`);
  }
}
