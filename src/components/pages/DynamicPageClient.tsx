'use client';

import { useEffect } from 'react';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import ResearchPage from '@/components/pages/ResearchPage';
import { Publication } from '@/types/publication';
import {
  PublicationPageConfig,
  TextPageConfig,
  CardPageConfig,
  ResearchPageConfig,
} from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

export type DynamicPageLocaleData =
  | { type: 'publication'; config: PublicationPageConfig; publications: Publication[]; draftsConfig?: CardPageConfig | null }
  | { type: 'research'; config: ResearchPageConfig; publications: Publication[]; draftsConfig?: CardPageConfig | null }
  | { type: 'text'; config: TextPageConfig; content: string }
  | { type: 'card'; config: CardPageConfig };

interface DynamicPageClientProps {
  dataByLocale: Record<string, DynamicPageLocaleData>;
  defaultLocale: string;
}

export default function DynamicPageClient({ dataByLocale, defaultLocale }: DynamicPageClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const pageData = dataByLocale[locale] || fallback;

  useEffect(() => {
    if (!pageData || typeof window === 'undefined') return;

    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (!hash) return;

    const scrollToTarget = () => {
      document.getElementById(hash)?.scrollIntoView({ block: 'start' });
    };

    requestAnimationFrame(scrollToTarget);
    const timeoutId = window.setTimeout(scrollToTarget, 120);

    return () => window.clearTimeout(timeoutId);
  }, [pageData]);

  if (!pageData) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {pageData.type === 'publication' && (
        <>
          <PublicationsList config={pageData.config} publications={pageData.publications} />
          {pageData.draftsConfig && (
            <div id="drafts" className="mt-16 scroll-mt-24">
              <CardPage
                config={pageData.draftsConfig}
                showItemNumbers={true}
                numberPrefix="D"
                itemAnchorPrefix="draft"
              />
            </div>
          )}
        </>
      )}
      {pageData.type === 'research' && (
        <ResearchPage
          config={pageData.config}
          publications={pageData.publications}
          draftsConfig={pageData.draftsConfig}
        />
      )}
      {pageData.type === 'text' && (
        <TextPage config={pageData.config} content={pageData.content} />
      )}
      {pageData.type === 'card' && (
        <CardPage config={pageData.config} />
      )}
    </div>
  );
}
