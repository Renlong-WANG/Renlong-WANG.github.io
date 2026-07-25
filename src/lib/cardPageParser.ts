import type { CardPageConfig } from '@/types/page';
import { getHighlightNames, parseAuthors } from './bibtexParser';

export function parseCardPageAuthors(config: CardPageConfig, locale?: string): CardPageConfig {
  const highlightNames = getHighlightNames(locale);

  return {
    ...config,
    items: config.items.map((item) => ({
      ...item,
      authors: item.author ? parseAuthors(item.author, highlightNames) : [],
    })),
  };
}
