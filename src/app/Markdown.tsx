import { Children, isValidElement, type ReactNode } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import { Link } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

import type { ContentIndex } from '../content/types.js';

function escapeRawHtml(markdown: string): string {
  return markdown.replace(/<\/?[A-Za-z][^>\n]*>/g, value =>
    `&lt;${value.slice(1, -1)}&gt;`,
  );
}

function resolvePath(currentPath: string, target: string): string {
  const directory = currentPath.split('/').slice(0, -1);
  for (const part of target.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') directory.pop();
    else directory.push(part);
  }
  return directory.join('/');
}

export function internalContentRoute(
  href: string,
  currentPath: string,
  index: ContentIndex,
): string | undefined {
  if (href.startsWith('#')) return undefined;
  const [withoutHash, hash] = href.split('#', 2);
  const [pathname] = (withoutHash ?? '').split('?', 1);
  if (!pathname?.toLowerCase().endsWith('.md')) return undefined;
  const resolved = resolvePath(currentPath, decodeURIComponent(pathname));
  const id = index.idByPath[resolved];
  if (id === undefined) return undefined;
  const entry = index.documentsById[id];
  const route = entry?.kind === 'module'
    ? `/modules/${encodeURIComponent(id)}`
    : `/learn/${encodeURIComponent(id)}`;
  return hash === undefined ? route : `${route}#${hash}`;
}

function safeUrl(url: string): string {
  if (/^(?:javascript|vbscript|data):/i.test(url.trim())) return '';
  return defaultUrlTransform(url);
}

function nodeText(value: ReactNode): string {
  return Children.toArray(value).map(child => {
    if (typeof child === 'string' || typeof child === 'number') return String(child);
    if (isValidElement<{ children?: ReactNode }>(child)) return nodeText(child.props.children);
    return '';
  }).join('');
}

export function Markdown({
  markdown,
  currentPath,
  index,
  suppressDocumentHeadings = false,
  documentTitle,
}: {
  markdown: string;
  currentPath: string;
  index: ContentIndex;
  suppressDocumentHeadings?: boolean;
  documentTitle?: string;
}) {
  return (
    <div className="content-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        urlTransform={safeUrl}
        components={{
          h1({ children }) {
            if (suppressDocumentHeadings) return null;
            return <h1>{children}</h1>;
          },
          h2({ children }) {
            if (suppressDocumentHeadings && documentTitle !== undefined &&
              nodeText(children).trim() === documentTitle.trim()) return null;
            return <h2>{children}</h2>;
          },
          a({ href = '', children, node: _node, ...props }) {
            const internal = internalContentRoute(href, currentPath, index);
            if (internal !== undefined) return <Link to={internal}>{children}</Link>;
            const external = /^https?:\/\//i.test(href);
            return (
              <a
                {...props}
                href={safeUrl(href)}
                {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {escapeRawHtml(markdown)}
      </ReactMarkdown>
    </div>
  );
}
