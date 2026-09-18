import type { Root } from 'mdast';

import { markdownFragment, sourceSpan, type LocatedMarkdownSource } from './locations.js';
import type {
  ContentBlock,
  ContentId,
  Diagnostic,
  InteractiveDeclaration,
  VisualPlaceholder,
} from './types.js';

export type DirectiveOccurrence =
  | {
      kind: 'interactive';
      start: number;
      end: number;
      value: InteractiveDeclaration;
    }
  | {
      kind: 'visual';
      start: number;
      end: number;
      value: VisualPlaceholder;
    }
  | {
      kind: 'unsupported-directive';
      start: number;
      end: number;
      tagName: string;
    };

interface ParsedTag {
  tagName: string;
  attributes: Record<string, string>;
}

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAG_LINE = /^[\t ]*<([a-z][a-z0-9-]*)([\s\S]*?)\/>[\t ]*$/;
const KNOWN_TAG_START = /^[\t ]*<(interactive|visual-needed)\b/;

function decodeEntity(value: string): string {
  return value.replace(
    /&(?:quot|apos|amp|lt|gt|#\d+|#x[\da-f]+);/gi,
    (entity) => {
      const named: Record<string, string> = {
        '&quot;': '"',
        '&apos;': "'",
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
      };
      const known = named[entity.toLowerCase()];
      if (known !== undefined) return known;
      const hexadecimal = entity.toLowerCase().startsWith('&#x');
      const digits = entity.slice(hexadecimal ? 3 : 2, -1);
      const codePoint = Number.parseInt(digits, hexadecimal ? 16 : 10);
      return Number.isNaN(codePoint) || codePoint > 0x10ffff
        ? entity
        : String.fromCodePoint(codePoint);
    },
  );
}

function parseTag(line: string): ParsedTag | undefined {
  const match = TAG_LINE.exec(line);
  if (match === null) return undefined;
  const tagName = match[1];
  const input = match[2] ?? '';
  if (tagName === undefined) return undefined;

  const attributes: Record<string, string> = {};
  let cursor = 0;
  while (cursor < input.length) {
    while (/\s/.test(input[cursor] ?? '')) cursor += 1;
    if (cursor === input.length) break;
    const nameMatch = /^[a-z][a-z0-9_-]*/.exec(input.slice(cursor));
    if (nameMatch === null) return undefined;
    const name = nameMatch[0];
    cursor += name.length;
    while (/\s/.test(input[cursor] ?? '')) cursor += 1;
    if (input[cursor] !== '=') return undefined;
    cursor += 1;
    while (/\s/.test(input[cursor] ?? '')) cursor += 1;
    const quote = input[cursor];
    if (quote !== '"' && quote !== "'") return undefined;
    cursor += 1;
    const valueStart = cursor;
    while (cursor < input.length && input[cursor] !== quote) cursor += 1;
    if (cursor === input.length || Object.hasOwn(attributes, name)) return undefined;
    attributes[name] = decodeEntity(input.slice(valueStart, cursor));
    cursor += 1;
  }
  return { tagName, attributes };
}

function directiveError(
  diagnostics: Diagnostic[],
  source: LocatedMarkdownSource,
  start: number,
  end: number,
  code: string,
  message: string,
): void {
  diagnostics.push({
    severity: 'error',
    code,
    message,
    path: source.path,
    source: sourceSpan(source, start, end),
  });
}

function parseKnownDirective(
  line: string,
  start: number,
  end: number,
  documentId: ContentId,
  ordinals: { interactive: number; visual: number },
  source: LocatedMarkdownSource,
  diagnostics: Diagnostic[],
): DirectiveOccurrence {
  const expectedTag = KNOWN_TAG_START.exec(line)?.[1] ?? 'unknown';
  const parsed = parseTag(line);
  if (parsed === undefined || parsed.tagName !== expectedTag) {
    directiveError(
      diagnostics,
      source,
      start,
      end,
      'MALFORMED_DIRECTIVE',
      `Malformed <${expectedTag}> directive; attributes must be unique quoted name/value pairs in a self-closing tag`,
    );
    return { kind: 'unsupported-directive', start, end, tagName: expectedTag };
  }

  const type = parsed.attributes.type;
  if (type === undefined || type.length === 0) {
    directiveError(
      diagnostics,
      source,
      start,
      end,
      'MISSING_DIRECTIVE_ATTRIBUTE',
      `<${parsed.tagName}> requires a non-empty type attribute`,
    );
    return { kind: 'unsupported-directive', start, end, tagName: parsed.tagName };
  }
  if (!KEBAB_CASE.test(type)) {
    directiveError(
      diagnostics,
      source,
      start,
      end,
      'INVALID_DIRECTIVE_TYPE',
      `<${parsed.tagName}> type must be a lowercase kebab-case identifier`,
    );
    return { kind: 'unsupported-directive', start, end, tagName: parsed.tagName };
  }

  const knownAttributes =
    parsed.tagName === 'interactive'
      ? new Set(['type'])
      : new Set(['id', 'type', 'description']);
  for (const name of Object.keys(parsed.attributes)) {
    if (!knownAttributes.has(name)) {
      diagnostics.push({
        severity: 'warning',
        code: 'UNKNOWN_DIRECTIVE_ATTRIBUTE',
        message: `Unknown ${parsed.tagName} attribute ${name} is preserved`,
        path: source.path,
        source: sourceSpan(source, start, end),
      });
    }
  }

  const original = markdownFragment(source, start, end);
  if (parsed.tagName === 'interactive') {
    ordinals.interactive += 1;
    return {
      kind: 'interactive',
      start,
      end,
      value: {
        instanceId: `${documentId}:interactive:${ordinals.interactive}`,
        documentId,
        type,
        attributes: parsed.attributes,
        original,
      },
    };
  }

  const description = parsed.attributes.description;
  if (description === undefined || description.length === 0) {
    directiveError(
      diagnostics,
      source,
      start,
      end,
      'MISSING_DIRECTIVE_ATTRIBUTE',
      '<visual-needed> requires a non-empty description attribute',
    );
    return { kind: 'unsupported-directive', start, end, tagName: parsed.tagName };
  }
  ordinals.visual += 1;
  const value: VisualPlaceholder = {
    instanceId: `${documentId}:visual:${ordinals.visual}`,
    documentId,
    type,
    description,
    attributes: parsed.attributes,
    original,
    ...(parsed.attributes.id === undefined ? {} : { sourceId: parsed.attributes.id }),
  };
  return { kind: 'visual', start, end, value };
}

export function extractDirectiveOccurrences(
  documentId: ContentId,
  source: LocatedMarkdownSource,
  tree: Root,
  diagnostics: Diagnostic[],
): DirectiveOccurrence[] {
  const occurrences: DirectiveOccurrence[] = [];
  const ordinals = { interactive: 0, visual: 0 };

  for (const node of tree.children) {
    if (node.type !== 'html' || node.position?.start.offset === undefined) continue;
    const nodeStart = node.position.start.offset;
    const raw = source.body.slice(nodeStart, node.position.end.offset);
    const lines = raw.split('\n');
    const isDirectiveOnlyNode = lines.every((line) => {
      if (line.trim().length === 0) return true;
      if (KNOWN_TAG_START.test(line)) return true;
      const parsed = parseTag(line);
      return parsed !== undefined && parsed.tagName.includes('-');
    });
    if (!isDirectiveOnlyNode) continue;
    let lineStart = 0;
    for (const line of lines) {
      const start = nodeStart + lineStart;
      const end = start + line.length;
      const knownTag = KNOWN_TAG_START.exec(line)?.[1];
      if (knownTag !== undefined) {
        occurrences.push(
          parseKnownDirective(line, start, end, documentId, ordinals, source, diagnostics),
        );
      } else {
        const parsed = parseTag(line);
        if (parsed !== undefined && parsed.tagName.includes('-')) {
          diagnostics.push({
            severity: 'warning',
            code: 'UNSUPPORTED_DIRECTIVE',
            message: `Unsupported standalone directive <${parsed.tagName}> is preserved as source`,
            path: source.path,
            source: sourceSpan(source, start, end),
          });
          occurrences.push({
            kind: 'unsupported-directive',
            start,
            end,
            tagName: parsed.tagName,
          });
        }
      }
      lineStart += line.length + 1;
    }
  }
  return occurrences.sort((left, right) => left.start - right.start);
}

export function blocksFromDirectives(
  source: LocatedMarkdownSource,
  occurrences: DirectiveOccurrence[],
): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let cursor = 0;
  for (const occurrence of occurrences) {
    if (occurrence.start > cursor) {
      blocks.push({
        kind: 'markdown',
        content: markdownFragment(source, cursor, occurrence.start),
      });
    }
    if (occurrence.kind === 'interactive') {
      blocks.push({ kind: 'interactive', value: occurrence.value });
    } else if (occurrence.kind === 'visual') {
      blocks.push({ kind: 'visual', value: occurrence.value });
    } else {
      blocks.push({
        kind: 'unsupported-directive',
        original: markdownFragment(source, occurrence.start, occurrence.end),
        tagName: occurrence.tagName,
      });
    }
    cursor = occurrence.end;
  }
  if (cursor < source.body.length) {
    blocks.push({
      kind: 'markdown',
      content: markdownFragment(source, cursor, source.body.length),
    });
  }
  return blocks;
}
