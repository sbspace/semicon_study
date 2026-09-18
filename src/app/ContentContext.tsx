import { createContext, useContext, type PropsWithChildren } from 'react';

import type { ContentLoader } from '../content/load.js';

const ContentContext = createContext<ContentLoader | null>(null);

export function ContentProvider({
  loader,
  children,
}: PropsWithChildren<{ loader: ContentLoader }>) {
  return (
    <ContentContext.Provider value={loader}>{children}</ContentContext.Provider>
  );
}

export function useContentLoader(): ContentLoader {
  const loader = useContext(ContentContext);
  if (loader === null) throw new Error('ContentProvider is missing');
  return loader;
}
