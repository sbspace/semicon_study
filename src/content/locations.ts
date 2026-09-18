import type {
  ContentPath,
  MarkdownFragment,
  SourceSpan,
} from './types.js';

export interface LocatedMarkdownSource {
  path: ContentPath;
  normalizedText: string;
  body: string;
  bodyStart: number;
  bodyStartLine: number;
}

function lineAtOffset(text: string, offset: number): number {
  let line = 1;
  for (let index = 0; index < offset; index += 1) {
    if (text.charCodeAt(index) === 10) line += 1;
  }
  return line;
}

export function sourceSpan(
  source: LocatedMarkdownSource,
  bodyStart: number,
  bodyEnd: number,
): SourceSpan {
  const start = source.bodyStart + bodyStart;
  const end = source.bodyStart + bodyEnd;
  return {
    path: source.path,
    start,
    end,
    startLine: lineAtOffset(source.normalizedText, start),
    endLine: lineAtOffset(source.normalizedText, end > start ? end - 1 : end),
  };
}

export function markdownFragment(
  source: LocatedMarkdownSource,
  bodyStart: number,
  bodyEnd: number,
): MarkdownFragment {
  return {
    markdown: source.body.slice(bodyStart, bodyEnd),
    source: sourceSpan(source, bodyStart, bodyEnd),
  };
}
