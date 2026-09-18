import { useEffect, useState } from 'react';

import type { ContentDocument, ContentIndex } from '../content/types.js';
import { useContentLoader } from './ContentContext.js';

export interface AsyncState<T> {
  data?: T;
  error?: Error;
  loading: boolean;
}

export function useContentIndex(): AsyncState<ContentIndex> {
  const loader = useContentLoader();
  const [state, setState] = useState<AsyncState<ContentIndex>>({ loading: true });
  useEffect(() => {
    let active = true;
    void loader.loadIndex().then(
      data => { if (active) setState({ data, loading: false }); },
      error => { if (active) setState({ error: error instanceof Error ? error : new Error(String(error)), loading: false }); },
    );
    return () => { active = false; };
  }, [loader]);
  return state;
}

export function useContentDocument(id: string | undefined): AsyncState<ContentDocument> {
  const loader = useContentLoader();
  const [state, setState] = useState<AsyncState<ContentDocument>>({ loading: true });
  useEffect(() => {
    let active = true;
    if (id === undefined || id.length === 0) {
      setState({ error: new Error('문서 ID가 없습니다.'), loading: false });
      return () => { active = false; };
    }
    setState({ loading: true });
    void loader.getDocument(id).then(
      data => { if (active) setState({ data, loading: false }); },
      error => { if (active) setState({ error: error instanceof Error ? error : new Error(String(error)), loading: false }); },
    );
    return () => { active = false; };
  }, [id, loader]);
  return state;
}
